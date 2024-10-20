const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pet = require('./Pets');

const AdoptionInfo = sequelize.define('AdoptionInfo', {
    petId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    vetName: {
        type: DataTypes.STRING,
    }, 
    officeName: {
        type: DataTypes.STRING,
    },
    firstVisitData: {
        type: DataTypes.DATEONLY, 
    }, 
    lastVisitDat: {
        type: DataTypes.DATEONLY,
    }, 
    phoneNumber: {
        
    }
    

});

const Vaccination = sequelize.define('Vaccination', {
    petId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    vaccinationName: {
        type: DataTypes.STRING,
    }, 
    vaccinationDate: {
        type: DataTypes.DATEONLY,
    },
    vetName: {
        type: DataTypes.STRING,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
    },
});

const Medication = sequelize.define('Medication', {
    petId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    medicationName: {
        type: DataTypes.STRING,
    }, 
    medicationDate: {
        type: DataTypes.DATEONLY,
    },
    vetName: {
        type: DataTypes.STRING,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
    },
    dosage: {
        type: DataTypes.STRING,
    },
    frequency: {
        type: DataTypes.STRING,
    },
    notes: {
        type: DataTypes.STRING(1234),
    }
});

Pet.hasOne(AdoptionInfo, {foreignKey: 'petId'});
AdoptionInfo.belongsTo(Pet, {foreignKey: 'petId'});
Pet.hasMany(Vaccination, {foreignKey: 'petId'});
Vaccination.belongsTo(Pet, {foreignKey: 'petId'});
Pet.hasMany(Medication, {foreignKey: 'petId'});
Medication.belongsTo(Pet, {foreignKey: 'petId'});


module.exports = {AdoptionInfo, Vaccination, Medication};