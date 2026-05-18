const { Service } = require('../models');
const { success, error } = require('../utils/response');

const SEED_SERVICES = [
  { name: 'Đăng ký khai sinh', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: '3 ngày làm việc', processingDays: 3, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Giấy chứng sinh', 'CMND/CCCD cha mẹ', 'Giấy đăng ký kết hôn'], isActive: true },
  { name: 'Đăng ký kết hôn', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Giấy xác nhận tình trạng hôn nhân', 'CMND/CCCD hai bên', 'Sổ hộ khẩu'], isActive: true },
  { name: 'Đăng ký khai tử', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: '2 ngày làm việc', processingDays: 2, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Giấy báo tử', 'CMND/CCCD người thân'], isActive: true },
  { name: 'Đăng ký tạm trú', category: 'individual', agency: 'Công an cấp xã', processingTime: '2 ngày làm việc', processingDays: 2, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Mẫu CT01 - Tờ khai thay đổi thông tin cư trú', 'Giấy tờ chứng minh chỗ ở hợp pháp'], isActive: true },
  { name: 'Đăng ký tạm vắng', category: 'individual', agency: 'Công an cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['CMND/CCCD', 'Sổ hộ khẩu'], isActive: true },
  { name: 'Chứng thực bản sao', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: 'Trong ngày', processingDays: 1, level: 'Mức độ 4', fee: '5.000 VNĐ/trang', requiredDocs: ['Bản gốc cần chứng thực', 'CMND/CCCD người yêu cầu'], isActive: true },
  { name: 'Chứng thực chữ ký', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: 'Trong ngày', processingDays: 1, level: 'Mức độ 4', fee: '10.000 VNĐ', requiredDocs: ['Giấy tờ cần chứng thực', 'CMND/CCCD'], isActive: true },
  { name: 'Giấy phép xây dựng nhà ở', category: 'individual', agency: 'Ủy ban nhân dân cấp xã', processingTime: '7 ngày làm việc', processingDays: 7, level: 'Mức độ 3', fee: '50.000 VNĐ', requiredDocs: ['Đơn xin cấp phép xây dựng', 'Bản vẽ thiết kế', 'Sổ đỏ/Giấy chứng nhận quyền sử dụng đất'], isActive: true },
  { name: 'Đăng ký hộ kinh doanh', category: 'business', agency: 'Ủy ban nhân dân cấp xã', processingTime: '3 ngày làm việc', processingDays: 3, level: 'Mức độ 3', fee: '50.000 VNĐ', requiredDocs: ['Mẫu đăng ký hộ kinh doanh', 'CMND/CCCD chủ hộ', 'Giấy tờ về địa điểm kinh doanh'], isActive: true },
  { name: 'Thay đổi nội dung hộ kinh doanh', category: 'business', agency: 'Ủy ban nhân dân cấp xã', processingTime: '2 ngày làm việc', processingDays: 2, level: 'Mức độ 3', fee: '30.000 VNĐ', requiredDocs: ['Thông báo thay đổi nội dung đăng ký hộ kinh doanh', 'CMND/CCCD chủ hộ'], isActive: true },
  { name: 'Tạm ngừng kinh doanh', category: 'business', agency: 'Ủy ban nhân dân cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Thông báo tạm ngừng kinh doanh', 'Giấy chứng nhận đăng ký hộ kinh doanh'], isActive: true },
  { name: 'Chấm dứt hoạt động hộ kinh doanh', category: 'business', agency: 'Ủy ban nhân dân cấp xã', processingTime: '1 ngày làm việc', processingDays: 1, level: 'Mức độ 4', fee: 'Miễn phí', requiredDocs: ['Thông báo chấm dứt hoạt động', 'Giấy chứng nhận đăng ký hộ kinh doanh'], isActive: true },
  { name: 'Giấy phép tổ chức lễ hội', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '5 ngày làm việc', processingDays: 5, level: 'Mức độ 3', fee: '100.000 VNĐ', requiredDocs: ['Đơn xin cấp phép tổ chức lễ hội', 'Kịch bản chương trình', 'Danh sách ban tổ chức'], isActive: true },
  { name: 'Giấy phép hoạt động văn hóa cộng đồng', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '3 ngày làm việc', processingDays: 3, level: 'Mức độ 3', fee: '50.000 VNĐ', requiredDocs: ['Đơn xin cấp phép', 'Nội dung chương trình hoạt động'], isActive: true },
  { name: 'Đăng ký hoạt động tôn giáo', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '7 ngày làm việc', processingDays: 7, level: 'Mức độ 3', fee: 'Miễn phí', requiredDocs: ['Đơn đăng ký hoạt động tôn giáo', 'Danh sách người đại diện'], isActive: true },
  { name: 'Xác nhận hộ nghèo/hộ cận nghèo', category: 'organization', agency: 'Ủy ban nhân dân cấp xã', processingTime: '5 ngày làm việc', processingDays: 5, level: 'Mức độ 3', fee: 'Miễn phí', requiredDocs: ['Đơn đề nghị xác nhận', 'Sổ hộ khẩu', 'CMND/CCCD'], isActive: true },
];

// GET /services — public
exports.getServices = async (req, res) => {
  try {
    const { category, page = 1, limit = 50, includeHidden } = req.query;

    const existCount = await Service.count();
    if (existCount === 0) {
      await Service.bulkCreate(SEED_SERVICES);
    }

    const where = {};
    if (includeHidden !== 'true') {
      where.isActive = true;
    }
    if (category) where.category = category;

    const { rows, count } = await Service.findAndCountAll({
      where, limit: +limit, offset: (+page - 1) * +limit,
      order: [['createdAt', 'ASC']]
    });
    return success(res, { services: rows, total: count, page: +page });
  } catch (err) { return error(res, err.message, 500); }
};

// GET /services/:id
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return error(res, 'Dịch vụ không tồn tại', 404);
    return success(res, service);
  } catch (err) { return error(res, err.message, 500); }
};

// POST /services — officer/admin only
exports.createService = async (req, res) => {
  try {
    const { name, category, agency, processingTime, processingDays, level, fee, description, requiredDocs, procedures, workflow } = req.body;
    if (!name || !category) return error(res, 'Tên và danh mục không được để trống', 400);

    const service = await Service.create({
      name, category, agency, processingTime, processingDays, level, fee, description, procedures, workflow,
      requiredDocs: Array.isArray(requiredDocs) ? requiredDocs : [],
      isActive: true
    });
    return success(res, service, 'Tạo dịch vụ thành công', 201);
  } catch (err) { return error(res, err.message, 500); }
};

// PUT /services/:id — officer/admin only
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return error(res, 'Dịch vụ không tồn tại', 404);

    const { name, category, agency, processingTime, processingDays, level, fee, description, requiredDocs, procedures, workflow, isActive } = req.body;

    await service.update({
      name:           name           !== undefined ? name           : service.name,
      category:       category       !== undefined ? category       : service.category,
      agency:         agency         !== undefined ? agency         : service.agency,
      processingTime: processingTime !== undefined ? processingTime : service.processingTime,
      processingDays: processingDays !== undefined ? processingDays : service.processingDays,
      level:          level          !== undefined ? level          : service.level,
      fee:            fee            !== undefined ? fee            : service.fee,
      description:    description    !== undefined ? description    : service.description,
      procedures:     procedures     !== undefined ? procedures     : service.procedures,
      workflow:       workflow       !== undefined ? workflow       : service.workflow,
      requiredDocs:   requiredDocs   !== undefined ? requiredDocs   : service.requiredDocs,
      isActive:       isActive       !== undefined ? isActive       : service.isActive,
    });

    return success(res, service, 'Cập nhật dịch vụ thành công');
  } catch (err) { return error(res, err.message, 500); }
};

// DELETE /services/:id — officer/admin only (hard delete)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return error(res, 'Dịch vụ không tồn tại', 404);
    await service.destroy();
    return success(res, null, 'Đã xóa dịch vụ thành công');
  } catch (err) { return error(res, err.message, 500); }
};

const mammoth = require('mammoth');
const fs = require('fs');

// POST /services/template/upload
exports.uploadTemplate = async (req, res) => {
  try {
    if (!req.file) return error(res, 'Vui lòng chọn file template (Word/PDF)', 400);

    const fileUrl = `/api/v1/files/${req.file.filename}`;
    const filePath = req.file.path;
    let extractedFields = [];

    // Extract text from word document
    if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || req.file.mimetype === 'application/msword') {
      const result = await mammoth.extractRawText({ path: filePath });
      const text = result.value;

      // Call OCR server to extract fields
      const ocrPort = process.env.OCR_PORT || 5050;
      try {
        const ocrRes = await fetch(`http://localhost:${ocrPort}/api/extract-fields`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        const ocrData = await ocrRes.json();
        if (ocrRes.ok && Array.isArray(ocrData.fields)) {
          extractedFields = ocrData.fields;
        }
      } catch (aiErr) {
        console.error('Error extracting fields with AI:', aiErr);
      }
    }

    // Save to FormTemplate table
    const { FormTemplate } = require('../models');
    // Using a dummy service ID if not provided, or better to just save the template 
    // and let the frontend attach it to the service later.
    // Since we don't have serviceId yet, we can't save it with serviceId easily, 
    // but the user requested to create a table.
    try {
        await FormTemplate.create({
            serviceId: '00000000-0000-0000-0000-000000000000', // temporary mock ID
            documentName: req.file.originalname,
            fileName: req.file.originalname,
            fileUrl: fileUrl,
            extractedFields: extractedFields
        });
    } catch(e) { console.error('FormTemplate save error:', e.message); }

    return success(res, {
      fileName: req.file.originalname,
      fileUrl,
      extractedFields
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
