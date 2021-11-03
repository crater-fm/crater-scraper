#!/usr/bin/env node
// Function to scrape tracklist data from NTS Radio (nts.live) radio show episodes and write to PostgreSQL database
// Author: Drew Nollsch, https://github.com/drex04

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();
const pgquery = require('./pgqueries.js');

module.exports = {
    // Async function to scrape data from NTS.live website
    scrapeNTS: async function (episodeUrl, djName, pool) {
        async function scrapeHtmlData(episodeUrl) {
            try {
                // Fetch HTML from URL
                const { data } = await axios.get(episodeUrl, {timeout: 10000});
                // Load html markup
                const $ = await cheerio.load(data);
                var reactState = await $("#react-state").html();
                // cut off the first and last bits of the string, leaving only JSON
                var PREFIX = "window._REACT_STATE_ = ";
                var SUFFIX = ';'
                if (reactState.length === 0) {
                    // No element with ID react-state, skip
                    console.log('No html element found called react-state')
                } else {
                    if (reactState.startsWith(PREFIX)) { // Check if HTML element starts with the normal prefix, and remove if so
                        reactState = reactState.slice(PREFIX.length);
                        if (reactState.slice(-1) === ";") {  // Check if HTML element starts with the normal suffix, and remove if so
                            reactState = reactState.slice(0, -1);
                        }
                        else {
                            // Skip this URL because it doesn't match normal format, and record the skipped URL
                            console.log("URL skipped because HTML does not match standard format")
                        }
                    }
                    else {
                        // Skip this URL because it doesn't match normal format, and record the skipped URL
                        console.log("URL skipped because HTML does not match standard format")
                    }
                    const reactStateData = JSON.parse(reactState)
                    return reactStateData
                }
            }
            catch (error) {
                //TODO: log these to a file instead of console
                console.log(error)
            }
        }


        // RUN FUNCTIONS SECTION
        try {
            const reactStateData = await scrapeHtmlData(episodeUrl)
            const episode = reactStateData.episode

            // Hardcoded episode platform because this scraper is designed specifically for the NTS Radio website
            var episodePlatform = 'NTS Radio'

            // Check if episode record already exists, and add it to the database if not, returning column values
            var upsertEpisodeResult = await pgquery.upsertEpisode(episode.name, episode.description, episode.updated, episodeUrl, episodePlatform, pool)
            var currentEpisodeId = upsertEpisodeResult.rows[0].episode_id


            var addUniqueDjResult = await pgquery.addUniqueDj(djName, pool)
            var currentDjId = addUniqueDjResult.rows[0].dj_id


            var addUniqueEpDjResult = await pgquery.addUniqueEpDj(currentEpisodeId, currentDjId, pool)
            var currentEpDjId = addUniqueEpDjResult.rows[0].episode_dj_id

            // Loop through all genres in the episode and add to database
            for (const genre of episode.genres) {

                var addUniqueGenreResult = await pgquery.addUniqueGenre(genre.value, pool)
                var currentGenreId = addUniqueGenreResult.rows[0].genre_id

                // Check if episode-genre relation already exists, and add if not, returning column values
                var addUniqueEpGenreResult = await pgquery.addUniqueEpGenre(currentEpisodeId, currentGenreId, pool)
            }
            // Check if the episode has a tracklist
            if (episode.tracklist.length > 0) {
                // Loop through all tracks in the episode and add to database
                for (const [songIndex, song] of episode.tracklist.entries()) {
                    // Check if song name already in database, and add if not
                    var addUniqueSongResult = await pgquery.addUniqueSong(song.title, pool)
                    var currentSongId = addUniqueSongResult.rows[0].song_id

                    // Check if artists for each song exist in database, and add if not
                    for (const artist of song.mainArtists) {

                        var addUniqueArtistResult = await pgquery.addUniqueArtist(artist.name, pool)
                        var currentArtistId = addUniqueArtistResult.rows[0].artist_id

                        // Add link from song to artist
                        var addUniqueSongArtistResult = await pgquery.addUniqueSongArtist(currentSongId, currentArtistId, pool)
                        var currentSongArtistId = addUniqueSongArtistResult.rows[0].song_artist_id

                        var addUniqueSetlistResult = await pgquery.addUniqueSetlist(currentSongArtistId, currentEpisodeId, songIndex, pool)
                        var currentSetlistId = addUniqueSetlistResult.rows[0].setlist_track_id
                    }
                }
            } else {
                // skip episodes without tracklist
            }
        }

        catch (error) {
            console.log(error)
        }
    }
}

