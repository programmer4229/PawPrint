const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pet = require('./Pets');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
    },
    pets: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        references: {
            model: Pet,
            key: 'id',
        }
    }
});


module.exports = User;