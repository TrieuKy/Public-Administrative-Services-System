require('dotenv').config({ path: '../.env' }); // Mặc định project để env rễ hoặc trong backend
const { User } = require('../src/models');
const { sequelize } = require('../src/config/database');

async function listUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({ attributes: ['id', 'fullName', 'email', 'role'] });
    console.log('--- DANH SÁCH TÀI KHOẢN TRONG HỆ THỐNG ---');
    if (users.length === 0) {
      console.log('Không có tài khoản nào.');
    } else {
      users.forEach(u => {
        console.log(`- Email: ${u.email} | Name: ${u.fullName} | Role: ${u.role}`);
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await sequelize.close();
  }
}

listUsers();
