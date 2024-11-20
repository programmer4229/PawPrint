const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    petId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'petid'
    },
    careTaker: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'caretaker'
    },
    notes: {
        type: DataTypes.STRING(1234),
        allowNull: true,
    }
}, {
    tableName: 'appointments',
    timestamps: false
});


module.exports = Appointment;