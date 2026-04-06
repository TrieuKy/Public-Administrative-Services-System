const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  applicationId: { type: DataTypes.UUID, allowNull: false },
  authorId:      { type: DataTypes.UUID, allowNull: false },
  content:       { type: DataTypes.TEXT, allowNull: false },
  type:          { type: DataTypes.ENUM('internal', 'public'), defaultValue: 'internal' },
}, { tableName: 'comments' });

module.exports = Comment;