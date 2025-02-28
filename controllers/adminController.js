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
}
