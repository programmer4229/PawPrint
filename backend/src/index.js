require('dotenv').config();
const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

app.use(express.json());

app.use('/users', userRoutes);
app.use('/pets', petRoutes);
app.use('/appointments', appointmentRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}).catch((err) => {
    console.error('Connection error', err.stack);
});