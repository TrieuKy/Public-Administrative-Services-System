const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    cccd: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('citizen', 'officer', 'admin'), defaultValue: 'citizen' },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verifyToken: { type: DataTypes.STRING},
    dob: { type: DataTypes.DATEONLY },
    phone: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    pob: { type: DataTypes.STRING },
    hometown: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    taxCode: { type: DataTypes.STRING },
    insuranceCode: { type: DataTypes.STRING },
    passport: { type: DataTypes.STRING },
    driverLicense: { type: DataTypes.STRING },
    nationality: { type: DataTypes.STRING },
    issueDate: { type: DataTypes.DATEONLY },
    expiryDate: { type: DataTypes.DATEONLY },
    issuePlace: { type: DataTypes.STRING },
    // Custom Fields for Officer
    officerCode: { type: DataTypes.STRING, unique: true },
    department: { type: DataTypes.STRING },
    workPhone: { type: DataTypes.STRING },
    position: { type: DataTypes.STRING }
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