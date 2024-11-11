const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./Users');
const Pet = require('./Pets');
const Meal = require('./FoodInfo');
const PetWeight = require('./PetWeight');
const Appointment = require('./Appointments');
const SharedPets = require('./SharedPets');
const { AdoptionInfo, Vaccination, Medication } = require('./MedicalHistory');

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
// a pet can have many weights
Pet.hasMany(PetWeight, { foreignKey: 'petId', as: 'petWeights' });
PetWeight.belongsTo(Pet, { foreignKey: 'petId' });
// for Sequelize to recognize SharedPets as the pivot model for User and Pet
SharedPets.belongsTo(User, { foreignKey: 'userId' });
SharedPets.belongsTo(Pet, { foreignKey: 'petId' });
// to allow a pet profile to be shared with many users
User.belongsToMany(Pet, { through: SharedPets, foreignKey: 'userId', as: 'sharedPets' });
Pet.belongsToMany(User, { through: SharedPets, foreignKey: 'petId', as: 'sharedWithUsers' });


module.exports = {
    User,
    Pet,
    AdoptionInfo,
    Vaccination,
    Medication,
    Meal,
    Appointment,
    SharedPets,
};