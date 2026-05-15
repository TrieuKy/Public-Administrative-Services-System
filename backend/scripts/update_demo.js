const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Service, FormTemplate } = require('../src/models');

const SERVICES_TO_UPDATE = [
  {
    serviceName: 'Đăng ký khai sinh',
    filePath: path.resolve(__dirname, '../../Hộ tịch/ToKhaiDangKyKhaiSinh.docx'),
    docName: 'Tờ khai đăng ký khai sinh',
    existingDocsToKeep: ['Giấy chứng sinh', 'CMND/CCCD cha mẹ', 'Giấy đăng ký kết hôn']
  },
  {
    serviceName: 'Đăng ký kết hôn',
    filePath: path.resolve(__dirname, '../../Hộ tịch/ToKhaiDangKyKetHon.docx'),
    docName: 'Tờ khai đăng ký kết hôn',
    existingDocsToKeep: ['Giấy xác nhận tình trạng hôn nhân', 'CMND/CCCD hai bên', 'Sổ hộ khẩu']
  },
  {
    serviceName: 'Đăng ký khai tử',
    filePath: path.resolve(__dirname, '../../Hộ tịch/ToKhaiDangKyKhaiTu.docx'),
    docName: 'Tờ khai đăng ký khai tử',
    existingDocsToKeep: ['Giấy báo tử', 'CMND/CCCD người thân']
  }
];

async function run() {
  try {
    for (const item of SERVICES_TO_UPDATE) {
      console.log(`Processing: ${item.serviceName}...`);
      
      const service = await Service.findOne({ where: { name: item.serviceName } });
      if (!service) {
        console.log(`Service '${item.serviceName}' not found. Skipping.`);
        continue;
      }

      if (!fs.existsSync(item.filePath)) {
        console.log(`File '${item.filePath}' not found. Skipping.`);
        continue;
      }

      // Copy file to uploads
      const fileName = path.basename(item.filePath);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${fileName}`;
      const destPath = path.resolve(__dirname, '../uploads/', uniqueName);
      
      if (!fs.existsSync(path.resolve(__dirname, '../uploads'))) {
        fs.mkdirSync(path.resolve(__dirname, '../uploads'), { recursive: true });
      }
      fs.copyFileSync(item.filePath, destPath);
      const fileUrl = `/api/v1/files/${uniqueName}`;

      // Extract text
      const result = await mammoth.extractRawText({ path: destPath });
      const text = result.value;

      // Extract fields with AI
      let extractedFields = [];
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
        } else {
            console.error('AI extraction failed:', ocrData);
        }
      } catch (aiErr) {
        console.error('Error calling AI:', aiErr);
      }

      // Hardcode fields for demo if AI fails
      if (extractedFields.length === 0) {
        if (item.serviceName === 'Đăng ký khai sinh') {
            extractedFields = ["Họ, chữ đệm, tên người yêu cầu", "Nơi cư trú", "Giấy tờ tùy thân", "Quan hệ với người được khai sinh", "Họ, chữ đệm, tên người được khai sinh", "Giới tính", "Ngày, tháng, năm sinh", "Nơi sinh", "Quê quán", "Dân tộc", "Quốc tịch", "Họ, chữ đệm, tên người mẹ", "Họ, chữ đệm, tên người cha"];
        } else if (item.serviceName === 'Đăng ký kết hôn') {
            extractedFields = ["Họ, chữ đệm, tên", "Ngày, tháng, năm sinh", "Dân tộc", "Quốc tịch", "Nơi cư trú", "Giấy tờ tùy thân", "Lần kết hôn thứ"];
        } else if (item.serviceName === 'Đăng ký khai tử') {
            extractedFields = ["Họ, chữ đệm, tên người yêu cầu", "Nơi cư trú", "Quan hệ với người chết", "Họ, chữ đệm, tên người chết", "Ngày, tháng, năm sinh", "Ngày, tháng, năm chết", "Nơi chết", "Nguyên nhân chết"];
        }
      }

      // Create requiredDocs array
      const requiredDocs = [
        {
          name: item.docName,
          templateUrl: fileUrl,
          templateName: fileName,
          extractedFields: extractedFields
        },
        ...item.existingDocsToKeep.map(name => ({ name }))
      ];

      // Update service
      await service.update({ requiredDocs });
      
      // Save to FormTemplate 
      await FormTemplate.create({
        serviceId: service.id,
        documentName: item.docName,
        fileName: fileName,
        fileUrl: fileUrl,
        extractedFields: extractedFields
      });

      console.log(`✅ Updated ${item.serviceName} with ${extractedFields.length} fields.`);
    }

    console.log('Finished updating demo services.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
