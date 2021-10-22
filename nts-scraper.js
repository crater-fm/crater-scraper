#!/usr/bin/env node
// Function to scrape tracklist data from NTS Radio (nts.live) radio show episodes and write to PostgreSQL database
const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio');
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    // Async function to scrape html from url
    scrapeNTS: async function (url) {
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


        // Functions to check if episode, artist, song, genre already exist in the database
        async function getEpisode(url, pool) {
            const text = `
            SELECT episode_id
            FROM episode
            WHERE episode_url = $1`;
            const values = [url];
            return pool.query(text, values);
        }
        async function addEpisode(episodeName, episodeDescription, episodeDate, episodeURL, pool) {
            const text = `
            INSERT INTO episode (episode_name, episode_description, episode_date, episode_url)
            VALUES ($1, $2, $3, $4)
            RETURNING episode_id`;
            const values = [episodeName, episodeDescription, episodeDate, episodeURL];
            return pool.query(text, values);
        }

        // Functions to get/add songs
        async function getSong(songName, pool) {
            const text = `
            SELECT song_id
            FROM song
            WHERE song_name = $1`;
            const values = [songName];
            return pool.query(text, values);
        }
        async function addSong(songName, pool) {
            const text = `
            INSERT INTO song (song_name)
            VALUES ($1)
            RETURNING song_id`;
            const values = [songName];
            return pool.query(text, values);
        }

        // Functions to get/add artists
        async function getArtist(artistName, pool) {
            const text = `
            SELECT artist_id
            FROM artist
            WHERE artist_name = $1`;
            const values = [artistName];
            return pool.query(text, values);
        }
        async function addArtist(artistName, pool) {
            const text = `
            INSERT INTO artist (artist_name)
            VALUES ($1)
            RETURNING artist_id`;
            const values = [artistName];
            return pool.query(text, values);
        }

        // Functions to get/add genres
        async function getGenre(genreName, pool) {
            const text = `
            SELECT genre_id
            FROM genre
            WHERE genre_name = $1`;
            const values = [genreName];
            return pool.query(text, values);
        }
        async function addGenre(genreName, genreParentStr, pool) {
            const text = `
            INSERT INTO genre (genre_name, genre_parent_string)
            VALUES ($1, $2)
            RETURNING genre_id`;
            const values = [genreName, genreParentStr];
            return pool.query(text, values);
        }

        // Functions to get/add episode_genre relations
        async function getEpisodeGenre(episodeId, genreId, pool) {
            const text = `
            SELECT episode_genre_id
            FROM episode_genre
            WHERE episodeId = $1 AND genreId = $2`;
            const values = [episodeId, genreId, pool];
            return pool.query(text, values);
        }


        async function addEpisodeGenre(episodeId, genreId, pool) {
            const text = `
        INSERT INTO episode_genre (episode_id, genre_id)
        VALUES ($1, $2)
        RETURNING episode_genre_id`;
            const values = [episodeId, genreId];
            return pool.query(text, values);
        }

        // Functions to get/add song_artist relations
        async function getSongArtist(songId, artistId, pool) {
            const text = `
        SELECT song_artist_id
        FROM song_artist
        WHERE song_id = $1 AND artist_id = $2;`;
            const values = [songId, artistId];
            return pool.query(text, values);
        }
        async function addSongArtist(songId, artistId, pool) {
            const text = `
        INSERT INTO song_artist (song_id, artist_id)
        VALUES ($1, $2)
        RETURNING song_artist_id`;
            const values = [songId, artistId];
            return pool.query(text, values);
        }

        // Functions to get/add setlist relations
        async function getSetlist(songArtistId, episodeId, setlistIndex, pool) {
            const text = `
        SELECT setlist_track_id
        FROM setlist
        WHERE song_artist_id = $1 AND episode_id = $2 AND setlist_seq = $3`;
            const values = [songArtistId, episodeId, setlistIndex];
            return pool.query(text, values);
        }
        async function addSetlist(songArtistId, episodeId, setlistIndex, pool) {
            const text = `
        INSERT INTO setlist (song_artist_id, episode_id, setlist_seq)
        VALUES ($1, $2, $3)
        RETURNING setlist_track_id`;
            const values = [songArtistId, episodeId, setlistIndex];
            return pool.query(text, values);
        }




        // RUN FUNCTIONS SECTION
        try {
            // Connect to PostgreSQL
            const pool = new Pool({
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
            });

            const episode = await scrapeHtmlData(url);

            var getEpisodeResult = await getEpisode(url, pool)

            if (getEpisodeResult.rows.length > 0) {
                // skip duplicate
            } else { // Add episode data to database
                const addEpisodeResult = await addEpisode(episode.name, episode.description, episode.updated, url, pool)
            }
            // Get the episode ID of the current episode (either existing in database or just added)
            var currentEpisodeId = await getEpisode(url, pool)
            var currentEpisodeId = currentEpisodeId.rows[0].episode_id

            // Loop through all genres in the episode and add to database
            for (const genre of episode.genres) {
                var getGenreResult = await getGenre(genre.value, pool)
                if (getGenreResult.rows.length > 0) {
                    // skip duplicates
                } else {
                    var addGenreResult = await addGenre(genre.value, genre.id, pool)
                }
                // Find the id of the current genre
                var currentGenreId = await getGenre(genre.value,pool)
                var currentGenreId = currentGenreId.rows[0].genre_id
                // Check if episode-genre relation already exists
                var getEpisodeGenreResult = await getEpisodeGenre(currentEpisodeId, currentGenreId, pool)
                if (getEpisodeGenreResult.rows.length > 0) {
                    // skip duplicate
                } else { // add new entry to link episode to genre
                    var addEpisodeGenreResult = await addEpisodeGenre(currentEpisodeId, currentGenreId, pool)
                }
            }

            // Loop through all tracks in the episode and add to database
            for (const [songIndex, song] of episode.tracklist.entries()) {
                // Check if song name already in database, and add if not
                var getSongResult = await getSong(song.title, pool)
                if (getSongResult.rows.length > 0) {
                    // skip duplicates
                } else {
                    var addSongResult = await addSong(song.title, pool)
                }

                // Check if artists for each song exist in database, and add if not
                for (const artist of song.mainArtists) {
                    var getArtistResult = await getArtist(artist.name, pool)
                    if (getArtistResult.rows.length > 0) {
                        // skip duplicates
                    } else {
                        var addArtistResult = await addArtist(artist.name, pool)
                    }

                    // Add link from song to artist
                    // Check song_id and artist_id of current song
                    var currentSongId = await getSong(song.title, pool)
                    var currentSongId = currentSongId.rows[0].song_id
                    var currentArtistId = await getArtist(artist.name, pool)
                    var currentArtistId = currentArtistId.rows[0].artist_id

                    // Check to make sure the relation is not already in the database
                    var getSongArtistResult = await getSongArtist(currentSongId, currentArtistId, pool)
                    if (getSongArtistResult.rows.length > 0) {
                        // skip duplicate
                    } else { // add to database
                        var addSongArtistResult = await addSongArtist(currentSongId, currentArtistId, pool)
                    }

                    // Check and add Setlist relations
                    // Check song_artist_id and episode_id of current song
                    var currentSongArtistId = await getSongArtist(currentSongId, currentArtistId, pool)
                    var currentSongArtistId = currentSongArtistId.rows[0].song_artist_id

                    // Check if track in setlist has already been added to database
                    var getSetlistResult = await getSetlist(currentSongArtistId, currentEpisodeId, songIndex, pool)

                    if (getSetlistResult.rows.length > 0) {
                        // skip duplicate
                    } else { // Add the track if not
                        var addSetlistResult = await addSetlist(currentSongArtistId, currentEpisodeId, songIndex, pool)
                    }
                }



            }





            await pool.end();
        }
        catch (err) {
            console.error(err)
        }


    }
}