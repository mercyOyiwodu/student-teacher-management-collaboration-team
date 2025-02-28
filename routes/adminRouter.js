const { registerAdmin, verifyEmail, adminLogin, getAllStudent, getAllTeacher, updateTeacher, updateStudent, deleteTeacher, deleteStudent } = require('../controllers/adminController');
const { authenticate } = require('../middleware/authenticate');

const router = require('express').Router();

router.post('/admins/register', registerAdmin);
router.post('/admins/login', adminLogin);
router.post('/admins/verify-email/:token', verifyEmail);
router.get('/admins/getAllStudent', authenticate, getAllStudent );
router.delete('/admins/deleteStudent/:studentId', authenticate, deleteStudent );
router.delete('/admins/deleteTeacher/:teacherId', authenticate, deleteTeacher );
router.get('/admins/getAllTeacher', authenticate, getAllTeacher );
router.patch('/admins/updateTeachers/:teacherId', authenticate, updateTeacher);
router.patch('/admins/updateStudents/:studentId', authenticate,updateStudent);


module.exports = router;
