const { registerAdmin, verifyEmail, adminLogin, getAllStudent, getAllTeacher, updateTeacher } = require('../controllers/adminController');
const { authenticate } = require('../middleware/authenticate');

const router = require('express').Router();

router.post('/admins/register', registerAdmin);
router.post('/admins/login', adminLogin);
router.post('/admins/verify-email/:token', verifyEmail);
router.get('/getAllStudent', authenticate, getAllStudent );
router.get('/getAllTeacher',getAllTeacher );
router.patch('/updateTeachers/:teacherId', updateTeacher)


module.exports = router;
