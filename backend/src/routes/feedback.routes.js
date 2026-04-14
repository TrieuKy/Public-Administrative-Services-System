const router = require('express').Router();
const ctrl = require('../controllers/feedback.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Optional auth: if token is present, we can attach user. If not, it's anonymous.
// For simplicity, handle auth dynamically or just a simple check.
// Using a safe middleware that doesn't block if token is invalid/absent but just sets req.user
const optionalAuth = (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {}
  }
  next();
};

router.post('/', optionalAuth, ctrl.submitFeedback);

module.exports = router;
