const adminModel = require("../model/adminModel");
const teacherModel = require("../model/teacherModel");
const studentModel = require("../model/studentModel");
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {signUpTemplate} = require('../utils/mailTemplate');
const sendEmail = require('../middleware/nodemailer');

exports.registerAdmin = async (req, res) => {
    try {
        const { fullName, email, gender, password, username } = req.body;
        const admin = await adminModel.findOne({ email: email.toLowerCase() });
        if (admin) {
            return res.status(400).json({ message: `Admin with Email: ${email}already exists` });
        };

        const usernameExist = await adminModel.findOne({ username: username.toLowerCase() });
        if (usernameExist) {
            return res.status(400).json({ message: 'Username has already been taken' });
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new adminModel({
            fullName,
            email,
            password: hashedPassword,
            gender,
            username
        });

        const token = jwt.sign({ adminId: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);
        
        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`;
        const firstName = newAdmin.fullName.split(' ')[0]

        const mailDetails = {
            email: newAdmin.email,
            subject: 'Welcome mail',
            html: signUpTemplate(link, firstName)
        };

        await sendEmail(mailDetails);
        await newAdmin.save();

        res.status(201).json({ message: 'Admin Registered successfully', data: newAdmin })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ message: 'Invalid token' })
        };

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await adminModel.findById(decodedToken.adminId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        };

        admin.isVerified = true;
        await admin.save();
        res.status(200).json({ message: 'Admin verified successfully' });
    } catch (error) {
        console.log(error.message)
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(400).json({ message: 'Token expired' })
        }
        res.status(500).json({ message: 'Error verifying User:' + error.message });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }

        if (!password) {
            return res.status(404).json({ message: 'Please enter your password' });
        };
        const adminExist = await adminModel.findOne({ email: email.toLowerCase() });
        if (!adminExist) {
            return res.status(400).json({ message: 'Admin not found' });
        };

        const isPasswordCorrect = await bcrypt.compare(password, adminExist.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect password' });
        };

        if (!adminExist.isVerified) {
            return res.status(400).json({ message: 'Please check your email for verification link' });
        };

        const token = jwt.sign({ adminId: adminExist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Admin logged in successfully', data: adminExist, token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAllTeacher =  async  (req, res) =>{
    try {
        const allTeacher = await teacherModel.find()
        res.status(200).json({
            message: 'kindly find all teachers below',
            data: allTeacher
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
            message: 'kindly find all students below',
            data: allStudent
        })
    } catch (error) {
        console.log(error.message)        
        res.status(500).json({
            message: 'internal server error'
        })
    }
};

exports.updateTeacher = async (req, res) =>{
    try {
        const {teacherId} = req.params
        const {fullname, mentor, email, username  } = req.body

        const teacher = await teacherModel.findById(teacherId)
        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher not found'
            })
        }
        const data = {
            fullname,
            mentor,
            email,
            username
        }
        const updatedTeacher = await teacherModel.findByIdAndUpdate(teacherId, data, {new: true})        
        res.status(200).json({
            message: 'Teacher updated successfully',
            data: updatedTeacher
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'internal server error'
        })
    }
};
exports.deleteTeacher = async (req, res) =>{
    try {
        const {teacherId} = req.params
        const teacher = teacherModel.findById(teacherId)
        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher not found'
            })
        }
        const deleteTeacher = await teacherModel.findByIdAndDelete(teacherId)
        if(!deleteTeacher){
            return res.status(404).json({
                message: 'Teacher has already been deleted'
            })
        }
        res.status(200).json({
            message: 'Teacher deleted successfully',
            data: deleteTeacher
        })
    } catch (error) {
        console.log(error.message)        
        res.status(500).json({
            message: 'Internal server error'
        })
    }
};

exports.updateStudent = async (req, res) =>{
    try {
        const {studentId} = req.params
        const {fullname,stack, email} = req.body
        const student = await studentModel.findById(studentId)
        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            })
        } 

        const data = {
            fullname,
            stack, 
            email
        }
        const updateStudent = await studentModel.findByIdAndUpdate(studentId, data, {new: true})
        res.status(200).json({
            message: 'Student updated successfully',
            data: updateStudent
        })
    } catch (error) {
        console.log(error.message)        
        res.status(500).json({
            message: 'internal server error'
        })
    }
}

exports.deleteStudent = async (req, res) =>{
    try {
        const {studentId} = req.params
        const student = await studentModel.findById(studentId)
        
        if (!student) {
            return res.status(404).json({
                message: 'student not found'
            })
        }
        const deleteStudent = await studentModel.findByIdAndDelete(studentId)
        if(!deleteStudent){
            return res.status(404).json({
                message: 'Student has already been deleted'
            })
        }
        res.status(200).json({
            message: 'student deleted successfully',
            data: deleteStudent
        })
    } catch (error) {
        console.log(error.message)        
        res.status(500).json({
            message: 'internal server error'
        })
    }
}