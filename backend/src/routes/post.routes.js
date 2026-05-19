const router = require('express').Router();
const ctrl   = require('../controllers/post.controller');
const auth   = require('../middlewares/auth.middleware');
const role   = require('../middlewares/role.middleware');

router.get('/',     ctrl.getPosts);                                    // public
router.get('/:id',  ctrl.getPost);                                     // public - chi tiết bài viết
router.post('/',    auth, role('officer', 'admin'), ctrl.createPost);  // officer/admin
router.put('/:id',  auth, role('officer', 'admin'), ctrl.updatePost);  // officer/admin
router.delete('/:id', auth, role('officer', 'admin'), ctrl.deletePost); // officer/admin

module.exports = router;
