const { Sequelize, DataTypes } = require('sequelize');
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
        type: DataTypes.DATE,
        allowNull: true,
        field: 'dateofbirth'
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'ownerid'
    },
    careInstructions: {
        type: DataTypes.STRING(1234),
        field: 'careinstructions'
    },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
    },
    adoptionStatus: {
        type: DataTypes.STRING,
        defaultValue: 'Available',
        field: 'adoptionstatus'
    },
    weights: {
        type: DataTypes.ARRAY(DataTypes.JSON),
    },
    userId: {
        type: Sequelize.UUID,
        references: {
          model: User,
          key: 'id',
        },
        field: 'userid'
      },
    }, {
        tableName: 'pets',
        timestamps: false
    });


module.exports = Pet;
