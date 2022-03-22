const { Pool, Client } = require('pg');
require('dotenv').config();

// Connect to DB and export getClient function
(async () => {
    const client = new Client({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    });
    await client.connect();
    const response = await client.query('SELECT $1::text as connected', ['Connection to postgres successful'])
    console.log(response.rows[0].connected);
    await client.end();
})();
