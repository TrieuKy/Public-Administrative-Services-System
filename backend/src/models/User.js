const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    Id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    cccd: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('citizen', 'officer', 'admin'), defaultValue: 'citizen' },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verifyToken: { type: DataTypes.STRING},
}, {
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        }
    }
});
User.prototype.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

module.exports = User;