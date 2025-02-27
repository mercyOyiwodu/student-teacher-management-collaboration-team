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
        enum: ['female','male'],
        require: true
    },
    stack:{
        type: String,
        enum: ['backend','frontend','product-design'],
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
        type: Boolean,
        default: false
    },
    teacherId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'teachers'

    }
},{timestamps: true})

const studentModel= mongoose.model('students',studentSchema)

module.exports = studentModel
