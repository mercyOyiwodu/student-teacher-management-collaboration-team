const { registerStudent, verifyStudentEmail, getStudentPersonalInfo } = require('../controllers/studentController')

const router = require('express').Router()

router.post('/students/register',registerStudent)
router.get('/students/verify-email/:token',verifyStudentEmail)
router.get('/students/student-details',getStudentPersonalInfo)




module.exports = router

