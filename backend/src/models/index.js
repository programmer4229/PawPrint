const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const Pet = require('./Pet');
const AdoptionInfo = require('./AdoptionInfo');
const Vaccination = require('./Vaccination');
const Medication = require('./Medication');
const Meal = require('./Meal');
const Appointment = require('./Appointment');



Pet.hasOne(AdoptionInfo, {foreignKey: 'petId'});
AdoptionInfo.belongsTo(Pet, {foreignKey: 'petId'});
Pet.hasMany(Vaccination, {foreignKey: 'petId'});
Vaccination.belongsTo(Pet, {foreignKey: 'petId'});
Pet.hasMany(Medication, {foreignKey: 'petId'});
Medication.belongsTo(Pet, {foreignKey: 'petId'});

Pet.hasMany(Meal, { foreignKey: 'petId' });
Meal.belongsTo(Pet, { foreignKey: 'petId' });


Appointment.belongsTo(Pet, { foreignKey: 'petId' });
Pet.hasMany(Appointment, { foreignKey: 'petId' });


module.exports = {
    User,
    Pet,
    AdoptionInfo,
    Vaccination,
    Medication,
    Meal,
    Appointment,
};