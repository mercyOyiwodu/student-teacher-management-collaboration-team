const mongoose =require('mongoose')
const adminSchema = new mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        lowercase : true
    },
    password:{
        type: String,
        require: true
    },
    gender:{
        type: String,
        enum: ['Female','Male'],
        require: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    username:{
        type: String,
        require: true,

    },
    isAdmin:{
        type: boolean,
        default: false
    }

},{timestamps: true})

const adminModel= mongoose.model('students',adminSchema)

module.exports = adminModel
