const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pet = require('./Pets');

const Meal = sequelize.define('Meal', {
    petId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    mealTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    mealType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
});


module.exports = Meal;