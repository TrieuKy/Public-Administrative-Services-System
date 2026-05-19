/**
 * HƯỚNG DẪN TẠO DỮ LIỆU MẪU (SEED)
 * ────────────────────────────────────────────────────────────
 * File này là MẪU. Hãy copy thành users.seed.js và điền thông tin thật.
 * File users.seed.js đã được .gitignore — KHÔNG bao giờ được commit lên GitHub.
 *
 * Chạy: node backend/src/seeders/users.seed.js
 */
require('dotenv').config();
const { User } = require('../models');
const { sequelize } = require('../config/database');

const citizens = [
  {
    fullName:   'Họ Tên Công Dân 1',
    cccd:       '07920XXXXXXX',        // 12 chữ số
    email:      'example1@gmail.com',
    password:   'Password@123',        // sẽ tự động hash
    role:       'citizen',
    isVerified: true,
    dob:        'YYYY-MM-DD',
    phone:      '09XXXXXXXX',
    gender:     'Nam / Nữ',
    address:    'Địa chỉ cư trú đầy đủ',
    nationality:'Việt Nam',
  },
  // Thêm công dân 2, 3 tương tự...
];

const officers = [
  {
    fullName:   'Họ Tên Cán Bộ 1',
    cccd:       '07918XXXXXXX',
    email:      'example.officer@ubndp11.gov.vn',
    password:   'Officer@2024',
    role:       'officer',
    isVerified: true,
    dob:        'YYYY-MM-DD',
    phone:      '02XXXXXXXX',
    gender:     'Nam / Nữ',
    address:    'Địa chỉ',
    nationality:'Việt Nam',
    officerCode:'CB-P11-00X',
    department: 'Bộ phận Một cửa — ...',
    workPhone:  '028.38.4XX.XXX',
    position:   'Chuyên viên ...',
  },
  // Thêm cán bộ 2, 3 tương tự...
];

(async () => {
  try {
    await sequelize.sync();
    let created = 0, skipped = 0;
    for (const u of [...citizens, ...officers]) {
      const exists = await User.findOne({ where: { email: u.email } });
      if (exists) { console.log(`⚠️  Bỏ qua: ${u.email}`); skipped++; continue; }
      await User.create(u);
      console.log(`✅ Đã tạo: [${u.role.toUpperCase()}] ${u.fullName}`);
      created++;
    }
    console.log(`\n📊 Tạo mới: ${created} | Bỏ qua: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
  }
})();
