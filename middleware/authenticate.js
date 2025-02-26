const studentModel =require('../model/studentModel')
const jwt = require('jsonwebtoken')


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
            return res.status(404).json
        }
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