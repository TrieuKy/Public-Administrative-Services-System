const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:           { type: DataTypes.STRING, allowNull: false },
  category:       { type: DataTypes.STRING, allowNull: false },
  description:    { type: DataTypes.TEXT },
  processingDays: { type: DataTypes.INTEGER, defaultValue: 5 },
  requiredDocs:   { type: DataTypes.JSONB, defaultValue: [] },
  isActive:       { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'services' });

module.exports = Service;