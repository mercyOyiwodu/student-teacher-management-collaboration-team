const { registerStudent, verifyStudentEmail, getStudentPersonalInfo, studentLogin } = require('../controllers/studentController')

const router = require('express').Router()

router.post('/students/register',registerStudent)
router.post('/students/login',studentLogin)
router.get('/students/verify-email/:token',verifyStudentEmail)
router.get('/students/student-details/:studentId',getStudentPersonalInfo)



module.exports = router

