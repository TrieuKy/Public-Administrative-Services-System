require('dotenv').config({ path: '../.env' });
const { User } = require('../src/models');
const { sequelize } = require('../src/config/database');

async function verifyAllUsers() {
  try {
    await sequelize.authenticate();
    const result = await User.update(
      { isVerified: true },
      { where: { isVerified: false } }
    );
    console.log(`Đã xác thực thành công ${result[0]} tài khoản!`);
  } catch (error) {
    console.error('Lỗi khi xác thực tài khoản:', error);
  } finally {
    await sequelize.close();
  }
}

verifyAllUsers();
