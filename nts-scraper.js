#!/usr/bin/env node
// Function to scrape tracklist data from NTS Radio (nts.live) radio show episodes and write to PostgreSQL database
const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();
const pgquery = require('./pgqueries.js');

module.exports = {
    // Async function to scrape data from NTS.live website
    scrapeNTS: async function (url, pool) {
        async function scrapeHtmlData(url) {
            try {
                // Fetch HTML from URL
                const { data } = await axios.get(url);
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
                console.log(error)
            }
        }






        // RUN FUNCTIONS SECTION
        try {
            const reactStateData = await scrapeHtmlData(url)
            const episode = reactStateData.episode

            var getEpisodeResult = await pgquery.getEpisode(url, pool)

            if (getEpisodeResult.rows.length > 0) {
                // skip duplicate
            } else { // Add episode data to database
                const addEpisodeResult = await pgquery.addEpisode(episode.name, episode.description, episode.updated, url, pool)
            }
            // Get the episode ID of the current episode (either existing in database or just added)
            var currentEpisodeId = await pgquery.getEpisode(url, pool)
            var currentEpisodeId = currentEpisodeId.rows[0].episode_id

            // Loop through all genres in the episode and add to database
            for (const genre of episode.genres) {
                var getGenreResult = await pgquery.getGenre(genre.value, pool)
                if (getGenreResult.rows.length > 0) {
                    // skip duplicates
                } else {
                    var addGenreResult = await pgquery.addGenre(genre.value, genre.id, pool)
                }
                // Find the id of the current genre
                var currentGenreId = await pgquery.getGenre(genre.value, pool)
                var currentGenreId = currentGenreId.rows[0].genre_id

                // There is a bug with getEpisodeGenre!!!

                // Check if episode-genre relation already exists
                var getEpisodeGenreResult = await pgquery.getEpisodeGenre(currentEpisodeId, currentGenreId, pool)

                if (getEpisodeGenreResult.rows.length > 0) {
                    // skip duplicate
                } else { // add new entry to link episode to genre
                    var addEpisodeGenreResult = await pgquery.addEpisodeGenre(currentEpisodeId, currentGenreId, pool)
                }

            }

            // Loop through all tracks in the episode and add to database
            for (const [songIndex, song] of episode.tracklist.entries()) {
                // Check if song name already in database, and add if not
                var getSongResult = await pgquery.getSong(song.title, pool)
                if (getSongResult.rows.length > 0) {
                    // skip duplicates
                } else {
                    var addSongResult = await pgquery.addSong(song.title, pool)
                }

                // Check if artists for each song exist in database, and add if not
                for (const artist of song.mainArtists) {
                    var getArtistResult = await pgquery.getArtist(artist.name, pool)
                    if (getArtistResult.rows.length > 0) {
                        // skip duplicates
                    } else {
                        var addArtistResult = await pgquery.addArtist(artist.name, pool)
                    }

                    // Add link from song to artist
                    // Check song_id and artist_id of current song
                    var currentSongId = await pgquery.getSong(song.title, pool)
                    var currentSongId = currentSongId.rows[0].song_id
                    var currentArtistId = await pgquery.getArtist(artist.name, pool)
                    var currentArtistId = currentArtistId.rows[0].artist_id

                    // Check to make sure the relation is not already in the database
                    var getSongArtistResult = await pgquery.getSongArtist(currentSongId, currentArtistId, pool)
                    if (getSongArtistResult.rows.length > 0) {
                        // skip duplicate
                    } else { // add to database
                        var addSongArtistResult = await pgquery.addSongArtist(currentSongId, currentArtistId, pool)
                    }

                    // Check and add Setlist relations
                    // Check song_artist_id and episode_id of current song
                    var currentSongArtistId = await pgquery.getSongArtist(currentSongId, currentArtistId, pool)
                    var currentSongArtistId = currentSongArtistId.rows[0].song_artist_id

                    // Check if track in setlist has already been added to database
                    var getSetlistResult = await pgquery.getSetlist(currentSongArtistId, currentEpisodeId, songIndex, pool)

                    if (getSetlistResult.rows.length > 0) {
                        // skip duplicate
                    } else { // Add the track if not
                        var addSetlistResult = await pgquery.addSetlist(currentSongArtistId, currentEpisodeId, songIndex, pool)
                    }
                }


            }
        }

        catch (error) {
            console.log(error)
        }


    }
}

