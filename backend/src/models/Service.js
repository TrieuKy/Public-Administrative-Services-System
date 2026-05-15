const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:           { type: DataTypes.STRING, allowNull: false },
  category:       { type: DataTypes.STRING, allowNull: false },  // 'individual' | 'business' | 'organization'
  description:    { type: DataTypes.TEXT },
  agency:         { type: DataTypes.STRING, defaultValue: 'Ủy ban nhân dân cấp xã' },
  processingTime: { type: DataTypes.STRING, defaultValue: '5 ngày làm việc' }, // hiển thị dạng text
  processingDays: { type: DataTypes.INTEGER, defaultValue: 5 },
  level:          { type: DataTypes.STRING, defaultValue: 'Mức độ 4' },
  fee:            { type: DataTypes.STRING, defaultValue: 'Miễn phí' },
  currentFee:     { type: DataTypes.INTEGER, defaultValue: 0 },
  requiredDocs:   { type: DataTypes.JSONB, defaultValue: [] },
  procedures:     { type: DataTypes.TEXT }, // Trình tự thực hiện
  workflow:       { type: DataTypes.TEXT }, // Quy trình xử lý
  isActive:       { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'services' });

module.exports = Service;