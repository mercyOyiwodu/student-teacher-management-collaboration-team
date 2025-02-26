const studentModel = require('../model/studentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { signUpTemplate } = require('../utils/mailTemplate')
const sendEmail =require('../middleware/nodemailer')

exports.registerStudent= async(req,res)=>{
    try {
        const { fullName, email, gender, password, stack } = req.body;
        
        const usernameExists = await studentModel.findOne({ userName: username.toLowerCase() });
        if (usernameExists) {
            return res.status(480).json({
                message: `Username has already been taken`
            })
        };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const student = new studentModel({
            fullName,
            email,
            password: hashedPassword,
            gender,
            username,
            stack
        });
        const token = await jwt.sign({ studentId: student._id }, process.env.JWT_SECRET);
        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`
        const firstName = user.fullName.split(' ')[1]
        const html = signUpTemplate(link, firstName)
        const mailOptions = {
            subject: 'Welcome Email',
            email: student.email,
            html
        };
        await sendEmail(mailOptions);
        await user.save();
        res.status(201).json({
            message: 'new student created successfully',
            data: user,
            token
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
exports.verifyStudentEmail = async(req,res)=>{
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({
                message: 'Token not found'
            })
        };
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        const student = await studentModel.findById(decodedToken.studentId);
        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            })
        };

        student.isVerified = true;
        await student.save()
        res.status(200).json({
            message: 'student verified successfully'
        })
    } catch (error) {
        console.log(error.message)
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Verification link expired'
            })
        }
        res.status(500).json({
            message: 'Error verifying Student: ' + error.message
        })
    }
}
exports.login = async(req,res)=>{
    try {
        const { email, password } = req.body;
        const studentExists = await studentModel.findOne({ email: email.toLowerCase() });
        if (studentExists === null) {
            return res.status(404).json({
                message: `User with email: ${email} does not exist`
            });
        }
        const isCorrectPassword = await bcrypt.compare(password, studentExists.password);
        if (isCorrectPassword === false) {
            return res.status(400).json({
                message: "Incorrect Password"
            });
        }
        if (studentExists.isVerified === false) {
            return res.status(400).json({
                message: "User not verified, Please check your email to verify"
            });
        }
        const token = await jwt.sign({ userId: studentExists._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: 'Login successful',
            data: studentExists,
            token
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Error Logging in student'
        });
    }
}

exports.getStudentPersonalInfo = async(req,res)=>{
    try {
        const {studentId} = req.student
        const student = await studentModel.findById(studentId)
        if(!student){
            return res.status(404).json({
                message:'student not found'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Error Logging in User'
        });
    }
}