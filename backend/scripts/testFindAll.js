require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Application, Service, User } = require('../src/models');
const { sequelize } = require('../src/config/database');

(async () => {
  try {
    const { rows, count } = await Application.findAndCountAll({
      include: [{ model: Service, as: 'service', attributes: ['name', 'category', 'currentFee'] }],
      order: [['createdAt', 'DESC']],
      limit: 10, offset: 0
    });
    console.log('Success!', count);
  } catch(e) {
    console.error('Error:', e.message);
    console.error(e.sql);
  }
  process.exit();
})();
