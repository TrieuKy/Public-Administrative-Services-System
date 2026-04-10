require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/database');
const { User, Schedule } = require('../src/models');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    await sequelize.authenticate();
    // Đồng bộ lại lược đồ (sync alter) để tự tạo các bảng và column mới
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully!');

    // Tạo tài khoản Nguyễn Văn B
    const [officer, created] = await User.findOrCreate({
      where: { email: 'nguyenvanb@bennghe.gov.vn' },
      defaults: {
        fullName: 'Nguyễn Văn B',
        email: 'nguyenvanb@bennghe.gov.vn',
        password: '123456', // will be hashed by User hook
        cccd: 'C82024001', // Using CCCD field as pseudo-officerCode for uniqueness or officerCode directly
        role: 'officer',
        isVerified: true,
        officerCode: 'C82024001',
        department: 'UBND Phường Bến Nghé',
        workPhone: '0912345678',
        position: 'Cán bộ tiếp nhận hồ sơ',
        address: 'UBND Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
      }
    });

    if (created) {
      console.log('Officer created successfully!');
    } else {
      console.log('Officer already exists!');
    }

    // Xóa lịch cũ của ông này
    await Schedule.destroy({ where: { userId: officer.id }});

    // Tạo lịch mẫu
    const today = new Date().toISOString().split('T')[0];
    await Schedule.bulkCreate([
      { userId: officer.id, title: 'Tiếp nhận hồ sơ buổi sáng', timeInfo: '08:00', date: today, priority: 'normal', status: 'completed' },
      { userId: officer.id, title: 'Duyệt 5 hồ sơ khai sinh đang chờ', timeInfo: '09:30', date: today, priority: 'urgent', status: 'pending' },
      { userId: officer.id, title: 'Họp bộ phận một cửa', timeInfo: '10:00', date: today, priority: 'normal', status: 'pending' },
      { userId: officer.id, title: 'Tiếp nhận hồ sơ buổi chiều', timeInfo: '13:30', date: today, priority: 'normal', status: 'pending' },
      { userId: officer.id, title: 'Báo cáo kết quả tuần cho trưởng bộ phận', timeInfo: '15:00', date: today, priority: 'urgent', status: 'pending' }
    ]);

    console.log('Schedules seeded successfully!');

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

seed();
