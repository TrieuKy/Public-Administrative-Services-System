const User        = require('./User');
const Service     = require('./Service');
const Application = require('./Application');
const Document    = require('./Document');
const Notification = require('./Notification');
const Comment     = require('./Comment');
const AiLog       = require('./AiLog');
const Schedule    = require('./Schedule');
const ApplicationHistory = require('./ApplicationHistory');

// Quan hệ
User.hasMany(Application,    { foreignKey: 'userId',    as: 'applications' });
Application.belongsTo(User,  { foreignKey: 'userId',    as: 'citizen' });
Application.belongsTo(User,  { foreignKey: 'officerId', as: 'officer' });

Service.hasMany(Application,       { foreignKey: 'serviceId' });
Application.belongsTo(Service,     { foreignKey: 'serviceId', as: 'service' });

Application.hasMany(Document,      { foreignKey: 'applicationId', as: 'documents' });
Document.belongsTo(Application,    { foreignKey: 'applicationId' });

Application.hasMany(Comment,       { foreignKey: 'applicationId', as: 'comments' });
Comment.belongsTo(User,            { foreignKey: 'authorId', as: 'author' });

User.hasMany(Notification,         { foreignKey: 'userId' });
Notification.belongsTo(Application,{ foreignKey: 'applicationId' });

User.hasMany(Schedule, { foreignKey: 'userId', as: 'schedules' });
Schedule.belongsTo(User, { foreignKey: 'userId', as: 'officer' });

Application.hasMany(ApplicationHistory, { foreignKey: 'applicationId', as: 'histories' });
ApplicationHistory.belongsTo(Application, { foreignKey: 'applicationId' });
ApplicationHistory.belongsTo(User, { foreignKey: 'actorId', as: 'actor' });

module.exports = { User, Service, Application, Document, Notification, Comment, AiLog, Schedule, ApplicationHistory };