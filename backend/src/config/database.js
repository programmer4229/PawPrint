const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('testdb', 'admin_test', 'AlmostFullAdmin07?', {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // If your RDS instance requires SSL
        rejectUnauthorized: false, // Allows self-signed certificates
      },
    },
  });
  
  module.exports = sequelize;
