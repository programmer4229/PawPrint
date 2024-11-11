require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./src/config/database');
const cors = require('cors');

// require('./src/models/index');

const {
    User,
    Pet,
    Meal,
    Appointment,
    AdoptionInfo,
    Vaccination,
    Medication,
    SharedPets
} = require('./src/models/index');

// console.log("Associations for User:", User.associations);
// console.log("Associations for Pet:", Pet.associations);

const userRoutes = require('./src/routes/userRoutes');
const petRoutes = require('./src/routes/petRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');


app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
));
app.use(express.json());

app.use('/users', userRoutes);
// app.use('/pets', petRoutes);
app.use('/pets', (req, res, next) => {
    console.log("Pet route accessed with path:", req.path);
    next();
}, petRoutes);

app.use('/appointments', appointmentRoutes);


sequelize.sync({ force: false }).then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch(err => console.log(err));


