const express = require('express');
const studentRoutes = require('./routes/studentRouter');
const adminRoutes = require('./routes/adminRouter');
const teacherRoutes = require('./routes/teacherRouter');

require('./cofig/database');

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use('/api/v1', studentRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', teacherRoutes);

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
