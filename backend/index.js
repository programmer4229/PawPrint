require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./src/config/database');
const cors = require('cors');


require('./src/models/Pets');
require('./src/models/Users');
require('./src/models/MedicalHistory');
require('./src/models/FoodInfo');
require('./src/models/Appointments');


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
app.use('/pets', petRoutes);
app.use('/appointments', appointmentRoutes);



sequelize.sync({ force: true }).then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
})
.catch(err => console.log(err));


