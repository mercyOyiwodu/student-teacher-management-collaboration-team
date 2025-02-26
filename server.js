const express = require('express')
require('./cofig/database')

const PORT = process.env.PORT || 7060

const app = express()

app.use(express.json())

app.listen(PORT, () =>{
    console.log(`app is running on port ${PORT} `);
    
})