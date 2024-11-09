const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const Pet = require('./Pet');
const AdoptionInfo = require('./AdoptionInfo');
const Vaccination = require('./Vaccination');
const Medication = require('./Medication');
const Meal = require('./Meal');
const Appointment = require('./Appointment');


// a pet can only have one adoptionInfo entry
Pet.hasOne(AdoptionInfo, {foreignKey: 'petId'});
AdoptionInfo.belongsTo(Pet, {foreignKey: 'petId'});
// a pet can have many vaccines
Pet.hasMany(Vaccination, {foreignKey: 'petId'});
Vaccination.belongsTo(Pet, {foreignKey: 'petId'});
// a pet can have many medications
Pet.hasMany(Medication, {foreignKey: 'petId'});
Medication.belongsTo(Pet, {foreignKey: 'petId'});
// a pet can have many meals
Pet.hasMany(Meal, { foreignKey: 'petId' });
Meal.belongsTo(Pet, { foreignKey: 'petId' });
// a pet can have many appointments
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