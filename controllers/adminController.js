// const Student = require("../models/Student");
// const Teacher = require("../models/Teacher");

const adminModel = require("../model/adminModel");

// exports.createTeacher = async (req, res) => {
//   const teacher = new Teacher(req.body);
//   await teacher.save();
//   res.status(201).json(teacher);
// };

// exports.getAllTeachers = async (req, res) => {
//   const teachers = await Teacher.find();
//   res.json(teachers);
// };

// exports.deleteStudent = async (req, res) => {
//   await Student.findByIdAndDelete(req.params.id);
//   res.json({ message: "Student removed" });
// };





exports.registerAdmin = async (req, res) => {
    try {
        const { fullName, email, gender, password, username } = req.body;
        const admin = await adminModel.findOne({ email: email.toLowerCase() });
        if (admin) {
            return res.status(400).json({ message: `Admin with Email: ${email}already exists` });

        };
        const usernameExist = await userModel.findOne({ username: username.toLowerCase() });
        if (usernameExist) {
            return res.status(400).json({ message: `Username has already been taken` });
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


        const token = await jwt.sign({ adminId: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`;
        const firstName = newAdmin.fullName.split(' ')[0]



        const mailDetails = {
            email: newAdmin.email,
            subject: 'Welcome mail',
            html: signUpTemplate(link, firstName)
        };

        await sendEmail(mailDetails);
        await newAdmin.save();

        res.status(201).json({ message: 'Admin Registered successfully', data: newUser })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Inter Server Error' });
    }
}


exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ message: 'Invalid token' })
        };

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        const admin = await adminModel.findById(decodedToken.userId);

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

}


exports.adminLogin = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email && !username) {
            return res.status(400).json({ message: 'Email or username is required' });
        }

        if (!passsword) {
            return res.status(404).json({ message: 'Please enter your password' });
        };


        const admin = await adinModel.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });


        if (admin === null) {
            return res.status(400).json({ message: 'Admin not found' });
        };

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect === false) {
            return res.status(400).json({ message: 'Incorrect password' });
        };

        if (admin.isVerified === false) {
            return res.status(400).json({ message: 'Please check your email for verification link' });
        };


        const token = await jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Amin logged in successfully', data: userExist, token });

        res.status(200).json({
            message: 'Admin logged in successfully', data: user, token
        })


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
