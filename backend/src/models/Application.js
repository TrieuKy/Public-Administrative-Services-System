const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
  id:              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  applicationCode: { type: DataTypes.STRING, unique: true },
  userId:          { type: DataTypes.UUID, allowNull: false },
  serviceId:       { type: DataTypes.UUID, allowNull: false },
  officerId:       { type: DataTypes.UUID },
  formData:        { type: DataTypes.JSONB, defaultValue: {} },
  status: {
    type: DataTypes.ENUM('DRAFT','PENDING','PROCESSING','NEED_MORE','COMPLETED','REJECTED','CANCELLED'),
    defaultValue: 'DRAFT'
  },
  cancelReason:   { type: DataTypes.TEXT },
  rejectReason:   { type: DataTypes.TEXT },
  officerNote:    { type: DataTypes.TEXT },
  submittedAt:    { type: DataTypes.DATE },
  completedAt:    { type: DataTypes.DATE },
  deadline:       { type: DataTypes.DATE },
  rating:         { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  ratingContent:  { type: DataTypes.TEXT },
}, {
  tableName: 'applications',
  hooks: {
    beforeCreate: async (app) => {
      const count = await Application.count();
      app.applicationCode = `HS-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
    }
  }
});

module.exports = Application;