const Sequelize = require('sequelize');
require('dotenv').config();  // Load environment variables from .env file

// Set up our connection information
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,  // This will prevent SQL logging in console during development
    pool: {          // Connection pool settings
      max: 5,        // Maximum number of connection in pool
      min: 0,        // Minimum number of connection in pool
      acquire: 30000,// The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000    // The maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
);

// Export the connection
module.exports = sequelize;
