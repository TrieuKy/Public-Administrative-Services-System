require('dotenv').config({ path: '../.env' });
const { Service } = require('../src/models');
const { sequelize } = require('../src/config/database');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const categories = ['business', 'organization'];

    for (const category of categories) {
      const services = await Service.findAll({
        where: { category, isActive: true }
      });

      if (services.length > 0) {
        services.sort((a, b) => {
          const aLen = Array.isArray(a.requiredDocs) ? a.requiredDocs.length : 999;
          const bLen = Array.isArray(b.requiredDocs) ? b.requiredDocs.length : 999;
          return aLen - bLen;
        });

        const simplest = services[0];
        console.log(`\n[${category}] Giữ lại: ${simplest.name} (${simplest.requiredDocs?.length || 0} giấy tờ)`);

        for (let i = 1; i < services.length; i++) {
          await services[i].update({ isActive: false });
          console.log(`  -> Đã ẩn: ${services[i].name}`);
        }
      } else {
        console.log(`Không có dịch vụ (đang kích hoạt) nào trong nhóm: ${category}`);
      }
    }

    console.log('\nHoàn tất!');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

main();
