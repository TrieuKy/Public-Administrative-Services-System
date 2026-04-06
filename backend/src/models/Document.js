const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  applicationId: { type: DataTypes.UUID, allowNull: false },
  docType:       { type: DataTypes.STRING, allowNull: false },
  fileName:      { type: DataTypes.STRING, allowNull: false },
  fileUrl:       { type: DataTypes.STRING },
  filePath:      { type: DataTypes.STRING },
  mimeType:      { type: DataTypes.STRING },
  fileSize:      { type: DataTypes.INTEGER },
  isSupplement:  { type: DataTypes.BOOLEAN, defaultValue: false },
  aiStatus:      { type: DataTypes.STRING },
}, { tableName: 'documents' });

module.exports = Document;
