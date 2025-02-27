const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    fullname: {
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
    password: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        require: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    mentor: {
        type: String,
        enum: ['backend', 'frontend', 'product_design'],
        require: 'true'
    }
}, {timestamps: true});

const teacherModel = mongoose.model('teachers', teacherSchema);

module.exports = teacherModel;