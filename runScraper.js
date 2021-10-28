#!/usr/bin/env node
const fs = require('fs')
const scraper = require('./nts-scraper.js');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();

// Read CSV containing URLs
let urls = fs.readFileSync(process.env.URL_LIST, 'utf8')
let urlArray = urls.split("\n")

async function runScraper(urlArray) {
    // Connect to PostgreSQL
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    // Loop through array of URLs and run scrapeNTS
    console.log(urlArray.length, ' URLs to be scraped')
    
    for (const item of urlArray) {
        try {
            var result = await scraper.scrapeNTS(item, pool)

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
    // Close Postgres pool
    await pool.end();
}

runScraper(urlArray)
