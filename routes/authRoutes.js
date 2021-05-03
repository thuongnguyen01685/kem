const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const router = Router();

router.get('*', checkUser);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/aboutme', authController.aboutme_get);
router.get('/user',requireAuth ,authController.user_get);
router.get('/user/:id',authController.upusers_get);
router.put('/user/:id', authController.user_update);
router.delete('/user/:id', authController.user_delete);
// router.get('/search', authController.user_search);
router.get('/search/:username', authController.user_search);
router.get('/roomchat',requireAuth,authController.roomchat_get);
module.exports = router;