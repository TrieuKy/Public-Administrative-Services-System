const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FormTemplate = sequelize.define('FormTemplate', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  serviceId: { type: DataTypes.UUID, allowNull: false },
  documentName: { type: DataTypes.STRING, allowNull: false },
  fileName: { type: DataTypes.STRING, allowNull: false },
  fileUrl: { type: DataTypes.STRING, allowNull: false },
  extractedFields: { type: DataTypes.JSONB, defaultValue: [] },
}, { tableName: 'form_templates' });

module.exports = FormTemplate;
