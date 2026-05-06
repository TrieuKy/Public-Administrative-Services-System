const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  applicationId: { type: DataTypes.UUID, allowNull: true },
  authorId:      { type: DataTypes.UUID, allowNull: true },
  content:       { type: DataTypes.TEXT, allowNull: false },
  type:          { type: DataTypes.ENUM('internal', 'public', 'feedback'), defaultValue: 'internal' },
  topic:         { type: DataTypes.STRING, allowNull: true },
  title:         { type: DataTypes.STRING, allowNull: true },
  status:        { type: DataTypes.ENUM('pending', 'resolved', 'dismissed'), defaultValue: 'pending' },
}, { tableName: 'comments' });

module.exports = Comment;