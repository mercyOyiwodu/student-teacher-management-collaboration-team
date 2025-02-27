const { registerAdmin, verifyEmail, adminLogin } = require('../controllers/adminController');

const router = require('express').Router();

router.post('/admins/register', registerAdmin);
router.post('/admins/login', adminLogin);
router.post('/admins/verify-email/:token', verifyEmail);

module.exports = router;
