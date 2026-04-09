const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * AuditLog: ghi lại mọi hành động thay đổi trạng thái hồ sơ
 * (ai làm gì, lúc nào, từ trạng thái nào → sang trạng thái nào)
 */
const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  actorId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID người thực hiện hành động',
  },
  actorRole: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Vai trò: citizen | officer | admin | system',
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Tên hành động: SUBMIT, APPROVE, REJECT, SUPPLEMENT_REQUEST, ...',
  },
  fromStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Trạng thái trước khi thay đổi',
  },
  toStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Trạng thái sau khi thay đổi',
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Thông tin bổ sung: lý do từ chối, ghi chú, ...',
  },
}, {
  tableName: 'audit_logs',
  updatedAt: false, // Log chỉ cần createdAt
});

module.exports = AuditLog;
