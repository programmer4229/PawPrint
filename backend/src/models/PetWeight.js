const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pet = require('./Pets');

const PetWeight = sequelize.define('PetWeight', {
    weight_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
}, {
    tableName: 'petweight',
    timestamps: false
});

module.exports = PetWeight;