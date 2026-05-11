require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Sequelize } = require('sequelize');
const seq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, port: process.env.DB_PORT || 5432, dialect: 'postgres', logging: false
});

(async () => {
  await seq.authenticate();
  // Lấy tất cả tên cột của bảng applications
  const [cols] = await seq.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'applications' ORDER BY ordinal_position`
  );
  console.log('Columns in applications table:');
  cols.forEach(c => console.log(` - "${c.column_name}" (${c.data_type})`));

  // Lấy 5 hồ sơ gần nhất
  const [rows] = await seq.query(`SELECT * FROM applications ORDER BY "createdAt" DESC LIMIT 5`);
  console.log('\nLast 5 applications:');
  rows.forEach(r => {
    const keys = Object.keys(r);
    const code = keys.find(k => k.toLowerCase().includes('code') && k.toLowerCase().includes('application'));
    console.log(` - ${code ? r[code] : 'N/A'} | status: ${r.status} | paymentStatus: ${r.paymentStatus || r.paymentstatus || '?'}`);
  });

  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
