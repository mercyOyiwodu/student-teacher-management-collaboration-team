require('dotenv').config();
const mongoose = require('mongoose')

const DB = process.env.MONGO_DB

mongoose.connect(DB)
.then(()=>{
    console.log('connected to the database successful')
})
.catch(() =>{
    console.log('error connecting to database: '+ error.message);
    
})