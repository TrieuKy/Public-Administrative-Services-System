const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AiLog = sequelize.define('AiLog', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  applicationId: { type: DataTypes.UUID },
  type:          { type: DataTypes.STRING }, // OCR, CHECK_DOCS, CHATBOT
  input:         { type: DataTypes.JSONB },
  output:        { type: DataTypes.JSONB },
  confidence:    { type: DataTypes.FLOAT },
  durationMs:    { type: DataTypes.INTEGER },
}, { tableName: 'ai_logs' });

module.exports = AiLog;