const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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


module.exports = AdoptionInfo;