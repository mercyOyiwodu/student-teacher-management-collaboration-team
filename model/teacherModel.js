const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        lowerCase: true
    },
    username: {
        type: String,
        require: true,
        lowerCase: true
    },
    passWord: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        require: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isTeacher: {
        type: Boolean,
        default: false
    },
    
    studentId:[ {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "students"
    }]

}, {timestamps: true});

const teacherModel = mongoose.model('teachers', teacherSchema);

module.exports = teacherModel;