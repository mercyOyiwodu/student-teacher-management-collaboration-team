const { registerTeacher, verifyTeacherEmail, teacherlogin, getAllStudent } = require('../controllers/teacherController');
const { authenticate, teacherAuthenticate } = require('../middleware/authenticate');

const router = require('express').Router();

router.post('/teachers/register', authenticate, registerTeacher);
router.post('/teachers/verify-email/:token', verifyTeacherEmail);
router.post('/teachers/login', teacherlogin);
router.get('/teachers/view-student-info', teacherAuthenticate , getAllStudent);

module.exports = router;
