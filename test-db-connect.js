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

const sql = "SELECT * FROM artist;";

var tables = pool.query(sql, (err, res) => {
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