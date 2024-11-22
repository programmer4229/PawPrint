require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./src/config/database');
const cors = require('cors');

require('./src/models/index');

// const {
//     User,
//     Pet,
//     Meal,
//     Appointment,
//     AdoptionInfo,
//     Vaccination,
//     Medication,
//     SharedPets
// } = require('./src/models/index');

// console.log("Associations for User:", User.associations);
// console.log("Associations for Pet:", Pet.associations);

const userRoutes = require('./src/routes/userRoutes');
const petRoutes = require('./src/routes/petRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');


// Parse CORS origins
const parseCorsOrigins = (origins) => {
    if (!origins) return false; // Disable CORS if no origin is provided
    if (origins.includes(',')) {
        return origins.split(',').map((origin) => origin.trim());
    }
    return origins;
};

// CORS Configuration
app.use(cors({
    origin: parseCorsOrigins(process.env.CORS_ORIGIN),
    credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

app.use('/api/users', userRoutes);
// app.use('/pets', petRoutes);
app.use('/api/pets', (req, res, next) => {
    console.log("Pet route accessed with path:", req.path);
    next();
}, petRoutes);

app.use('/api/appointments', (req, res, next) => {
    console.log("Appointment route accessed with path:", req.path);
    next();
}, appointmentRoutes);


sequelize.sync({ force: false }).then(() => {
    console.log('Database connected');
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch(err => console.log(err));


