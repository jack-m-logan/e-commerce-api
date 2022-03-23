const { Pool } = require('pg');
require('dotenv').config();

const config = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD
};

const pool = new Pool(config)

module.exports = pool;