require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Sequelize } = require('sequelize');

const seq = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, port: process.env.DB_PORT || 5432, dialect: 'postgres', logging: false }
);

(async () => {
  try {
    await seq.authenticate();
    console.log('✅ DB connected');

    // 1. Kiểm tra ENUM paymentStatus đã tồn tại chưa
    try {
      const [rows] = await seq.query(
        `SELECT e.enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'enum_applications_paymentStatus'`
      );
      console.log('Current paymentStatus ENUM values:', rows.map(r => r.enumlabel));

      // Thêm giá trị nếu thiếu
      const existing = rows.map(r => r.enumlabel);
      for (const val of ['FREE', 'UNPAID', 'PAID']) {
        if (!existing.includes(val)) {
          await seq.query(`ALTER TYPE "enum_applications_paymentStatus" ADD VALUE '${val}'`);
          console.log(`✅ Added ENUM value: ${val}`);
        } else {
          console.log(`⏭️  Already exists: ${val}`);
        }
      }
    } catch (enumErr) {
      console.log('ENUM not found or error:', enumErr.message);
      // Thử tạo cột với kiểu VARCHAR thay vì ENUM
      console.log('Trying to change paymentStatus column to VARCHAR...');
      await seq.query(`ALTER TABLE applications ALTER COLUMN "paymentStatus" TYPE VARCHAR(20)`);
      console.log('✅ Changed paymentStatus to VARCHAR(20)');
    }

    // 2. Đảm bảo các cột khác tồn tại
    const cols = ['paymentCode VARCHAR(50)', '"copies" INTEGER DEFAULT 1', '"feeTotal" INTEGER DEFAULT 0'];
    for (const col of cols) {
      const colName = col.split(' ')[0].replace(/"/g, '');
      try {
        await seq.query(`ALTER TABLE applications ADD COLUMN IF NOT EXISTS ${col}`);
        console.log(`✅ Column ensured: ${colName}`);
      } catch (e) {
        console.log(`⏭️  Column ${colName}: ${e.message}`);
      }
    }

    // 3. Test một query đơn giản
    const [appRows] = await seq.query('SELECT COUNT(*) as cnt FROM applications');
    console.log(`\n📊 Total applications in DB: ${appRows[0].cnt}`);

    const [pendingRows] = await seq.query('SELECT applicationcode, status, paymentstatus FROM applications ORDER BY createdat DESC LIMIT 5');
    if (pendingRows.length) {
      console.log('\nLast 5 applications:');
      pendingRows.forEach(r => console.log(` - ${r.applicationcode} | ${r.status} | payment: ${r.paymentstatus}`));
    } else {
      console.log('\n⚠️  No applications found in database!');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
