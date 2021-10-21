#!/usr/bin/env node
// Function to scrape tracklist data from NTS Radio (nts.live) radio show episodes and write to PostgreSQL database
const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();


// Async function to scrape html from url
async function scrapeNTS(url) {


    async function scrapeHtmlData(url) {
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
            var reactStateData = JSON.parse(reactState)
            var episode = reactStateData.episode
            return episode
        }
        catch (err) {
            console.error(err)
        }
    }


    // Function to check if episode, artist, song, genre already exist in the database
    async function getItem(selectColumn, table, compareColumn, compareValue) {
        const text = `
            SELECT $1
            FROM $2
            WHERE $3 = $4`;
        const values = [selectColumn, table, compareColumn, compareValue];
        return pool.query(text, values);
    }

    async function postItem(selectColumn, table, compareColumn, compareValue) {
        const text = `
            SELECT $1
            FROM $2
            WHERE $3 = $4`;
        const values = [selectColumn, table, compareColumn, compareValue];
        return pool.query(text, values);
    }

    // Function to add a single item to the database (e.g. song, artist, genre) and return the inserted row
    async function postItem(tableName, columnName, columnValue) {
        const text = `
            INSERT INTO $1($2)
            VALUES ($3)
            RETURNING *`;
        const values = [tableName, columnName, columnValue];
        return pool.query(text, values);
    }

    async function postEpisode(episodeName, episodeDescription, episodeDate, episodeURL) {
        const text = `
            INSERT INTO episode (episode_name, episode_description, episode_date, episode_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const values = [episodeName, episodeDescription, episodeDate, episodeURL];
        return pool.query(text, values);
    }

    // TODO: Add function to post song_artist relations

    // TODO: Add function to post setlist relations





// RUN FUNCTIONS SECTION
    (async () => {
    // Connect to PostgreSQL
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    const episode = await scrapeHtmlData(url);

    const duplicateEpisodeUrl = await getItem('episode-url', 'episode', 'episode_url', url)
    if (duplicateEpisodeUrl) { // skip if duplicate
        console.log('URL already exists in database')
    } else { // Post new episode to database
        var postEpResult = await postEpisode(episode.name, episode.description, episode.updated, url)
        console.log(postEpResult)
    }

    await pool.end();
    })
}



// TESTING SECTION

var testURL = 'https://www.nts.live/shows/world-in-flo-motion/episodes/world-in-flo-motion-25th-january-2021';


scrapeNTS(testURL)