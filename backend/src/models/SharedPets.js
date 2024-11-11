const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./Users');
const Pet = require('./Pets');

const SharedPets = sequelize.define('SharedPets', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        field: 'userid'
    },
    petId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Pet,
            key: 'id',
        },
        onDelete: 'CASCADE',
        field: 'petid'
    },
    readOnly: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'readonly'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'createdat'
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'updatedat'
    },
}, {
    tableName: 'sharedpets',
    timestamps: false,
    uniqueKeys: {
        unique_user_pet: {
            fields: ['userId', 'petId'],
        }
    }
});

module.exports = SharedPets;
