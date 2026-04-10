const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApplicationHistory = sequelize.define('ApplicationHistory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  applicationId: { type: DataTypes.UUID, allowNull: false },
  actorId: { type: DataTypes.UUID }, // User who performed the action
  action: { type: DataTypes.STRING, allowNull: false }, // e.g., 'Nộp hồ sơ', 'Tiếp nhận', 'Yêu cầu bổ sung', 'Hoàn thành'
  note: { type: DataTypes.TEXT },
}, {
  tableName: 'application_histories',
  timestamps: true // createdAt will act as the action time
});

module.exports = ApplicationHistory;
