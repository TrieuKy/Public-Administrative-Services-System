const router    = require('express').Router();
const auth      = require('../middlewares/auth.middleware');
const aiService = require('../services/ai.service');
const { AiLog } = require('../models');
const { success, error } = require('../utils/response');

/**
 * POST /api/v1/ai/analyze-document
 * Body: { applicationId, documentId, filePath, docType }
 * Phân tích tài liệu bằng OCR
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
 * Kiểm tra bộ hồ sơ có đủ giấy tờ không
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
 * Lấy log AI của một hồ sơ
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

module.exports = router;
