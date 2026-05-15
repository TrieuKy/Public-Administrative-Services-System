require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize } = require('../src/config/database');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Add columns if they don't exist
    try {
      await sequelize.query('ALTER TABLE services ADD COLUMN procedures TEXT;');
      console.log('Added procedures column');
    } catch(e) {
      console.log('procedures column may already exist');
    }

    try {
      await sequelize.query('ALTER TABLE services ADD COLUMN workflow TEXT;');
      console.log('Added workflow column');
    } catch(e) {
      console.log('workflow column may already exist');
    }

    console.log('Done altering table');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
