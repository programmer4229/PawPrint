const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cat = sequelize.define('Cat', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    breed: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
});

const Dog = sequelize.define('Dog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    breed: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    careInstructions: {
        type: DataTypes.STRING
    }
});


module.exports = Cat;
module.exports = Dog;
