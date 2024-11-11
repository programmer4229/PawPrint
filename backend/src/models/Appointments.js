const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pet = require('./Pets');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    petId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    careTaker: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    notes: {
        type: DataTypes.STRING(1234),
    },
}, {
    tableName: 'appointments',
    timestamps: false
});



module.exports = Appointment;