const { Service } = require('../models');
const { sequelize } = require('../config/database');

const services = [
  {
    name: 'Đăng ký khai sinh',
    category: 'khai-sinh',
    description: 'Đăng ký khai sinh cho trẻ em dưới 1 tuổi tại UBND phường/xã.',
    processingDays: 3,
    requiredDocs: [
      { docType: 'birth_cert',   label: 'Giấy chứng sinh',   required: true },
      { docType: 'cccd_parent',  label: 'CCCD cha hoặc mẹ',  required: true },
      { docType: 'marriage_cert',label: 'Giấy đăng ký kết hôn', required: false }
    ]
  },
  {
    name: 'Đăng ký thường trú',
    category: 'cu-tru',
    description: 'Đăng ký hộ khẩu thường trú tại địa chỉ mới.',
    processingDays: 7,
    requiredDocs: [
      { docType: 'cccd',         label: 'CCCD/CMND',          required: true },
      { docType: 'house_doc',    label: 'Sổ đỏ / hợp đồng thuê nhà', required: true }
    ]
  },
  {
    name: 'Cấp giấy xác nhận cư trú',
    category: 'cu-tru',
    description: 'Xác nhận nơi cư trú hiện tại phục vụ các thủ tục khác.',
    processingDays: 1,
    requiredDocs: [
      { docType: 'cccd', label: 'CCCD/CMND', required: true }
    ]
  }
];

(async () => {
  await sequelize.sync();
  await Service.bulkCreate(services, { ignoreDuplicates: true });
  console.log('✅ Seed dịch vụ thành công');
  process.exit(0);
})();