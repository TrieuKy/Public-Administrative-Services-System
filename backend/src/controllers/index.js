// Barrel export – tập trung export tất cả controllers để dễ import
module.exports = {
  auth:        require('./auth.controller'),
  application: require('./application.controller'),
  officer:     require('./officer.controller'),
};
