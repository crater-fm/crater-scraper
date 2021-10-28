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

urlArray.forEach(async function (item, index) {
    try {
        var result = await scraper.scrapeNTS(item)

        console.log(`URL scraped into db: ${item}`)
        // Wait before scraping the next URL to avoid getting IP flagged
        async function sleep(milliseconds) {
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