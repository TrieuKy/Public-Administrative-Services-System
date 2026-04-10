const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  timeInfo: { type: DataTypes.STRING, allowNull: false }, // e.g., '08:00', 'Buổi sáng'
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled'), defaultValue: 'pending' },
  priority: { type: DataTypes.ENUM('normal', 'urgent'), defaultValue: 'normal' }
}, {
  tableName: 'schedules',
  timestamps: true
});

module.exports = Schedule;
