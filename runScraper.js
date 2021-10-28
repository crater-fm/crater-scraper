#!/usr/bin/env node
const fs = require('fs')
const scraper = require('./nts-scraper.js');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();

// Read CSV containing URLs
let urls = fs.readFileSync(process.env.URL_LIST, 'utf8')
let urlArray = urls.split("\n")


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
