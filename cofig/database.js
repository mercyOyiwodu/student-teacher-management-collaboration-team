const mongoose = require('mongoose')
require('dotenv').config()
const db = process.env.MONGO_DB

mongoose.connect(db)
.then(()=>{
    console.log('Connection to database has been established Successfully');
    
})
.catch((error)=>{
    console.log('Error Connecting to database' + error.message);
    
})