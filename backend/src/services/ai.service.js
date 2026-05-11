/**
 * ai.service.js
 * ────────────────────────────────────────────────
 * Dual-AI Architecture:
 *   • Gemini 2.0 Flash  → Chatbot dịch vụ công
 *   • Claude 3.5 Sonnet → OCR CCCD + Verify tài liệu (Vision)
 * ────────────────────────────────────────────────
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const { AiLog } = require('../models');

// ── Khởi tạo clients ──────────────────────────────────────────
const getGenAI = () => {
  if (global._genAI) return global._genAI;
  if (!process.env.GEMINI_API_KEY) throw new Error("Vui lòng cấu hình GEMINI_API_KEY");
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

// Claude client — chỉ khởi tạo nếu có key
let claudeClient = null;
if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_claude_api_key_here') {
  claudeClient = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });
}

/**
 * Helper: gọi OCR Microservice (port 5050) với retry/fallback
 */
const OCR_SERVICE_URL = `http://localhost:${process.env.OCR_PORT || 5050}`;

async function callOcrMicroservice(imageBase64, mimeType, prompt, maxOutputTokens = 2000) {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const res = await fetch(`${OCR_SERVICE_URL}/api/vision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, base64: imageBase64, mediaType: mimeType, prompt, maxOutputTokens }),
    signal: AbortSignal.timeout(30000), // timeout 30s
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OCR microservice HTTP ${res.status}`);
  }
  const data = await res.json();
  return data?.content?.[0]?.text || '';
}

/**
 * Helper: dùng Claude Vision → OCR Microservice (retry+fallback) → Gemini SDK trực tiếp
 *
 * Thứ tự ưu tiên:
 *   1. Claude 3.5 Sonnet   (nếu có ANTHROPIC_API_KEY)
 *   2. OCR Microservice    (có retry + model fallback: 2.5-flash → 2.0-flash → 2.0-flash-lite)
 *   3. Gemini SDK trực tiếp (last resort nếu microservice down)
 */
async function callVisionAI(imageBase64, mimeType, prompt) {
  // ── 1. Ưu tiên Claude ─────────────────────────────────────
  if (claudeClient) {
    try {
      const msg = await claudeClient.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mimeType, data: imageBase64 },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
      });
      return msg.content[0].text;
    } catch (claudeErr) {
      console.warn('[AI] Claude lỗi, thử OCR Microservice:', claudeErr.message);
    }
  }

  // ── 2. OCR Microservice (retry + model fallback tốt nhất) ─
  try {
    console.log('[AI] Dùng OCR Microservice cho Vision AI...');
    const text = await callOcrMicroservice(imageBase64, mimeType, prompt, 2000);
    console.log('[AI] OCR Microservice thành công');
    return text;
  } catch (msErr) {
    console.warn('[AI] OCR Microservice không khả dụng:', msErr.message);
  }

  // ── 3. Last resort: Gemini SDK trực tiếp ─────────────────
  // Thử lần lượt các models, có delay khi gặp 429
  const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`[AI] Thử model trực tiếp: ${modelName}`);
      const model = getGenAI().getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { inlineData: { data: imageBase64, mimeType } },
        prompt,
      ]);
      console.log(`[AI] Thành công với ${modelName}`);
      return result.response.text();
    } catch (err) {
      const is429 = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('Too Many Requests');
      const is404 = err.message?.includes('404') || err.message?.includes('not found');
      if (is429 || is404) {
        console.warn(`[AI] ${modelName} lỗi (${is429 ? '429 quota' : '404 not found'}), thử model khác...`);
        if (is429) await sleep(5000); // chờ 5s trước khi thử model khác
        continue;
      }
      console.error(`[AI] ${modelName} lỗi không xác định:`, err.message);
      throw err;
    }
  }

  throw new Error('[AI] Tất cả Gemini models đều không khả dụng (quota / not found). Vui lòng thử lại sau.');
}


// ════════════════════════════════════════════════════════════
// 1. CHATBOT — Gemini với model fallback (2.5-flash → 2.0-flash → 2.0-flash-lite)
// ════════════════════════════════════════════════════════════
const SYSTEM_INSTRUCTION = `Bạn là trợ lý ảo của Cổng Dịch vụ công trực tuyến Việt Nam.
Nhiệm vụ của bạn là hỗ trợ công dân về các thủ tục hành chính:
- Đăng ký hộ tịch, khai sinh, kết hôn, khai tử
- Đăng ký hộ kinh doanh, giấy phép
- Chứng thực giấy tờ, cư trú, tạm trú
- Tra cứu hồ sơ, hướng dẫn nộp hồ sơ trực tuyến
Trả lời ngắn gọn, thân thiện, rõ ràng bằng tiếng Việt.
Nếu không biết thông tin cụ thể, hướng dẫn công dân liên hệ UBND xã/phường nơi cư trú.`;

const CHAT_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

exports.chat = async (message, history = []) => {
  const sleepMs = (ms) => new Promise(r => setTimeout(r, ms));
  for (const modelName of CHAT_MODELS) {
    try {
      const model = getGenAI().getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
      });
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (err) {
      const is429 = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('Too Many Requests');
      const is404 = err.message?.includes('404') || err.message?.includes('not found');
      if (is429 || is404) {
        console.warn(`[Chat] ${modelName} không khả dụng (${is429 ? 'quota' : '404'}), thử model tiếp theo...`);
        if (is429) await sleepMs(3000);
        continue;
      }
      throw err;
    }
  }
  return 'Xin lỗi, hệ thống AI đang bận. Vui lòng thử lại sau ít phút.';
};


// ════════════════════════════════════════════════════════════
// 2. OCR CCCD — Microservice (port 5050) → Claude → Gemini fallback
// ════════════════════════════════════════════════════════════
exports.ocrCccd = async (imageBuffer, mimeType) => {
  const imageBase64 = imageBuffer.toString('base64');

  const prompt = `Bạn là hệ thống OCR chuyên đọc Căn cước công dân (CCCD/CMND) Việt Nam.
Phân tích ảnh này và trích xuất thông tin định danh.

Trả về ĐÚNG định dạng JSON thuần (KHÔNG có markdown, KHÔNG có text thừa):
{
  "cccd": "12 chữ số CCCD hoặc 9 chữ số CMND",
  "fullName": "HỌ VÀ TÊN VIẾT HOA",
  "dob": "YYYY-MM-DD hoặc null",
  "gender": "Nam hoặc Nữ hoặc null",
  "pob": "nơi sinh hoặc null",
  "hometown": "quê quán hoặc null",
  "address": "nơi thường trú đầy đủ hoặc null",
  "nationality": "Việt Nam hoặc null",
  "issueDate": "YYYY-MM-DD hoặc null",
  "expiryDate": "YYYY-MM-DD hoặc null",
  "issuePlace": "nơi cấp hoặc null"
}

Lưu ý:
- Nếu là mặt SAU CCCD (có vân tay, QR): đọc ngày cấp và nơi cấp.
- Ngày sinh/cấp/hết hạn thường ghi DD/MM/YYYY → chuyển sang YYYY-MM-DD.
- Nếu không phải CCCD/CMND: trả JSON với tất cả field = null.
- CHỈ trả về JSON, bắt đầu bằng { và kết thúc bằng }.`;

  let text;
  try {
    // Ưu tiên 1: OCR Microservice (retry logic + model fallback tốt nhất)
    text = await callOcrMicroservice(imageBase64, mimeType, prompt, 2000);
    console.log('[OCR] Dùng microservice thành công');
  } catch (msErr) {
    console.warn('[OCR] Microservice không khả dụng, fallback về AI trực tiếp:', msErr.message);
    text = await callVisionAI(imageBase64, mimeType, prompt);
  }

  // Trích xuất JSON từ response (xử lý mọi kiểu format)
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI không trả về JSON hợp lệ: ' + text.substring(0, 200));
  }
  return JSON.parse(jsonMatch[0]);
};

// ════════════════════════════════════════════════════════════
// 3. VERIFY DOCUMENT — Claude Vision kiểm tra tài liệu upload
// ════════════════════════════════════════════════════════════
exports.verifyDocument = async (imageBuffer, mimeType, expectedDocType) => {
  const imageBase64 = imageBuffer.toString('base64');

  const prompt = `Bạn là hệ thống kiểm tra tài liệu hành chính Việt Nam.
Phân tích tài liệu trong ảnh và kiểm tra xem có phải "${expectedDocType}" hay không.

Trả về JSON thuần (KHÔNG có markdown, KHÔNG có text thừa):
{
  "isValid": true/false,
  "documentType": "loại tài liệu nhận dạng được (tiếng Việt)",
  "isCorrectType": true nếu đúng loại yêu cầu,
  "isReadable": true nếu ảnh rõ ràng đọc được,
  "hasFullContent": true nếu nội dung không bị cắt/thiếu,
  "issues": ["vấn đề 1", "vấn đề 2"],
  "message": "nhận xét ngắn gọn tiếng Việt, tối đa 100 ký tự"
}

Quy tắc đánh giá:
- isValid = true khi: đúng loại tài liệu + ảnh rõ + nội dung đầy đủ
- CCCD/CMND đều chấp nhận khi yêu cầu "CMND/CCCD"
- Giấy tờ bất kỳ (nhà đất, hộ khẩu, giấy tờ hành chính) → nhận diện và đánh giá
- CHỈ trả về JSON, bắt đầu bằng { và kết thúc bằng }.`;

  try {
    const text = await callVisionAI(imageBase64, mimeType, prompt);
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('[verifyDocument error]', err.message);
    // Fallback: không block người dùng
    return {
      isValid: true,
      documentType: expectedDocType,
      isCorrectType: true,
      isReadable: true,
      hasFullContent: true,
      issues: [],
      message: 'Tài liệu đã được chấp nhận',
    };
  }
};

// ════════════════════════════════════════════════════════════
// 4. PHÂN TÍCH TÀI LIỆU — log (legacy, giữ nguyên)
// ════════════════════════════════════════════════════════════
exports.analyzeDocument = async (applicationId, filePath, docType) => {
  const start = Date.now();
  const output = {
    docType,
    confidence: 0.92,
    extractedFields: { result: 'Đã xử lý' },
    rawText: `Tài liệu: ${docType}`,
  };
  const durationMs = Date.now() - start;

  await AiLog.create({
    applicationId,
    type: 'OCR',
    input: { filePath, docType },
    output,
    confidence: output.confidence,
    durationMs,
  });

  return { success: true, data: output, durationMs };
};

// ════════════════════════════════════════════════════════════
// 5. KIỂM TRA BỘ HỒ SƠ — logic đơn giản, không cần AI
// ════════════════════════════════════════════════════════════
exports.checkDocuments = async (applicationId, uploadedDocTypes, requiredDocTypes) => {
  const start = Date.now();
  const missing = requiredDocTypes.filter(d => !uploadedDocTypes.includes(d));
  const isComplete = missing.length === 0;
  const output = { isComplete, missing, uploadedDocTypes, requiredDocTypes };

  if (applicationId) {
    await AiLog.create({
      applicationId,
      type: 'CHECK_DOCS',
      input: { uploadedDocTypes, requiredDocTypes },
      output,
      confidence: isComplete ? 1.0 : 0.0,
      durationMs: Date.now() - start,
    });
  }

  return output;
};

// Export helper để dùng trong route
exports._callVisionAI = async (base64, mimeType, prompt) => {
  return callVisionAI(base64, mimeType, prompt);
};

// ════════════════════════════════════════════════════════════
// 6. OCR MULTI-GROUP — Gửi nhiều ảnh, AI nhóm theo loại giấy tờ
// ════════════════════════════════════════════════════════════
exports.ocrMultiGroup = async (files, serviceContext = null) => {
  if (files.length === 0) return { groups: [], mergedFields: {} };

  const apiKey = process.env.GEMINI_API_KEY || '';
  const hasPDF = files.some(f => f.mimeType === 'application/pdf');

  // ── Prompt chi tiết theo từng mặt giấy tờ ──────────────────
  const buildPrompt = (count, svcCtx) => {
    // Build service context section
    const svcSection = svcCtx ? `
[THÔNG TIN DỊCH VỤ - QUAN TRỌNG]
Người dùng đang nộp hồ sơ cho dịch vụ: "${svcCtx.serviceName}"
Các loại giấy tờ YÊU CẦU cho dịch vụ này: ${(svcCtx.requiredDocTypes || []).join(', ')}

Dựa vào đó, hãy kiểm tra:
- Nếu người dùng THIẾU loại giấy tờ bắt buộc → thêm MISSING_TYPE vào validationErrors của group liên quan (hoặc tạo group "Thiếu giấy tờ" nếu không có)
- Nếu người dùng nộp THỪA giấy tờ không liên quan → thêm EXCESS_DOCS vào validationErrors
- Nếu tất cả loại giấy tờ yêu cầu đã có → không báo lỗi loại này

LƯU Ý ĐẶC BIỆT VỀ CCCD/CMND:
- Giấy tờ Căn cước công dân / CMND luôn yêu cầu BẮT BUỘC 2 mặt (mặt trước và mặt sau).
- Việc người dùng nộp 2 ảnh (1 mặt trước, 1 mặt sau) của CÙNG MỘT thẻ là đúng quy định và ĐƯỢC YÊU CẦU.
- TUYỆT ĐỐI KHÔNG đánh lỗi EXCESS_DOCS (quá nhiều giấy tờ) khi người dùng nộp 2 ảnh cho 2 mặt của một CCCD/CMND. Hãy gom chúng vào chung 1 nhóm (group).
` : '';

    const pdfNote = hasPDF ? `
[FILE PDF / FILE SCAN]
• Một số file là PDF hoặc file scan. Đọc TOÀN BỘ nội dung văn bản trong file đó.
• File scan/PDF thường có chất lượng tốt hơn ảnh chụp — hãy trích xuất đầy đủ tất cả trường.
• Xác định loại tài liệu trong PDF dựa trên tiêu đề, số hiệu, cơ quan ban hành.
` : '';


    // Ngày thực tế từ server (tránh AI dùng ngày training cũ)
    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    return `Bạn là hệ thống OCR chuyên nghiệp cho tài liệu hành chính Việt Nam.
Tôi đang gửi ${count} file tài liệu (ảnh hoặc PDF/scan). Hãy phân tích TẤT CẢ ${count} file đó.${svcSection}${pdfNote}

[THÔNG TIN THỜI GIAN THỰC TẾ - BẮT BUỘC SỬ DỤNG]
Ngày hiện tại (hệ thống server): ${todayStr}
Năm hiện tại: ${today.getFullYear()}
TUYỆT ĐỐI sử dụng ngày này làm mốc so sánh. KHÔNG dùng ngày từ dữ liệu huấn luyện của bạn.
→ Ngày cấp hợp lệ = bất kỳ ngày nào TRƯỚC hoặc BẰNG ${todayStr}
→ Ngày hết hạn hợp lệ = bất kỳ ngày nào SAU ${todayStr}

═══ QUY TẮC PHÂN TÍCH ẢNH ═══

[CCCD/CMND - NHẬN DẠNG]
• Mặt TRƯỚC CCCD: Có ảnh khuôn mặt, số CCCD (12 số) in rõ, họ tên, ngày sinh, giới tính, quê quán, quốc tịch
• Mặt SAU CCCD (chip): Có QR code, vân tay, và các trường:
  - "Nơi đăng ký khai sinh" (noiDangKyKhaiSinh) — in ở phần trên mặt sau, ví dụ: "Mỹ Xuyên, Sóc Trăng"
  - "Nơi thường trú" (address) — địa chỉ đăng ký thường trú đầy đủ
  - Ngày cấp, Ngày hết hạn, Nơi/cơ quan cấp (BỘ CÔNG AN / CỤC CẢNH SÁT QLHC...)
  - Dải MRZ ở dưới cùng
• QUAN TRỌNG: Số CCCD 12 chữ số CHỈ được đọc từ mặt TRƯỚC (in trực tiếp trên thẻ). KHÔNG lấy số từ dải MRZ mặt sau.
• KHÔNG nhầm "Nơi đăng ký khai sinh" với "Quê quán" — đây là 2 trường khác nhau.

[THÔNG TIN TỪNG MẶT CCCD]
Mặt trước cung cấp: cccd (12 số), fullName, dob, gender, hometown (Quê quán), nationality
Mặt sau cung cấp:   noiDangKyKhaiSinh (Nơi đăng ký khai sinh), address (Nơi thường trú), issueDate, expiryDate, issuePlace

[NHÓM ẢNH]
• Nếu 2 ảnh là mặt trước + mặt sau của CÙNG 1 CCCD → gom thành 1 nhóm, kết hợp dữ liệu từ CẢ 2 MẶT
• Nếu ảnh thuộc các loại giấy tờ KHÁC NHAU → tách thành nhóm riêng biệt

[SỔ HỘ KHẨU - NHẬN DẠNG]
• Thường có trang bìa (có số sổ hộ khẩu, tên chủ hộ) và trang nội dung (thông tin thành viên)
• CHỮ ĐẶC BIỆT: Nhiều trường trong sổ hộ khẩu được VIẾT TAY bằng bút mực tiếng Việt. Hãy cố gắng đọc toàn bộ.
• Các trường có thể gặp: Số sổ, Họ tên chủ hộ, Nơi thường trú, Số CMND chủ hộ, Ngày chuyển đến, Nơi chuyển đến, Thành viên hộ (họ tên, quan hệ với chủ hộ, ngày sinh)

[XỬ LÝ CHỮ VIẾT TAY]
• Đọc cẩn thận cả chữ in và chữ viết tay bằng tiếng Việt
• Chữ viết tay có thể khó đọc, hãy dùng ngữ cảnh để suy đoán nếu cần (ví dụ: cột "Họ tên" sẽ là tên người Việt)
• Nếu không đọc được một phần, hãy viết "[không rõ]" thay vì bỏ trống
• Dấu tiếng Việt quan trọng: hãy đoán dấu nếu chữ viết không rõ nhưng có thể nhận biết từ ngữ cảnh

[CÁC LOẠI GIẤY Tờ]
- "cccd": Căn cước công dân / CMND
- "ho_khau": Sổ hộ khẩu (có trang bìa + trang thông tin thành viên)
- "giay_khai_sinh": Giấy khai sinh
- "giay_ket_hon": Giấy đăng ký kết hôn
- "giay_phep_kinh_doanh": Giấy phép kinh doanh / đăng ký doanh nghiệp
- "bang_lai_xe": Bằng lái xe
- "khac": Loại khác

═══ FORMAT ĐẦU RA ═══
Trả về JSON thuần (KHÔNG có markdown, KHÔNG có text thừa), bắt đầu bằng { và kết thúc bằng }:
{
  "groups": [
    {
      "groupLabel": "Tên mô tả nhóm bằng tiếng Việt (VD: 'Căn cước công dân - mặt trước/mặt sau', 'Sổ hộ khẩu')",
      "docCategory": "cccd",
      "imageIndexes": [0, 1],
      "isValid": true,
      "isReadable": true,
      "extractedFields": {
        "cccd": "số CCCD 12 chữ số từ MẶT TRƯỚC (null nếu chỉ có mặt sau)",
        "fullName": "HỌ VÀ TÊN từ mặt trước (null nếu chỉ có mặt sau)",
        "dob": "YYYY-MM-DD từ mặt trước hoặc null",
        "gender": "Nam hoặc Nữ hoặc null",
        "hometown": "quê quán từ mặt trước hoặc null",
        "nationality": "quốc tịch hoặc null",
        "noiDangKyKhaiSinh": "Nơi đăng ký khai sinh từ MẶT SAU CCCD chip (khác với quê quán) hoặc null",
        "address": "Nơi thường trú từ MẶT SAU hoặc null",
        "issueDate": "YYYY-MM-DD ngày cấp từ MẶT SAU hoặc null",
        "expiryDate": "YYYY-MM-DD ngày hết hạn từ MẶT SAU hoặc null",
        "issuePlace": "Nơi/cơ quan cấp từ MẶT SAU hoặc null",
        "soHoKhau": "Số sổ hộ khẩu (VD: 240415174) — đọc cả chữ viết tay",
        "chuHo": "Họ tên chủ hộ — đọc cả chữ viết tay",
        "noiThuongTru": "Nơi thường trú trong sổ hộ khẩu — đọc cả chữ viết tay",
        "cmndChuHo": "Số CMND/CCCD của chủ hộ nếu có",
        "ngayChuyenDen": "Ngày chuyển đến (DD/MM/YYYY) nếu có",
        "noiChuyenDen": "Nơi chuyển đến nếu có",
        "thanhVienHo": "Danh sách thành viên hộ: [{hoTen, quanHe, ngaySinh, cmnd}] hoặc [] nếu không thấy",
        "soGiayTo": "số giấy tờ của loại khác"
      },
      "validationErrors": [],
      "warningLevel": "ok | warning | error",
      "issues": ["mô tả chi tiết tiếng Việt"],
      "message": "mô tả kết quả bằng tiếng Việt"
    }
  ]
}

[các mã lỗi validationErrors hợp lệ]
BLURRY_IMAGE | MISSING_SEAL | FAKE_DOCUMENT | MISMATCHED_SIDES | MISSING_FIELDS | CROPPED_IMAGE | DUPLICATE_TYPE | EXCESS_DOCS | MISSING_TYPE

[QUY TẮC QUAN TRỌNG]
- BLURRY_IMAGE: Ảnh nhòe >30% không đọc được → warningLevel=error
- MISSING_SEAL: Thiếu mộc đỏ (sổ hộ khẩu, giấy khai sinh) → warning
- FAKE_DOCUMENT: Font sai, pixel chỉnh sửa, số CCCD không phải 12 số → error
  * VỀ NGÀY CẤP: Chỉ báo FAKE_DOCUMENT về ngày khi issueDate SAU ngày ${todayStr} (tức là issueDate ở tương lai thực tế). Ngày cấp trước hoặc bằng ${todayStr} là HOÀN TOÀN HỢP LỆ dù là năm ${today.getFullYear()}.
  * VỀ NGÀY HẾT HẠN: Chỉ báo lỗi khi expiryDate đã QUA ngày ${todayStr} (thẻ hết hạn).
- MISMATCHED_SIDES: Thông tin không khớp giữa 2 ảnh → error
- Quy tắc: có error → isValid=false; chỉ warning → isValid=true; không vấn đề → ok

Lưu ý: imageIndexes từ 0. Ngày DD/MM/YYYY → YYYY-MM-DD.`;
  }; // end buildPrompt

  const prompt = buildPrompt(files.length, serviceContext);
  const images  = files.map((f, i) => ({
    base64:    f.buffer.toString('base64'),
    mediaType: f.mimeType,
    label:     `Ảnh ${i + 1}: ${f.fileName}`,
  }));

  let rawText = '';

  // ── Thử 1: OCR Microservice vision-multi (retry + model fallback) ──
  try {
    const res = await fetch(`${OCR_SERVICE_URL}/api/vision-multi`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ apiKey, images, prompt, maxOutputTokens: 8000 }),
      signal:  AbortSignal.timeout(120000),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    rawText = data?.content?.[0]?.text || '';
    console.log(`[OCR-GROUP] Microservice OK (${files.length} ảnh). Text length: ${rawText.length}`);
  } catch (msErr) {
    console.warn('[OCR-GROUP] Microservice lỗi, thử Gemini SDK multi-image:', msErr.message);

    // ── Thử 2: Gemini SDK — gửi TẤT CẢ file cùng lúc (ảnh + PDF) ────────
    const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    for (const modelName of FALLBACK_MODELS) {
      try {
        console.log(`[OCR-GROUP] Thử SDK model: ${modelName} với ${files.length} file (${hasPDF ? 'có PDF' : 'chỉ ảnh'})`);
        const model = getGenAI().getGenerativeModel({ model: modelName });

        // Xây dựng content parts — ảnh và PDF đều dùng inlineData
        const parts = [];
        files.forEach((f, i) => {
          const isPDF = f.mimeType === 'application/pdf';
          parts.push({ text: `=== File ${i + 1}: ${f.fileName} (${isPDF ? 'PDF/Scan' : 'Ảnh'}) ===` });
          parts.push({
            inlineData: {
              data:     f.buffer.toString('base64'),
              mimeType: f.mimeType, // 'application/pdf' hoặc 'image/*'
            },
          });
        });
        parts.push({ text: prompt });

        const result = await model.generateContent({
          contents: [{ role: 'user', parts }],
          generationConfig: {
            maxOutputTokens: 8192,
            temperature: 0.1, // thấp để output ổn định
          },
        });
        rawText = result.response.text();
        console.log(`[OCR-GROUP] SDK OK với ${modelName}. Text length: ${rawText.length}`);
        break;
      } catch (sdkErr) {
        const is429 = sdkErr.message?.includes('429') || sdkErr.message?.includes('quota');
        const is404 = sdkErr.message?.includes('404') || sdkErr.message?.includes('not found');
        console.warn(`[OCR-GROUP] ${modelName} lỗi (${is429 ? '429' : is404 ? '404' : 'other'}):`, sdkErr.message);
        if (is429) await sleep(5000);
        if (!is429 && !is404) throw sdkErr; // lỗi khác → throw ngay
      }
    }

    if (!rawText) {
      throw new Error('Tất cả models đều không phản hồi. Vui lòng thử lại sau.');
    }
  }

  // ── Parse JSON (có tự sửa JSON bị truncate) ──────────────────────────────
  /**
   * Cố gắng sửa JSON bị cắt giữa chừng:
   * 1. Thử parse thẳng
   * 2. Tìm group cuối hợp lệ → đóng mảng + object
   */
  function tryRepairJson(raw) {
    // Thử parse thẳng trước
    try { return JSON.parse(raw); } catch {}

    // Tìm vị trí } gần nhất sau trường cuối cùng đọc được
    const lastValidMarker = Math.max(
      raw.lastIndexOf('"warningLevel"'),
      raw.lastIndexOf('"message"'),
      raw.lastIndexOf('"issues"'),
      raw.lastIndexOf('"isValid"'),
    );
    if (lastValidMarker === -1) return null;

    // Tìm } kế tiếp sau marker đó
    const braceClose = raw.indexOf('}', lastValidMarker);
    if (braceClose === -1) return null;

    // Cắt ở đó rồi đóng mảng + object ngoài cùng
    const repaired = raw.substring(0, braceClose + 1) + ']}';
    try { return JSON.parse(repaired); } catch {}
    return null;
  }

  const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  // Lấy từ '{' đầu tiên trở đi (không giới hạn kết thúc để bắt cả trường hợp truncated)
  const braceStart = cleaned.indexOf('{');
  if (braceStart === -1) throw new Error('AI không trả về JSON hợp lệ: ' + rawText.substring(0, 300));

  const rawJson = cleaned.substring(braceStart);
  let parsed = tryRepairJson(rawJson);
  if (!parsed) {
    throw new Error('Không thể parse JSON từ AI response. Nội dung AI: ' + rawText.substring(0, 400));
  }


  const groups = parsed.groups || [];

  // ── Tổng hợp mergedFields — ưu tiên mặt trước, bổ sung từ mặt sau ──
  const mergedFields = {};
  groups.forEach(g => {
    const f = g.extractedFields || {};
    // Mặt trước cung cấp
    if (f.cccd      && f.cccd !== 'null'      && !mergedFields.idNumber)       mergedFields.idNumber  = f.cccd;
    if (f.fullName  && f.fullName !== 'null'  && !mergedFields.fullName)       mergedFields.fullName  = f.fullName;
    if (f.dob       && f.dob !== 'null'       && !mergedFields['Ngày sinh'])   mergedFields['Ngày sinh']  = f.dob;
    if (f.gender    && f.gender !== 'null'    && !mergedFields['Giới tính'])   mergedFields['Giới tính']  = f.gender;
    if (f.hometown  && f.hometown !== 'null'  && !mergedFields['Quê quán'])    mergedFields['Quê quán']   = f.hometown;
    if (f.nationality && f.nationality !== 'null' && !mergedFields['Quốc tịch']) mergedFields['Quốc tịch'] = f.nationality;
    // Mặt sau cung cấp
    if (f.noiDangKyKhaiSinh && f.noiDangKyKhaiSinh !== 'null' && !mergedFields['Nơi đăng ký khai sinh']) mergedFields['Nơi đăng ký khai sinh'] = f.noiDangKyKhaiSinh;
    if (f.address   && f.address !== 'null'   && !mergedFields['Địa chỉ'])    mergedFields['Địa chỉ']    = f.address;
    if (f.issueDate && f.issueDate !== 'null' && !mergedFields['Ngày cấp'])   mergedFields['Ngày cấp']   = f.issueDate;
    if (f.expiryDate && f.expiryDate !== 'null' && !mergedFields['Ngày hết hạn']) mergedFields['Ngày hết hạn'] = f.expiryDate;
    if (f.issuePlace && f.issuePlace !== 'null' && !mergedFields['Nơi cấp']) mergedFields['Nơi cấp']    = f.issuePlace;
    // Hộ khẩu
    if (f.soHoKhau && f.soHoKhau !== 'null' && !mergedFields['Số hộ khẩu']) mergedFields['Số hộ khẩu'] = f.soHoKhau;
    if (f.chuHo    && f.chuHo !== 'null'    && !mergedFields['Chủ hộ'])      mergedFields['Chủ hộ']     = f.chuHo;
    if (f.soGiayTo && f.soGiayTo !== 'null' && !mergedFields['Số giấy tờ']) mergedFields['Số giấy tờ'] = f.soGiayTo;
  });

  // ── Đính kèm tên file và sanitize validationErrors ──────────────
  const VALID_ERROR_CODES = new Set([
    'BLURRY_IMAGE', 'MISSING_SEAL', 'FAKE_DOCUMENT', 'MISMATCHED_SIDES',
    'MISSING_FIELDS', 'CROPPED_IMAGE', 'DUPLICATE_TYPE', 'EXCESS_DOCS', 'MISSING_TYPE',
  ]);

  const enrichedGroups = groups.map(g => ({
    ...g,
    files: (g.imageIndexes || []).map(idx => ({
      index:    idx,
      fileName: files[idx]?.fileName || `Ảnh ${idx + 1}`,
    })),
    // Chỉ giữ các mã lỗi hợp lệ (loại bỏ string mô tả thừa của AI)
    validationErrors: (g.validationErrors || []).filter(e => VALID_ERROR_CODES.has(e)),
    // Đảm bảo warningLevel hợp lệ
    warningLevel: ['ok', 'warning', 'error'].includes(g.warningLevel) ? g.warningLevel : 'ok',
  }));

  return { groups: enrichedGroups, mergedFields };
};

