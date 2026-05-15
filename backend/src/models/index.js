const User        = require('./User');
const Service     = require('./Service');
const Application = require('./Application');
const Document    = require('./Document');
const Notification = require('./Notification');
const Comment     = require('./Comment');
const AiLog       = require('./AiLog');
const Schedule    = require('./Schedule');
const ApplicationHistory = require('./ApplicationHistory');
const Post        = require('./Post');
const Payment     = require('./Payment');
const FormTemplate = require('./FormTemplate');

// Quan hệ
User.hasMany(Application,    { foreignKey: 'userId',    as: 'applications' });
Application.belongsTo(User,  { foreignKey: 'userId',    as: 'citizen' });
Application.belongsTo(User,  { foreignKey: 'officerId', as: 'officer' });

Service.hasMany(Application,       { foreignKey: 'serviceId' });
Application.belongsTo(Service,     { foreignKey: 'serviceId', as: 'service' });

Service.hasMany(FormTemplate, { foreignKey: 'serviceId', as: 'formTemplates' });
FormTemplate.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

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

Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Post,   { foreignKey: 'authorId', as: 'posts' });

Application.hasMany(AiLog,   { foreignKey: 'applicationId', as: 'aiLogs' });
AiLog.belongsTo(Application, { foreignKey: 'applicationId' });

// Payment associations
User.hasMany(Payment,        { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User,      { foreignKey: 'userId', as: 'payer' });
Payment.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

module.exports = { User, Service, Application, Document, Notification, Comment, AiLog, Schedule, ApplicationHistory, Post, Payment, FormTemplate };