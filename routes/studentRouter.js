const { registerStudent, verifyStudentEmail, getStudentPersonalInfo } = require('../controllers/studentController')

const router = require('express').Router()

router.post('/register',registerStudent)
router.get('/verify-email/:token',verifyStudentEmail)
router.get('/student-details',getStudentPersonalInfo)




module.exports = router

