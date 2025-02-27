const adminModel =require('../model/adminModel')
const jwt = require('jsonwebtoken');
const teacherModel = require('../model/teacherModel');


exports.authenticate = async(req,res,next) =>{
    try {
        const auth= req.headers.authorization;
        if(!auth){
            return res.status(400).json({
                message: 'token not found'
            })
        }
        const token = auth.split(' ')[1]
        if(!token){
            return res.status(404).json({
                message:'Authention Failed: token not found'
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await adminModel.findById(decodedToken.adminId);
        if(!admin){
            console.log('Admin not found');
            return res.status(401).json({
                message: 'Unauthorized: Only Admin can perform this action'
            })
        }
        req.admin = decodedToken;
        next()
    } catch (error) {
        console.log(error.message);
    
        if(error instanceof jwt.JsonWebTokenError){
            return res.status(400).json({
                message: 'Session timeout: Please Login To Continue'
            })
        }
        res.status(500).json({
            message:'Internal Server'
        })
    }
}
exports.teacherAuthenticate =  async (req,res,next)=>{
    try {
        const auth = req.headers.authorization
        if(!auth){
            return res.status(404).json({
                message: 'Token not found'
            })
        }
        const token = auth.split(' ')[1]
        if(!token){
            return res.status(404).json({
                message: 'Authentication Failed: token not found'
            })
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        const teacher = await teacherModel.findById(decodedToken.teacherId)
        if(!teacher){
            console.log('teacher not found');
            return res.status(401).json({
                message: 'Unauthorized: Only teacher can perform this action'
            })
        }
        req.teacher = decodedToken
        next()
        
    } catch (error) {
        console.log(error.message);
        if(error instanceof jwt.JsonWebTokenError){
            return res.status(400).json({
                message: 'Session timeout: Please Login To Continue'
            })
        }
        res.status(500).json({
            message:'Internal Server'
        })
    }
};