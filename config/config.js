require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'carlos',
    password: process.env.DB_PASSWORD || '12345678',
    database: process.env.DB_NAME || 'topicos',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  }
};
