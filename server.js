const express = require('express')
const studentRoutes = require('./routes/studentRouter')
require('./cofig/database')


const PORT = process.env.PORT || 7060

const app = express()

app.use(express.json())
app.use(studentRoutes)

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT} `);

})