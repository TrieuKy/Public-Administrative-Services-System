const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // Mã biên lai — duy nhất, tự sinh
  receiptCode: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  // Liên kết hồ sơ (nullable — có thể thanh toán độc lập)
  applicationId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  // Người thanh toán
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  // Loại phí / tên dịch vụ thu phí
  feeType: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  // Số tiền (VND)
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  // Phương thức: card | qr | bank_transfer | cash
  paymentMethod: {
    type: DataTypes.STRING(50),
    defaultValue: 'card',
  },
  // Trạng thái: pending | success | failed | refunded
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  // Thời điểm thanh toán thành công
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Ghi chú thêm
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'payments',
  timestamps: true,
});

module.exports = Payment;
