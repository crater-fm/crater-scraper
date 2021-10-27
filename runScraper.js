#!/usr/bin/env node
// Script to run the episode page scraper & write to Postgres
// Author: Drew Nollsch, https://github.com/drex04

const fs = require('fs')
const scraper = require('./nts-scraper.js');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();

// Read CSV containing URLs
let urls = fs.readFileSync(process.env.URL_LIST, 'utf8')
let urlArray = urls.split("\n")

// Connect to PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})


/* 
// Check if URL has been scraped yet by pulling all episode URLs from database
pool.query('SELECT episode_url FROM episode ORDER BY episode_id ASC', (error, results) => {
    try {
        // Parse out data from the response
        var dbUrlArray = results.rows
        console.log(dbUrlArray)

        // For each URL in the input CSV, check if it's already been scraped into the database
        urlArray.forEach(function (item, index) {
            if (item = dbUrlArray[index].episode_url) {
                console.log(`URL has already been scraped: ${item}`)
            }
            // If it hasn't already been scraped into the database, then run the scraper function on the URL
            else {
                try {
                    var result = scraper.scrapeNTS(item)

                    console.log(`URL scraped into db: ${item}`)
                    // Wait before scraping the next URL to avoid getting IP flagged
                    function sleep(milliseconds) {
                        const date = Date.now();
                        let currentDate = null;
                        do {
                            currentDate = Date.now();
                        } while (currentDate - date < milliseconds);
                    }
                    sleep(process.env.WAIT_TIME_MS);
                }
                catch (err) {
                    console.log(err)
                    return;

                }
            }
        })
    }
    catch (err) {
        console.log(err)
    }

})
*/


// For each URL in the input CSV, check if it's already been scraped into the database
urlArray.forEach(function (item, index) {
    try {
        var result = scraper.scrapeNTS(item)

        console.log(`URL scraped into db: ${item}`)
        // Wait before scraping the next URL to avoid getting IP flagged
        function sleep(milliseconds) {
            const date = Date.now();
            let currentDate = null;
            do {
                currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        }
        sleep(process.env.WAIT_TIME_MS);
    }
    catch (err) {
        console.log(err)
        return;

    }
})