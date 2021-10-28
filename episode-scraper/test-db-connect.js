const { Pool, Client } = require('pg')
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
/*
pool.query('SELECT * FROM artist;', (err, res) => {
    console.log(err, res)
    pool.end()
})
*/
pool.query("INSERT INTO artist (artist_name) VALUES ('Steve Leach') RETURNING artist_id;", (err, res) => {
    console.log(err, res)
    pool.end()
})

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

client.connect()
client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end()
})