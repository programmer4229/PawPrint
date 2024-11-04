const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
        allowNull: true
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    careInstructions: {
        type: DataTypes.STRING(1234),
    },
    image : {
        type: DataTypes.STRING,
    },
    adoptionStatus: {
        type: DataTypes.STRING,
        defaultValue: 'Available',
    },
    weights: {
        type: DataTypes.ARRAY(DataTypes.JSON),
    },
    userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
});


module.exports = Pet;
