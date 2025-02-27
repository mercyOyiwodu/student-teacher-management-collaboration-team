const studentModel = require('../model/studentModel');
const teacherModel = require('../model/teacherModel');
const sendEmail = require('../middleware/nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {signUpTemplate} = require('../utils/mailTemplate')

exports.registerTeacher = async (req, res) =>{
    try {
        const {fullname, gender,email, password, username, mentor } = req.body

        const teacher = await teacherModel.findOne({emai: email.toLowerCase()})
        if (teacher) {
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
        const hashedPassword = await bcrypt.hash(password, salt);
        const newTeacher = new teacherModel ({
            fullname, 
            email, 
            gender,
            username,
            password: hashedPassword,
            mentor
        })

        const token = jwt.sign({teacherId: newTeacher._id},
            process.env.JWT_SECRET, { expiresIn: '10h'}
        );
        console.log(token);
        
        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`;

        const firstName = newTeacher.fullname.split(' ')[0];
        const mailDetails = {
            subject: 'Welcome Email',
            email: newTeacher.email,
            html: signUpTemplate(link, firstName)
        }
        await newTeacher.save();
        await sendEmail(mailDetails);
        res.status(201).json({
            message: 'teacher created successfully',
            data: newTeacher
        });

    } catch (error) {
        console.log(error)
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
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const teacher = await teacherModel.findById(decodedToken.teacherId);
        
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
        teacher.isVerified = true;
        await teacher.save();
        res.status(200).json({
            message:'teacher verified successfully'
        })
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({
            message: 'error verifying email'
        })
    }
};


exports.teacherlogin = async (req, res) =>{
    try {
        const {email, password} = req.body;

        const teacherExist = await teacherModel.findOne({ email: email.toLowerCase() });
        if (!teacherExist.isVerified) {
            return res.status(400).json({
                message: `teacher with email: ${email} does not exist`
            })
        };
        const isCorrectPassword = bcrypt.compare(password, teacherExist.password)
        if (!isCorrectPassword) {
            return res.status(400).json({
                message: 'incorrect password'
            })
        };
        console.log(teacherExist);

        if (!teacherExist.isVerified) {
            return res.status(400).json({
                message: 'teacher not verified, please check your email to verify'
            })
        }
        const token = jwt.sign({teacherId: teacherExist._id}, process.env.JWT_SECRET, {expiresIn: '15mins'})
        res.status(200).json({
            message: 'login successful',
            data: teacherExist,
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