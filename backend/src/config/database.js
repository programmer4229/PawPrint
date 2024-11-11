const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('testdb', 'admin_test', 'AlmostFullAdmin07?', {
    dialect: 'postgres',
    host: 'database-1.cd6ky6cymg3c.us-east-2.rds.amazonaws.com',
    port: 54327,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // If your RDS instance requires SSL
        rejectUnauthorized: false, // Allows self-signed certificates
      },
    },
  });
  
  module.exports = sequelize;
