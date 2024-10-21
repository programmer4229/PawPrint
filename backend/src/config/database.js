const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'database-1.cd6ky6cymg3c.us-east-2.rds.amazonaws.com',
    username: 'admin_test',
    password: 'AlmostFullAdmin07?',
    database: 'testdb',
    'port': 54327,
    logging: false,
  });
  
  module.exports = sequelize;
