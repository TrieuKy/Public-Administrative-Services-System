const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:        { type: DataTypes.UUID, allowNull: false },
  applicationId: { type: DataTypes.UUID },
  type:          { type: DataTypes.STRING }, // APPROVED, REJECTED, NEED_MORE, etc.
  title:         { type: DataTypes.STRING },
  message:       { type: DataTypes.TEXT },
  isRead:        { type: DataTypes.BOOLEAN, defaultValue: false },
  emailSentAt:   { type: DataTypes.DATE },
}, { tableName: 'notifications' });

module.exports = Notification;
