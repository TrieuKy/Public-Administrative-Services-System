require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize } = require('../src/config/database');
const { Service } = require('../src/models');

const UPDATES = [
  {
    name: 'Đăng ký khai sinh',
    category: 'individual',
    agency: 'Ủy ban nhân dân cấp xã',
    processingTime: '3 ngày làm việc',
    processingDays: 3,
    level: 'Mức độ 4',
    fee: 'Miễn phí',
    requiredDocs: [
      { name: 'Tờ khai đăng ký khai sinh', templateUrl: '/templates/ToKhaiDangKyKhaiSinh.docx' },
      'Giấy chứng sinh',
      'CMND/CCCD cha mẹ',
      'Giấy đăng ký kết hôn'
    ],
    procedures: 'Bước 1: Công dân truy cập hệ thống Dịch vụ công, đăng nhập tài khoản.\nBước 2: Tìm kiếm dịch vụ "Đăng ký khai sinh" và điền Tờ khai điện tử.\nBước 3: Tải lên các giấy tờ đính kèm bản số hóa (Giấy chứng sinh, CMND/CCCD, Đăng ký kết hôn).\nBước 4: Xác nhận và nộp hồ sơ.\nBước 5: Nhận kết quả trực tuyến (Bản điện tử Giấy khai sinh) hoặc qua dịch vụ bưu chính.',
    workflow: 'Tiếp nhận hồ sơ trực tuyến -> Cán bộ kiểm tra số hóa -> Công chức tư pháp ghi sổ hộ tịch điện tử -> Trình ký số -> Cấp Giấy khai sinh điện tử.'
  },
  {
    name: 'Đăng ký khai tử',
    category: 'individual',
    agency: 'Ủy ban nhân dân cấp xã',
    processingTime: '2 ngày làm việc',
    processingDays: 2,
    level: 'Mức độ 4',
    fee: 'Miễn phí',
    requiredDocs: [
      { name: 'Tờ khai đăng ký khai tử', templateUrl: '/templates/ToKhaiDangKyKhaiTu.docx' },
      'Giấy báo tử',
      'CMND/CCCD người thân'
    ],
    procedures: 'Bước 1: Công dân truy cập hệ thống Dịch vụ công, đăng nhập tài khoản.\nBước 2: Tìm kiếm dịch vụ "Đăng ký khai tử" và điền Tờ khai điện tử.\nBước 3: Tải lên bản chụp/scan Giấy báo tử và giấy tờ nhân thân của người thực hiện.\nBước 4: Nộp hồ sơ. Nhận tin nhắn thông báo mã hồ sơ.\nBước 5: Nhận kết quả bản điện tử (Trích lục khai tử) qua tài khoản Dịch vụ công.',
    workflow: 'Tiếp nhận hồ sơ trực tuyến -> Xác minh thông tin -> Ghi sổ hộ tịch điện tử -> Trình ký số -> Trả kết quả điện tử.'
  },
  {
    name: 'Đăng ký kết hôn',
    category: 'individual',
    agency: 'Ủy ban nhân dân cấp xã',
    processingTime: '1 ngày làm việc',
    processingDays: 1,
    level: 'Mức độ 4',
    fee: 'Miễn phí',
    requiredDocs: [
      { name: 'Tờ khai đăng ký kết hôn', templateUrl: '/templates/ToKhaiDangKyKetHon.docx' },
      'Giấy xác nhận tình trạng hôn nhân',
      'CMND/CCCD hai bên',
      'Sổ hộ khẩu'
    ],
    procedures: 'Bước 1: Công dân đăng nhập hệ thống Dịch vụ công, chọn dịch vụ "Đăng ký kết hôn".\nBước 2: Hoàn thiện Tờ khai điện tử.\nBước 3: Tải lên các tài liệu: Giấy XNTTHN (bản điện tử hoặc bản scan), CMND/CCCD, Sổ hộ khẩu.\nBước 4: Nộp hồ sơ trực tuyến chờ xét duyệt.\nBước 5: Hai bên nam nữ đến UBND cấp xã ký Giấy chứng nhận kết hôn và Sổ hộ tịch (theo lịch hẹn nhận kết quả).',
    workflow: 'Tiếp nhận hồ sơ điện tử -> Kiểm tra điều kiện trực tuyến -> Xếp lịch hẹn ký xác nhận -> Hai bên có mặt ký tên -> Trả kết quả bản chính.'
  },
  {
    name: 'Xác nhận tình trạng hôn nhân',
    category: 'individual',
    agency: 'Ủy ban nhân dân cấp xã',
    processingTime: '3 ngày làm việc',
    processingDays: 3,
    level: 'Mức độ 4',
    fee: '15.000 VNĐ',
    requiredDocs: [
      { name: 'Tờ khai cấp Giấy xác nhận tình trạng hôn nhân', templateUrl: '/templates/mau-to-khai-cap-giay-xac-nhan-tinh-trang-hon-nhan.docx' },
      'CMND/CCCD'
    ],
    procedures: 'Bước 1: Công dân truy cập Cổng dịch vụ công quốc gia, đăng nhập, tìm kiếm và lựa chọn dịch vụ Xác nhận tình trạng hôn nhân.\nBước 2: Điền đầy đủ thông tin vào Tờ khai điện tử tương tác.\nBước 3: Tải lên các giấy tờ đính kèm theo quy định (Tờ khai, CMND/CCCD, v.v.).\nBước 4: Nộp phí/lệ phí trực tuyến (nếu có).\nBước 5: Hoàn tất nộp hồ sơ. Cán bộ sẽ xử lý và trả kết quả bản điện tử (hoặc bản giấy qua bưu điện/nhận trực tiếp tùy chọn).',
    workflow: 'Tiếp nhận hồ sơ điện tử -> Xác minh tình trạng hôn nhân -> Trình ký số Giấy xác nhận -> Trả kết quả điện tử/giấy.'
  }
];

async function updateDB() {
  try {
    for (const item of UPDATES) {
      let service = await Service.findOne({ where: { name: item.name } });
      if (service) {
        // preserve the templates already in requiredDocs if any
        let newDocs = item.requiredDocs.map(doc => typeof doc === 'string' ? { name: doc } : doc);
        for (let i = 0; i < newDocs.length; i++) {
            const existingDoc = service.requiredDocs.find(d => d.name === newDocs[i].name);
            if (existingDoc && existingDoc.templateUrl && !newDocs[i].templateUrl) {
                newDocs[i] = existingDoc;
            }
        }
        await service.update({
          procedures: item.procedures,
          workflow: item.workflow,
          fee: item.fee,
          requiredDocs: newDocs
        });
        console.log(`Updated ${item.name}`);
      } else {
        await Service.create({
          ...item,
          requiredDocs: item.requiredDocs.map(doc => typeof doc === 'string' ? { name: doc } : doc)
        });
        console.log(`Created ${item.name}`);
      }
    }
    console.log('Update finished.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating services:', error);
    process.exit(1);
  }
}

updateDB();
