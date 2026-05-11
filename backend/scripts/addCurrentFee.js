require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Sequelize } = require('sequelize');
const seq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, port: process.env.DB_PORT || 5432, dialect: 'postgres', logging: false
});
(async () => {
  try {
    await seq.authenticate();
    await seq.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS "currentFee" INTEGER DEFAULT 0`);
    console.log('✅ Added currentFee column to services table.');
    
    // Convert existing 'fee' values to 'currentFee' heuristically if possible
    await seq.query(`UPDATE services SET "currentFee" = 15000 WHERE name LIKE '%khai sinh%'`);
    await seq.query(`UPDATE services SET "currentFee" = 30000 WHERE name LIKE '%kết hôn%'`);
    await seq.query(`UPDATE services SET "currentFee" = 20000 WHERE name LIKE '%thường trú%'`);
    await seq.query(`UPDATE services SET "currentFee" = 50000 WHERE name LIKE '%CCCD%'`);
    
    process.exit(0);
  } catch(e) {
    console.error(e.message);
    process.exit(1);
  }
})();
