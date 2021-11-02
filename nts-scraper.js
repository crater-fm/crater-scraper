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
                const { data } = await axios.get(episodeUrl);
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
            const reactStateData = await scrapeHtmlData(episodeUrl)
            const episode = reactStateData.episode
            
            // Hardcoded episode platform because this scraper is designed specifically for the NTS Radio website
            var episodePlatform = 'NTS Radio'

            // Check if episode record already exists, and add it to the database if not, returning column values
            var addUniqueEpisodeResult = await pgquery.addUniqueEpisode(episode.name, episode.description, episode.updated, episodeUrl, episodePlatform, pool)
            var currentEpisodeId = addUniqueEpisodeResult.rows[0].episode_id


            var addUniqueDjResult = await pgquery.addUniqueDj(djName, pool)
            var currentDjId = addUniqueDjResult.rows[0].dj_id


            var addUniqueEpDjResult = await pgquery.addUniqueEpDj(currentEpisodeId, currentDjId, pool)
            console.log(addUniqueEpDjResult.rows[0])
            var currentEpDjId = addUniqueEpDjResult.rows[0].episode_dj_id

            /* TODO: remove this block after testing addUniqueEpDj.... might not be working now
            // Check if the entry for this Episode-DJ relationship already exists in db
            var getEpisodeDjResult = await pgquery.getEpisodeDj(currentEpisodeId, currentDjId, pool)
            if (getEpisodeDjResult.rows.length > 0) {
                // skip duplicate
            } else { // Add if new
                var addEpisodeDjResult = await pgquery.addEpisodeDj(currentEpisodeId, currentDjId, pool)
                var getEpisodeDjResult = await pgquery.getEpisodeDj(currentEpisodeId, currentDjId, pool)
            }
            var currentEpisodeDjId = getEpisodeDjResult.rows[0].episode_dj_id
            */


            // Loop through all genres in the episode and add to database
            for (const genre of episode.genres) {

                var addUniqueGenreResult = await pgquery.addUniqueGenre(genre.value, pool)
                var currentGenreId = addUniqueGenreResult.rows[0].genre_id

                /* TODO: delete this block after testing addUniqueGenre
                var getGenreResult = await pgquery.getGenre(genre.value, pool)
                if (getGenreResult.rows.length > 0) {
                    // skip duplicates
                } else {
                    var addGenreResult = await pgquery.addGenre(genre.value, genre.id, pool)
                }
                // Find the id of the current genre
                var currentGenreId = await pgquery.getGenre(genre.value, pool)
                var currentGenreId = currentGenreId.rows[0].genre_id
                */

                // Check if episode-genre relation already exists, and add if not, returning column values
               var addUniqueEpGenreResult = await pgquery.addUniqueEpGenre(currentEpisodeId, currentGenreId, pool)

                /* TODO: Remove this block after testing addUniqueEpGenreResult
                var getEpisodeGenreResult = await pgquery.getEpisodeGenre(currentEpisodeId, currentGenreId, pool)

                if (getEpisodeGenreResult.rows.length > 0) {
                    // skip duplicate
                } else { // add new entry to link episode to genre
                    var addEpisodeGenreResult = await pgquery.addEpisodeGenre(currentEpisodeId, currentGenreId, pool)
                }
                */
            }

            // Loop through all tracks in the episode and add to database
            for (const [songIndex, song] of episode.tracklist.entries()) {
                // Check if song name already in database, and add if not
                var addUniqueSongResult = await pgquery.addUniqueSong(song.title, pool)
                var currentSongId = addUniqueSongResult.rows[0].song_id

                /* TODO: remove this block after testing addUniqueSongResult
                var getSongResult = await pgquery.getSong(song.title, pool)
                if (getSongResult.rows.length > 0) {
                    // skip duplicates
                } else {
                    var addSongResult = await pgquery.addSong(song.title, pool)
                }
                */

                // Check if artists for each song exist in database, and add if not
                for (const artist of song.mainArtists) {
                    
                    var addUniqueArtistResult = await pgquery.addUniqueArtist(artist.name, pool)
                    var currentArtistId = addUniqueArtistResult.rows[0].artist_id

                    /* TODO: Remove after testing
                    var getArtistResult = await pgquery.getArtist(artist.name, pool)
                    if (getArtistResult.rows.length > 0) {
                        // skip duplicates
                    } else {
                        var addArtistResult = await pgquery.addArtist(artist.name, pool)
                    }
                    */

                    // Add link from song to artist
                    
                    /* TODO: Remove this block after testing
                    // Check song_id and artist_id of current song
                    var currentSongId = await pgquery.getSong(song.title, pool)
                    var currentSongId = currentSongId.rows[0].song_id
                    var currentArtistId = await pgquery.getArtist(artist.name, pool)
                    var currentArtistId = currentArtistId.rows[0].artist_id
                    */

                    var addUniqueSongArtistResult = await pgquery.addUniqueSongArtist(currentSongId, currentArtistId, pool)
                    var currentSongArtistId = addUniqueSongArtistResult.rows[0].song_artist_id

                    /* TODO: Remove this block after testing
                    // Check to make sure the relation is not already in the database
                    var getSongArtistResult = await pgquery.getSongArtist(currentSongId, currentArtistId, pool)
                    if (getSongArtistResult.rows.length > 0) {
                        // skip duplicate
                    } else { // add to database
                        var addSongArtistResult = await pgquery.addSongArtist(currentSongId, currentArtistId, pool)
                    }
                    */

                    var addUniqueSetlistResult = await pgquery.addUniqueSetlist(currentSongArtistId, currentEpisodeId, songIndex, pool)
                    var currentSetlistId = addUniqueSetlistResult.rows[0].setlist_track_id

                    /* TODO: Remove block after testing
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
                    */
                }


            }
        }

        catch (error) {
            console.log(error)
        }


    }
}

