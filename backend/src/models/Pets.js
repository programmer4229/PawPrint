const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./Users');

const Pet = sequelize.define('Pet', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
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
        type: DataTypes.STRING(1234),
    }
});

Pet.belongsTo(User, { foreignKey: 'ownerId' });
User.hasMany(Pet, { foreignKey: 'ownerId' });

module.exports = { Pet };
