const studentModel = require('../model/studentModel');
const teacherModel = require('../model/teacherModel');
const sendEmail = require('../middleware/nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const signUpTemplate = require('../utils/mailTemplate')

exports.registerTeacher = async (req, res) =>{
    try {
        const {fullName, gender,email, passWord, username} = req.body

        const teachers = await teacherModel.findOne({emai: email.toLowerCase})
        if (teachers) {
            return res.status(400).json({
                message: `teacher with email: ${email} already exists `
            })
        }
        const teacherExists = await teacherModel.findOne({username: username.toLowerCase()})
        if (teacherExists) {
            return res.status(400).json({
                message: 'username has already been taken'
            })
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passWord, salt);
        const newTeacher = new teacherModel ({
            fullName, 
            email, 
            gender,
            username,
            passWord: hashedPassword,
            mentor

        })

        const token = await jwt.sign({teacherId: newTeacher._id},
            process.env.JWT_SECRET, { expiresIn: '10h'}
        )
        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = newTeacher.fullName.split(' ')[0]
        const mailDetails = {
            subject: 'Welcome Email',
            email: newTeacher.email,
            html: signUpTemplate(link, firstName)
        }

        await sendEmail(mailDetails)

        await newTeacher.save()
        res.status(201).json({
            message: 'teacher created successfully',
            data: newTeacher
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'internal server error'
        })
    }
};

exports.verifyTeacherEmail = async (req, res) =>{
    try {
        const {token} = req.params
        if (!token) {
            return res.status(400).json({
                message: 'token not found'
            })
        }
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
        const teacher = await teacherModel.findById(decodedToken.teacherId)

        if (!teacher) {
            return res.status(404).json({
                message: 'teacher not found'
            })
        }
        if (teacher.isVerified === true) {
            return res.status(400).json({
                message: 'teacher has already been verified'
            })
        }
        
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({
            message: 'error verifying email'
        })
    }
};


exports.login = async (req, res) =>{
    try {
        const {email, passWord} = req.body;

        const teacherExists = await teacherModel.findOne({ email: email.toLowerCase() });
        if (teacherExists.isVerified === false) {
            return res.status(400).json({
                message: `teacher with email: ${email} does not exist`
            })
        };
        const isCorrectPassword = await bcrypt.compare(passWord, teacherExists.passWord)
        if (isCorrectPassword === false) {
            return res.status(400).json({
                message: 'incorrect password'
            })
        };
        console.log(teacherExists);

        if (teacherExists.isVerified === false) {
            return res.status(400).json({
                message: 'user not verified, please check your email to verify'
            })
        }
        const token = await jwt.sign({teacherId: teacher._id}, process.env.JWT_SECRET, {expiresIn: '15mins'})
        res.status(200).json({
            message: 'login successful',
            data: teacherExists,
            token
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'internal server error'
        })
    }
};

exports.getAllStudent = async (req, res) =>{
    try {
        const allStudent = await studentModel.find()
        res.status(200).json({
            message: 'kindly find below all students',
            data: allStudent
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'internal server error'
        })
    }
}
exports.updatedStudentDetails = async (req, res) =>{
    try {
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'internal server error'
        })
    }
}