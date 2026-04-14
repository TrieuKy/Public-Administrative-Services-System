const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title:       { type: DataTypes.STRING, allowNull: false },
  excerpt:     { type: DataTypes.TEXT },
  content:     { type: DataTypes.TEXT },
  imageUrl:    { type: DataTypes.STRING },
  category:    { type: DataTypes.ENUM('Tin tức', 'Hướng dẫn', 'Thông báo'), defaultValue: 'Tin tức' },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  publishedAt: { type: DataTypes.DATE },
  authorId:    { type: DataTypes.UUID, allowNull: true },
}, { tableName: 'posts' });

module.exports = Post;
