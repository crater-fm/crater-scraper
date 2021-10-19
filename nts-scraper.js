#!/usr/bin/env node
// Function to scrape tracklist data from NTS Radio (nts.live) radio show episodes and write to PostgreSQL database
const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio');
const pretty = require('pretty');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();


// Async function to scrape html from url
async function scrapeNTS(url) {
    try {
        // Fetch HTML from URL
        const { data } = await axios.get(url);
        // Load html markup
        const $ = cheerio.load(data);
        var reactState = $("#react-state").html();
        // cut off the first and last bits of the string, leaving only JSON
        var PREFIX = "window._REACT_STATE_ = ";
        var SUFFIX = ';'

        if (reactState.startsWith(PREFIX)) { // Check if HTML element starts with the normal prefix, and remove if so
            reactState = reactState.replace(PREFIX, '');
            if (reactState.slice(-1) === ";") {  // Check if HTML element starts with the normal suffix, and remove if so
                reactState = reactState.slice(0, -1);
            }
            else {
                // Skip this URL because it doesn't match normal format, and record the skipped URL
                console.log("URL skipped because HTML does not match standard format")
                skippedURL.push(url)
            }
        }
        else {
            // Skip this URL because it doesn't match normal format, and record the skipped URL
            console.log("URL skipped because HTML does not match standard format")
            skippedURL.push(url)
        }
        // Parse JSON string into Javascript object
        var episodeData = JSON.parse(reactState)
        console.log(episodeData.episode.tracklist)

        // Do stuff with the object episodeData here!
        // E.g. parse & export to PostgreSQL


    }
    catch (err) {
        console.error(err)
    }
}


var testURL = 'https://www.nts.live/shows/world-in-flo-motion/episodes/world-in-flo-motion-25th-january-2021';

// TEMP: read HTML markup from test file, TODO: read from URL instead
let markup = fs.readFileSync('flo-motion.html', 'utf8');

// Initialize array of skipped urls
var skippedURL = new Array();

scrapeNTS(testURL, markup)