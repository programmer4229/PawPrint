const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pet = require('./Pets');

const Meal = sequelize.define('Meal', {
    meal_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    petId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Pet,
            key: 'id'
        },
        onDelete: 'CASCADE'
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
    }
}, {
    tableName: 'meal',
    timestamps: false
});

module.exports = Meal;
