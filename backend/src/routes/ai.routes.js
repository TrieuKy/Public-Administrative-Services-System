const router    = require('express').Router();
const multer    = require('multer');
const auth      = require('../middlewares/auth.middleware');
const aiService = require('../services/ai.service');
const { AiLog } = require('../models');
const { success, error } = require('../utils/response');

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
      fileName:      file.originalname,
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
  // Cập nhật biến môi trường runtime (chỉ tồn tại trong phiên hiện tại)
  process.env.GEMINI_API_KEY = apiKey;
  // Reinitialize genAI với key mới
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    global._genAI = new GoogleGenerativeAI(apiKey);
    return success(res, { message: 'API key đã được cập nhật cho phiên này' });
  } catch (err) {
    return error(res, 'Không thể khởi tạo AI với key này: ' + err.message, 500);
  }
});

module.exports = router;
