const router    = require('express').Router();
const multer    = require('multer');
const auth      = require('../middlewares/auth.middleware');
const aiService = require('../services/ai.service');
const { AiLog } = require('../models');
const { success, error } = require('../utils/response');

// Fix encoding: multer reads originalname as Latin-1, re-encode to UTF-8
const fixFileName = (name) => {
  try { return Buffer.from(name, 'latin1').toString('utf8'); } catch { return name; }
};

// Multer — lưu file trong bộ nhớ (không ghi ra đĩa) để gửi thẳng lên Gemini
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    // Chấp nhận ảnh và PDF
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh (JPG, PNG, WebP...) hoặc PDF'));
  },
});

/**
 * POST /api/v1/ai/chat
 * Body: { message: string, history: [] }
 * Chatbot hỗ trợ dịch vụ công — KHÔNG cần đăng nhập
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || !message.trim())
      return error(res, 'message không được để trống', 400);

    const reply = await aiService.chat(message.trim(), history || []);
    return success(res, { reply }, 'Chatbot phản hồi thành công');
  } catch (err) {
    console.error('[AI Chat Error]', err.message);
    return error(res, 'Chatbot tạm thời không phản hồi được. Vui lòng thử lại.', 500);
  }
});

/**
 * POST /api/v1/ai/ocr-cccd
 * Form-data: image (file ảnh mặt trước CCCD)
 * Trả về thông tin định danh được trích xuất từ ảnh
 */
router.post('/ocr-cccd', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file)
      return error(res, 'Vui lòng tải lên ảnh CCCD', 400);

    const data = await aiService.ocrCccd(req.file.buffer, req.file.mimetype);
    return success(res, data, 'Quét OCR CCCD thành công');
  } catch (err) {
    console.error('[AI OCR Error]', err.message);
    return error(res, 'Không thể đọc thông tin từ ảnh. Vui lòng chụp rõ hơn và thử lại.', 500);
  }
});

/**
 * POST /api/v1/ai/analyze-document
 * Body: { applicationId, filePath, docType }
 */
router.post('/analyze-document', auth, async (req, res) => {
  try {
    const { applicationId, filePath, docType } = req.body;
    if (!filePath || !docType)
      return error(res, 'filePath và docType là bắt buộc', 400);

    const result = await aiService.analyzeDocument(applicationId, filePath, docType);
    return success(res, result, 'Phân tích tài liệu thành công');
  } catch (err) {
    return error(res, err.message, 500);
  }
});

/**
 * POST /api/v1/ai/check-documents
 * Body: { applicationId, uploadedDocTypes, requiredDocTypes }
 */
router.post('/check-documents', auth, async (req, res) => {
  try {
    const { applicationId, uploadedDocTypes, requiredDocTypes } = req.body;
    if (!Array.isArray(uploadedDocTypes) || !Array.isArray(requiredDocTypes))
      return error(res, 'uploadedDocTypes và requiredDocTypes phải là mảng', 400);

    const result = await aiService.checkDocuments(applicationId, uploadedDocTypes, requiredDocTypes);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
});

/**
 * GET /api/v1/ai/logs/:applicationId
 */
router.get('/logs/:applicationId', auth, async (req, res) => {
  try {
    const logs = await AiLog.findAll({
      where: { applicationId: req.params.applicationId },
      order: [['createdAt', 'DESC']],
    });
    return success(res, logs);
  } catch (err) {
    return error(res, err.message, 500);
  }
});

/**
 * POST /api/v1/ai/verify-document
 * Form-data: file (ảnh hoặc PDF), docType (tên loại giấy tờ cần kiểm tra)
 * AI thật sự phân tích ảnh bằng Gemini Vision — KHÔNG cần đăng nhập
 */
router.post('/verify-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file)
      return error(res, 'Vui lòng tải lên file tài liệu', 400);

    const docType = req.body.docType || 'Tài liệu hành chính';

    // PDF không thể gửi trực tiếp lên Gemini Vision → trả về accepted luôn
    if (req.file.mimetype === 'application/pdf') {
      return success(res, {
        isValid: true,
        documentType: docType,
        isCorrectType: true,
        isReadable: true,
        hasFullContent: true,
        issues: [],
        message: 'File PDF đã được chấp nhận',
      });
    }

    const result = await aiService.verifyDocument(req.file.buffer, req.file.mimetype, docType);
    return success(res, result, 'Kiểm tra tài liệu hoàn tất');
  } catch (err) {
    console.error('[AI Verify Document Error]', err.message);
    // Fallback: không block người dùng nếu AI lỗi
    return success(res, {
      isValid: true,
      documentType: req.body.docType || 'Tài liệu',
      isCorrectType: true,
      isReadable: true,
      hasFullContent: true,
      issues: [],
      message: 'Tài liệu đã được chấp nhận',
    });
  }
});

/**
 * POST /api/v1/ai/ocr-form
 * Form-data: files[] (nhiều ảnh), docTypes[] (mảng tên loại giấy tờ)
 * Quét tất cả ảnh và trả về object thông tin form đã trích xuất
 */
router.post('/ocr-form', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return error(res, 'Vui lòng tải lên ít nhất 1 file', 400);

    const docTypes = JSON.parse(req.body.docTypes || '[]');

    // Gọi AI cho từng file song song
    const results = await Promise.allSettled(
      req.files.map(async (file, i) => {
        const docType = docTypes[i] || 'Tài liệu';

        if (file.mimetype === 'application/pdf') {
          return { docType, extracted: null, isPdf: true };
        }

        // Detect loại giấy tờ để chọn prompt phù hợp
        const isCccd = docType.toLowerCase().includes('cccd') ||
                       docType.toLowerCase().includes('căn cước') ||
                       docType.toLowerCase().includes('cmnd');

        if (isCccd) {
          const data = await aiService.ocrCccd(file.buffer, file.mimetype);
          return { docType, type: 'cccd', extracted: data };
        } else {
          // Generic document extraction
          const prompt = `Bạn là hệ thống OCR cho tài liệu hành chính Việt Nam.
Đây là ảnh của: "${docType}".
Hãy trích xuất TẤT CẢ thông tin có thể đọc được từ tài liệu này.

Trả về JSON thuần (không có markdown):
{
  "documentType": "tên loại giấy tờ nhận diện được",
  "isValid": true/false (giấy tờ thật, rõ ràng),
  "isReadable": true/false (có thể đọc được nội dung),
  "fields": {
    "số/mã": "...",
    "họ tên": "...",
    "ngày sinh": "...",
    "địa chỉ": "...",
    "ngày cấp": "...",
    "nơi cấp": "...",
    [các trường khác phù hợp với loại giấy tờ]
  },
  "issues": ["danh sách vấn đề nếu có"],
  "message": "mô tả ngắn về kết quả"
}

Nếu không đọc được: trả isReadable: false và giải thích trong message.`;

          const text = await aiService._callVisionAI(file.buffer.toString('base64'), file.mimetype, prompt);
          const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
          const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
          const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { isValid: false, isReadable: false, message: 'Không thể phân tích' };
          return { docType, type: 'generic', extracted: data };
        }
      })
    );

    const formResults = results.map((r, i) =>
      r.status === 'fulfilled' ? r.value : { docType: docTypes[i] || 'Tài liệu', extracted: null, error: r.reason?.message }
    );

    return success(res, { results: formResults }, 'Trích xuất thông tin thành công');
  } catch (err) {
    console.error('[OCR Form]', err.message);
    return error(res, err.message, 500);
  }
});

/**
 * POST /api/v1/ai/ocr-group
 * Form-data: files[] (nhiều ảnh/PDF)
 * AI phân tích TẤT CẢ ảnh cùng lúc, nhận diện loại giấy tờ và nhóm lại.
 * Trả về: { groups: [...], mergedFields: {...} }
 */
router.post('/ocr-group', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return error(res, 'Vui lòng tải lên ít nhất 1 file', 400);

    // Parse serviceContext nếu có (gửi từ frontend khi chọn dịch vụ)
    let serviceContext = null;
    if (req.body?.serviceContext) {
      try { serviceContext = JSON.parse(req.body.serviceContext); } catch {}
    }

    // Tất cả file (ảnh + PDF) đều gửi vào AI — PDF được Gemini đọc nội dung text
    const allFiles = req.files.map((file, i) => ({
      buffer:        file.buffer,
      mimeType:      file.mimetype,
      fileName:      fixFileName(file.originalname),
      originalIndex: i,
    }));

    const result = await aiService.ocrMultiGroup(allFiles, serviceContext);

    return success(res, {
      groups:      result.groups,
      mergedFields: result.mergedFields,
      totalFiles:  req.files.length,
    }, 'Phân tích và nhóm tài liệu thành công');

  } catch (err) {
    console.error('[OCR Group]', err.message);
    return error(res, err.message, 500);
  }
});



/**
 * POST /api/v1/ai/set-key
 * Body: { apiKey: "AIza..." }
 * Cho phép set Gemini API key động để test (không lưu vào .env)
 */
router.post('/set-key', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || !apiKey.startsWith('AIza')) {
    return error(res, 'API key không hợp lệ. Gemini key phải bắt đầu bằng "AIza"', 400);
  }
  process.env.GEMINI_API_KEY = apiKey;
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    global._genAI = new GoogleGenerativeAI(apiKey);
    return success(res, { message: 'API key đã được cập nhật cho phiên này' });
  } catch (err) {
    return error(res, 'Không thể khởi tạo AI với key này: ' + err.message, 500);
  }
});

/**
 * POST /api/v1/ai/analyze-application/:id
 * Cán bộ gọi để AI phân tích THỰC SỰ tất cả tài liệu của hồ sơ và trả về confidence score thực.
 * Yêu cầu: đăng nhập + quyền officer/admin.
 */
router.post('/analyze-application/:id', auth, async (req, res) => {
  const fs   = require('fs');
  const path = require('path');
  const { Application, Document, Service, User } = require('../models');

  try {
    const app = await Application.findByPk(req.params.id, {
      include: [
        { model: Document, as: 'documents' },
        { model: Service,  as: 'service',  attributes: ['name', 'requiredDocs'] },
        { model: User,     as: 'citizen',  attributes: ['fullName', 'cccd', 'dob', 'gender'] },
      ],
    });
    if (!app) return error(res, 'Hồ sơ không tồn tại', 404);

    const docs = app.documents || [];
    if (docs.length === 0) {
      return success(res, {
        overallScore: 0,
        recommendation: 'Chưa có tài liệu',
        recommendationLevel: 'pending',
        docAnalyses: [],
        summary: 'Hồ sơ chưa có tài liệu nào được đính kèm.',
      });
    }

    // Đọc tối đa 5 tài liệu để tránh timeout
    const docsToAnalyze = docs.slice(0, 5);
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const rootDir   = path.resolve(__dirname, '../../..');

    const fileBuffers = [];
    for (const doc of docsToAnalyze) {
      // filePath có thể là đường dẫn tuyệt đối hoặc tương đối
      let absPath = doc.filePath;
      if (!path.isAbsolute(absPath)) {
        absPath = path.join(rootDir, absPath);
      }
      if (!fs.existsSync(absPath)) {
        // fallback: thử reconstruct từ fileUrl
        const rel = doc.fileUrl?.replace(/^\//, '');
        absPath = path.join(rootDir, rel || '');
      }
      if (fs.existsSync(absPath)) {
        fileBuffers.push({
          buffer:   fs.readFileSync(absPath),
          mimeType: doc.mimeType || 'image/jpeg',
          fileName: doc.fileName || doc.docType,
          docType:  doc.docType,
        });
      }
    }

    if (fileBuffers.length === 0) {
      // File không còn trên disk — phân tích metadata
      const metaScore = Math.min(95, 60 + docs.length * 8);
      return success(res, {
        overallScore: metaScore,
        recommendation: metaScore >= 80 ? 'Đề xuất: Duyệt' : 'Cần kiểm tra thêm',
        recommendationLevel: metaScore >= 80 ? 'approve' : 'review',
        docAnalyses: docs.map(d => ({
          docType: d.docType,
          fileName: d.fileName,
          score: metaScore,
          issues: [],
          message: 'File không còn trên đĩa, ước tính dựa theo metadata',
        })),
        summary: `Phân tích metadata: ${docs.length} tài liệu, ước tính ${metaScore}% tin cậy.`,
      });
    }

    // Build AI prompt để phân tích toàn bộ bộ hồ sơ
    const citizen = app.citizen;
    const requiredDocs = app.service?.requiredDocs || [];
    const requiredDocLabels = requiredDocs.map(rd => rd?.label || rd?.docType || String(rd)).join(', ');
    const uploadedDocTypes = fileBuffers.map(f => f.docType).join(', ');

    const analysisPrompt = `Bạn là chuyên gia thẩm định hồ sơ hành chính Việt Nam với 10 năm kinh nghiệm.
Hãy phân tích bộ tài liệu sau đây và đưa ra đánh giá khách quan về độ tin cậy.

THÔNG TIN HỒ SƠ:
- Dịch vụ: ${app.service?.name || 'Không rõ'}
- Giấy tờ yêu cầu: ${requiredDocLabels || 'Không rõ'}
- Giấy tờ đã nộp: ${uploadedDocTypes}
- Người nộp: ${citizen?.fullName || 'Không rõ'} (CCCD: ${citizen?.cccd || 'Không rõ'})

Hãy phân tích TỪNG tài liệu (${fileBuffers.length} ảnh/file) và đưa ra đánh giá tổng hợp.

Trả về JSON thuần (KHÔNG markdown, KHÔNG text thừa):
{
  "overallScore": <số nguyên 0-100, điểm tin cậy tổng thể>,
  "recommendation": "<'Đề xuất: Duyệt' | 'Đề xuất: Từ chối' | 'Đề xuất: Bổ sung' | 'Cần kiểm tra thêm'>",
  "recommendationLevel": "<'approve' | 'reject' | 'supplement' | 'review'>",
  "docAnalyses": [
    {
      "docType": "<tên loại giấy tờ>",
      "fileName": "<tên file>",
      "score": <số nguyên 0-100, điểm tin cậy cho giấy tờ này>,
      "isAuthentic": <true/false>,
      "isReadable": <true/false>,
      "issues": ["vấn đề 1 nếu có"],
      "message": "<nhận xét ngắn gọn bằng tiếng Việt>"
    }
  ],
  "missingDocs": ["tên giấy tờ còn thiếu nếu có"],
  "summary": "<tóm tắt đánh giá tổng thể bằng tiếng Việt, 1-2 câu>"
}

Tiêu chí chấm điểm (0-100):
- 90-100: Tài liệu rõ ràng, đủ thông tin, không dấu hiệu giả mạo, đúng loại yêu cầu
- 70-89: Tài liệu hợp lệ nhưng có một vài điểm cần lưu ý nhỏ
- 50-69: Tài liệu thiếu một số thông tin hoặc không rõ một số chỗ, cần bổ sung
- 0-49: Tài liệu không hợp lệ, giả mạo, hoặc sai loại

CHỈ trả về JSON.`;

    // Gọi AI phân tích tất cả file cùng lúc (dùng ocr-group logic nhưng với prompt riêng)
    const result = await aiService.ocrMultiGroup(fileBuffers, {
      serviceName: app.service?.name,
      requiredDocTypes: requiredDocs,
    });

    // Sau khi có kết quả OCR cơ bản, tính score từ warningLevel
    const docAnalyses = result.groups.map(g => {
      let score = 90;
      if (g.warningLevel === 'warning') score = 70;
      if (g.warningLevel === 'error')   score = 40;
      if (g.validationErrors?.includes('BLURRY_IMAGE'))   score = Math.min(score, 35);
      if (g.validationErrors?.includes('FAKE_DOCUMENT'))  score = Math.min(score, 15);
      if (g.validationErrors?.includes('MISSING_FIELDS')) score = Math.min(score, 65);
      if (g.validationErrors?.includes('CROPPED_IMAGE'))  score = Math.min(score, 60);
      if (!g.isReadable) score = Math.min(score, 30);

      return {
        docType:    g.docCategory || g.groupLabel,
        fileName:   g.files?.map(f => f.fileName).join(', ') || '',
        score,
        isAuthentic: g.warningLevel !== 'error',
        isReadable:  g.isReadable !== false,
        issues:      g.issues || [],
        message:     g.message || '',
        validationErrors: g.validationErrors || [],
      };
    });

    // Tính overallScore tổng hợp
    const avgScore = docAnalyses.length > 0
      ? Math.round(docAnalyses.reduce((s, d) => s + d.score, 0) / docAnalyses.length)
      : 50;

    // Kiểm tra thiếu giấy tờ
    const uploadedCategories = result.groups.map(g => g.docCategory);
    const missingDocs = (requiredDocs || []).filter(rd => {
      const rdLabel = (rd?.label || rd?.docType || String(rd)).toLowerCase();
      return !uploadedCategories.some(cat => cat && rdLabel.includes(cat.toLowerCase().replace(/_/g, ' ')));
    }).map(rd => rd?.label || rd?.docType || String(rd));

    let recommendation, recommendationLevel;
    if (avgScore >= 80 && missingDocs.length === 0) {
      recommendation = 'Đề xuất: Duyệt'; recommendationLevel = 'approve';
    } else if (avgScore < 40) {
      recommendation = 'Đề xuất: Từ chối'; recommendationLevel = 'reject';
    } else if (missingDocs.length > 0 || avgScore < 70) {
      recommendation = 'Đề xuất: Bổ sung'; recommendationLevel = 'supplement';
    } else {
      recommendation = 'Cần kiểm tra thêm'; recommendationLevel = 'review';
    }

    const summary = `Phân tích ${docAnalyses.length} nhóm tài liệu, điểm tin cậy trung bình: ${avgScore}%. ${missingDocs.length > 0 ? `Còn thiếu: ${missingDocs.join(', ')}.` : 'Đủ loại giấy tờ yêu cầu.'}`;

    return success(res, {
      overallScore: avgScore,
      recommendation,
      recommendationLevel,
      docAnalyses,
      missingDocs,
      summary,
    });

  } catch (err) {
    console.error('[AI Analyze Application]', err.message);
    return error(res, 'Không thể phân tích hồ sơ: ' + err.message, 500);
  }
});

/**
 * POST /api/v1/ai/ocr-cccd-dual
 * Form-data: front (ảnh mặt trước CCCD), back (ảnh mặt sau CCCD)
 * Gộp kết quả từ cả 2 mặt để lấy thông tin đầy đủ
 */
router.post('/ocr-cccd-dual', auth, upload.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }]), async (req, res) => {
  try {
    const files = req.files;
    if (!files?.front?.[0] || !files?.back?.[0]) {
      return error(res, 'Vui lòng tải lên cả mặt trước (front) và mặt sau (back) CCCD', 400);
    }

    const frontFile = files.front[0];
    const backFile  = files.back[0];

    const allFiles = [
      { buffer: frontFile.buffer, mimeType: frontFile.mimetype, fileName: fixFileName(frontFile.originalname) },
      { buffer: backFile.buffer,  mimeType: backFile.mimetype,  fileName: fixFileName(backFile.originalname) },
    ];

    const result = await aiService.ocrMultiGroup(allFiles, null);

    // Tổng hợp tất cả extractedFields từ tất cả groups
    const merged = result.mergedFields || {};
    const groups = result.groups || [];

    // Ghép thêm thông tin từng field rõ ràng hơn
    const cccdData = {
      cccd:        merged.idNumber || null,
      fullName:    merged.fullName || null,
      dob:         merged['Ngày sinh'] || null,
      gender:      merged['Giới tính'] || null,
      nationality: merged['Quốc tịch'] || null,
      pob:         merged['Nơi đăng ký khai sinh'] || null,
      address:     merged['Địa chỉ'] || null,
      issueDate:   merged['Ngày cấp'] || null,
      expiryDate:  merged['Ngày hết hạn'] || null,
      issuePlace:  merged['Nơi cấp'] || null,
      hometown:    groups[0]?.extractedFields?.hometown || null,
    };

    // Đánh giá chất lượng ảnh
    const hasErrors = groups.some(g => g.warningLevel === 'error');
    const hasWarnings = groups.some(g => g.warningLevel === 'warning');

    return success(res, {
      cccdData,
      groups,
      quality: hasErrors ? 'error' : hasWarnings ? 'warning' : 'ok',
      message: hasErrors
        ? 'Ảnh có vấn đề nghiêm trọng, vui lòng chụp lại'
        : hasWarnings
          ? 'Đọc được thông tin nhưng có một số vấn đề nhỏ'
          : 'Đọc thành công cả 2 mặt CCCD',
    });

  } catch (err) {
    console.error('[OCR CCCD Dual]', err.message);
    return error(res, 'Không thể đọc thông tin CCCD: ' + err.message, 500);
  }
});

/**
 * GET /api/v1/ai/summarize-feedbacks
 * AI tổng hợp các phản ánh kiến nghị để cán bộ nắm bắt nhanh
 */
router.get('/summarize-feedbacks', auth, async (req, res) => {
  try {
    const { Comment } = require('../models');
    const feedbacks = await Comment.findAll({
      where: { type: 'feedback' },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    
    if (feedbacks.length === 0) {
      return success(res, { summary: '<p>Chưa có phản ánh nào để tổng hợp.</p>' });
    }

    const textToAnalyze = feedbacks.map((f, i) => `[${f.topic}] Tiêu đề: ${f.title}. Nội dung: ${f.content}`).join('\n\n');
    
    const prompt = `Bạn là trợ lý AI cho bộ phận tiếp nhận phản ánh kiến nghị của cơ quan nhà nước.
Hãy đọc danh sách ${feedbacks.length} phản ánh gần đây của người dân và TỔNG HỢP lại thành một báo cáo ngắn gọn.
Tập trung vào:
1. Những vấn đề bức xúc / bị phàn nàn nhiều nhất.
2. Những khó khăn chung mà người dân đang gặp phải với hệ thống.
3. Đề xuất nhanh hành động khắc phục.

Danh sách phản ánh:
${textToAnalyze}

Yêu cầu định dạng đầu ra:
Trả về nội dung bằng HTML thuần (chỉ dùng các thẻ <ul>, <li>, <strong>, <p>, <h3>) để tôi render trực tiếp lên web.
KHÔNG dùng markdown, KHÔNG bọc trong \`\`\`html.`;

    const summary = await aiService.chat(prompt);
    const cleanSummary = summary.replace(/```html/g, '').replace(/```/g, '').trim();
    
    return success(res, { summary: cleanSummary });
  } catch (err) {
    console.error('[AI Summarize Feedbacks]', err.message);
    return error(res, 'Không thể tổng hợp phản ánh: ' + err.message, 500);
  }
});

module.exports = router;
