const mongoose =require('mongoose')
const studentSchema = new mongoose.Schema({
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
    isStudent:{
        type: boolean,
        default: false
    },
    teacherId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'teachers'

    }
},{timestamps: true})

const studentModel= mongoose.model('students',studentSchema)

module.exports = studentModel
