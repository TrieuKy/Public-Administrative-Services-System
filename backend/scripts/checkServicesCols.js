require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Sequelize } = require('sequelize');
const seq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, port: process.env.DB_PORT || 5432, dialect: 'postgres', logging: false
});
(async () => {
  await seq.authenticate();
  const [cols] = await seq.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'services' ORDER BY ordinal_position`
  );
  console.log('Columns in services table:');
  cols.forEach(c => console.log(` - "${c.column_name}" (${c.data_type})`));
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
