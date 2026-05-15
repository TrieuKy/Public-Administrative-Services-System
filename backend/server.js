const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
// Restart nodemon 1

const routes = require('./src/routes');
const { sequelize } = require('./src/config/database');
const authMiddleware = require('./src/middlewares/auth.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

// ── Protected file serving (thay thế express.static không có auth) ──
// Chỉ user đã đăng nhập mới truy cập được file upload
app.get('/api/v1/files/:filename', authMiddleware, (req, res) => {
  const filename = req.params.filename;
  // Sanitize: chỉ cho phép tên file hợp lệ, không có path traversal
  if (!/^[\w\-. ]+$/.test(filename)) {
    return res.status(400).json({ success: false, message: 'Tên file không hợp lệ' });
  }
  const filePath = path.join(__dirname, 'uploads', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File không tồn tại' });
  }
  res.sendFile(filePath);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false, message: err.message || 'Internal Server Error'
  });
});
const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync({ alter: false });
  })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => {
    console.error('database error:', err);
    process.exit(1);
  });