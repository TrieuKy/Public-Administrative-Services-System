const { AiLog } = require('../models');
const fs = require('fs');
const path = require('path');

/**
 * Giả lập OCR: đọc tên file và trả về dữ liệu mẫu.
 * Khi có Google Gemini / Vision API thật, thay hàm này.
 */
const mockOcr = (filePath, docType) => {
  return {
    docType,
    confidence: 0.92,
    extractedFields: {
      fullName: 'Nguyễn Văn A',
      cccd: '001234567890',
      dob: '01/01/1990',
      address: 'Hà Nội',
    },
    rawText: `[OCR mock] File: ${path.basename(filePath)}, loại: ${docType}`,
  };
};

/**
 * Phân tích tài liệu (OCR + kiểm tra hợp lệ)
 * @param {string} applicationId
 * @param {string} filePath  - đường dẫn file vật lý
 * @param {string} docType   - loại giấy tờ
 * @returns {object} kết quả phân tích
 */
exports.analyzeDocument = async (applicationId, filePath, docType) => {
  const start = Date.now();
  let output;

  try {
    // --- Nếu dùng API thật, thay đoạn này ---
    output = mockOcr(filePath, docType);
    // -----------------------------------------

    const durationMs = Date.now() - start;

    // Lưu log AI
    await AiLog.create({
      applicationId,
      type: 'OCR',
      input:  { filePath, docType },
      output,
      confidence: output.confidence,
      durationMs,
    });

    return { success: true, data: output, durationMs };
  } catch (err) {
    await AiLog.create({
      applicationId,
      type: 'OCR',
      input:  { filePath, docType },
      output: { error: err.message },
      confidence: 0,
      durationMs: Date.now() - start,
    });
    throw err;
  }
};

/**
 * Kiểm tra bộ hồ sơ có đủ giấy tờ theo yêu cầu không
 * @param {string} applicationId
 * @param {string[]} uploadedDocTypes  - danh sách docType đã upload
 * @param {string[]} requiredDocTypes  - danh sách docType bắt buộc
 */
exports.checkDocuments = async (applicationId, uploadedDocTypes, requiredDocTypes) => {
  const start = Date.now();
  const missing = requiredDocTypes.filter(d => !uploadedDocTypes.includes(d));
  const isComplete = missing.length === 0;
  const output = { isComplete, missing, uploadedDocTypes, requiredDocTypes };

  await AiLog.create({
    applicationId,
    type: 'CHECK_DOCS',
    input:  { uploadedDocTypes, requiredDocTypes },
    output,
    confidence: isComplete ? 1.0 : 0.0,
    durationMs: Date.now() - start,
  });

  return output;
};
