#!/usr/bin/env node

const ntsScraper = require('ntsScraper.js');
const { Client } = require('pg');
const client = new Client(connection);

client.connect();

const query = `SELECT * FROM artist`

client
    .query(query, [1]) // what does this array 1 thing mean
    .then(res => {
        // Some operations with the data here
        client.end();
    })
