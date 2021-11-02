#!/usr/bin/env node
// Queries to read/write music data from Postgresql database, used primarily in nts-scraper.js
// Author: Drew Nollsch, https://github.com/drex04

const fs = require('fs')
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();

async function getEpisode(url, pool) {
    const text = `
            SELECT episode_id
            FROM episode
            WHERE episode_url = $1`;
    const values = [url];
    return await pool.query(text, values);
}
async function addEpisode(episodeName, episodeDescription, episodeDate, episodeURL, pool) {
    const text = `
            INSERT INTO episode (episode_name, episode_description, episode_date, episode_url)
            VALUES ($1, $2, $3, $4)
            RETURNING episode_id`;
    const values = [episodeName, episodeDescription, episodeDate, episodeURL];
    return await pool.query(text, values);
}

async function addUniqueEpisode(episodeName, episodeDescription, episodeDate, episodeUrl, episodePlatform, pool) {
    const text = `
        WITH s AS (
                SELECT episode_id, episode_name, episode_description, episode_date, episode_url, episode_platform
                FROM episode
                WHERE episode_name = $1 AND episode_description = $2 AND episode_date = $3 AND episode_url = $4 AND episode_platform = $5),
            i AS (
                INSERT INTO episode (episode_name, episode_description, episode_date, episode_url, episode_platform)
                    SELECT $1, $2, $3, $4, $5
                    WHERE NOT EXISTS (SELECT 1 FROM s)
                    RETURNING episode_id, episode_name, episode_description, episode_date, episode_url, episode_platform)
        SELECT episode_id, episode_name, episode_description, episode_date, episode_url, episode_platform
        FROM i
        UNION ALL
        SELECT episode_id, episode_name, episode_description, episode_date, episode_url, episode_platform
        FROM s;`;
    const values = [episodeName, episodeDescription, episodeDate, episodeUrl, episodePlatform];
    return await pool.query(text, values);
}

async function upsertEpisode(episodeName, episodeDescription, episodeDate, episodeUrl, episodePlatform, pool) {
    const text = `
INSERT INTO episode (episode_name, episode_description, episode_date, episode_url, episode_platform)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (episode_url)
DO
    UPDATE SET episode_name = $1, episode_description = $2, episode_date = $3, episode_platform = $5
RETURNING episode_id, episode_name, episode_description, episode_date, episode_url, episode_platform;
`;
    const values = [episodeName, episodeDescription, episodeDate, episodeUrl, episodePlatform];
    return await pool.query(text, values);
}


// Functions to get/add songs
async function getSong(songName, pool) {
    const text = `
            SELECT song_id
            FROM song
            WHERE song_name = $1`;
    const values = [songName];
    return await pool.query(text, values);
}
async function addSong(songName, pool) {
    const text = `
            INSERT INTO song (song_name)
            VALUES ($1)
            RETURNING song_id`;
    const values = [songName];
    return await pool.query(text, values);
}
async function addUniqueSong(songName, pool) {
    const text = `
        WITH s AS (
                SELECT song_id, song_name
                FROM song
                WHERE song_name = $1),
            i AS (
                INSERT INTO song (song_name)
                    SELECT $1
                    WHERE NOT EXISTS (SELECT 1 FROM s)
                    RETURNING song_id, song_name)
        SELECT song_id, song_name
        FROM i
        UNION ALL
        SELECT song_id, song_name
        FROM s;`;
    const values = [songName];
    return await pool.query(text, values);;
}



// Functions to get/add artists
async function getArtist(artistName, pool) {
    const text = `
            SELECT artist_id
            FROM artist
            WHERE artist_name = $1`;
    const values = [artistName];
    return await pool.query(text, values);
}
async function addArtist(artistName, pool) {
    const text = `
            INSERT INTO artist (artist_name)
            VALUES ($1)
            RETURNING artist_id`;
    const values = [artistName];
    return await pool.query(text, values);
}
async function addUniqueArtist(artistName, pool) {
    const text = `
        WITH s AS (
                SELECT artist_id, artist_name
                FROM artist
                WHERE artist_name = $1),
            i AS (
                INSERT INTO artist (artist_name)
                    SELECT $1
                    WHERE NOT EXISTS (SELECT 1 FROM s)
                    RETURNING artist_id, artist_name)
        SELECT artist_id, artist_name
        FROM i
        UNION ALL
        SELECT artist_id, artist_name
        FROM s;`;
    const values = [artistName];
    return await pool.query(text, values);;
}



// Functions to get/add genres
async function getGenre(genreName, pool) {
    const text = `
            SELECT genre_id
            FROM genre
            WHERE genre_name = $1`;
    const values = [genreName];
    return await pool.query(text, values);
}
async function addGenre(genreName, genreParentStr, pool) {
    const text = `
            INSERT INTO genre (genre_name, genre_parent_string)
            VALUES ($1, $2)
            RETURNING genre_id`;
    const values = [genreName, genreParentStr];
    return await pool.query(text, values);
}
async function addUniqueGenre(genreName, pool) {
    const text = `
        WITH s AS (
                SELECT genre_id, genre_name
                FROM genre
                WHERE genre_name = $1),
            i AS (
                INSERT INTO genre (genre_name)
                    SELECT $1
                    WHERE NOT EXISTS (SELECT 1 FROM s)
                    RETURNING genre_id, genre_name)
        SELECT genre_id, genre_name
        FROM i
        UNION ALL
        SELECT genre_id, genre_name
        FROM s;`;
    const values = [genreName];
    return await pool.query(text, values);;
}



// Functions to get/add episode_genre relations
async function getEpisodeGenre(episodeId, genreId, pool) {
    const text = `
    SELECT episode_genre_id
    FROM episode_genre
    WHERE episode_id = $1 AND genre_id = $2`;
    const values = [episodeId, genreId];
    return await pool.query(text, values);
}
async function addEpisodeGenre(episodeId, genreId, pool) {
    const text = `
        INSERT INTO episode_genre (episode_id, genre_id)
        VALUES ($1, $2)
        RETURNING episode_genre_id`;
    const values = [episodeId, genreId];
    return await pool.query(text, values);
}
// Check if element exists, INSERT if not, and return either the ID of existing element or inserted element
async function addUniqueEpGenre(episodeId, genreId, pool) {
    const text = `
        WITH s AS (
                SELECT episode_genre_id, episode_id, genre_id
                FROM episode_genre
                WHERE episode_id = $1 AND genre_id = $2),
            i AS (
                INSERT INTO episode_genre (episode_id, genre_id)
                    SELECT $1, $2
                    WHERE NOT EXISTS (SELECT 1 FROM s)
                    RETURNING episode_genre_id, episode_id, genre_id)
        SELECT episode_genre_id, episode_id, genre_id
        FROM i
        UNION ALL
        SELECT episode_genre_id, episode_id, genre_id
        FROM s;`;
    const values = [episodeId, genreId];
    return await pool.query(text, values);;
}



// Functions to get/add song_artist relations
async function getSongArtist(songId, artistId, pool) {
    const text = `
        SELECT song_artist_id
        FROM song_artist
        WHERE song_id = $1 AND artist_id = $2;`;
    const values = [songId, artistId];
    return await pool.query(text, values);
}
async function addSongArtist(songId, artistId, pool) {
    const text = `
        INSERT INTO song_artist (song_id, artist_id)
        VALUES ($1, $2)
        RETURNING song_artist_id`;
    const values = [songId, artistId];
    return await pool.query(text, values);
}
async function addUniqueSongArtist(songId, artistId, pool) {
    const text = `
        WITH s AS (
                SELECT song_artist_id, song_id, artist_id
                FROM song_artist
                WHERE song_id = $1 AND artist_id = $2),
            i AS (
                INSERT INTO song_artist (song_id, artist_id)
                    SELECT $1, $2
                    WHERE NOT EXISTS (SELECT 1 FROM s)
                    RETURNING song_artist_id, song_id, artist_id)
        SELECT song_artist_id, song_id, artist_id
        FROM i
        UNION ALL
        SELECT song_artist_id, song_id, artist_id
        FROM s;`;
    const values = [songId, artistId];
    return await pool.query(text, values);;
}



// Functions to get/add setlist relations
async function getSetlist(songArtistId, episodeId, setlistIndex, pool) {
    const text = `
        SELECT setlist_track_id
        FROM setlist
        WHERE song_artist_id = $1 AND episode_id = $2 AND setlist_seq = $3`;
    const values = [songArtistId, episodeId, setlistIndex];
    return await pool.query(text, values);
}
async function addSetlist(songArtistId, episodeId, setlistIndex, pool) {
    const text = `
        INSERT INTO setlist (song_artist_id, episode_id, setlist_seq)
        VALUES ($1, $2, $3)
        RETURNING setlist_track_id`;
    const values = [songArtistId, episodeId, setlistIndex];
    return await pool.query(text, values);
}
async function addUniqueSetlist(songArtistId, episodeId, setlistIndex, pool) {
    const text = `
        WITH s AS (
                SELECT setlist_track_id, song_artist_id, episode_id, setlist_seq
                FROM setlist
                WHERE song_artist_id = $1 AND episode_id = $2 AND setlist_seq = $3),
            i AS (
                INSERT INTO setlist (song_artist_id, episode_id, setlist_seq)
                    SELECT $1, $2, $3
                    WHERE NOT EXISTS (SELECT 1 FROM s)
                    RETURNING setlist_track_id, song_artist_id, episode_id, setlist_seq)
        SELECT setlist_track_id, song_artist_id, episode_id, setlist_seq
        FROM i
        UNION ALL
        SELECT setlist_track_id, song_artist_id, episode_id, setlist_seq
        FROM s;`;
    const values = [songArtistId, episodeId, setlistIndex];
    return await pool.query(text, values);;
}



async function getDj(djName, pool) {
    const text = `
        SELECT dj_id
        FROM dj
        WHERE dj_name = $1`;
    const values = [djName];
    return await pool.query(text, values);
}
async function addDj(djName, pool) {
    const text = `
    INSERT INTO dj (dj_name)
    VALUES ($1)
    RETURNING dj_id`;
    const values = [djName];
    return await pool.query(text, values);
}
async function addUniqueDj(djName, pool) {
    const text = `
        WITH s AS (
                SELECT dj_id, dj_name
                FROM dj
                WHERE dj_name = $1),
            i AS (
                INSERT INTO dj (dj_name)
                    SELECT $1
                    WHERE NOT EXISTS (SELECT 1 FROM s)
                    RETURNING dj_id, dj_name)
        SELECT dj_id, dj_name
        FROM i
        UNION ALL
        SELECT dj_id, dj_name
        FROM s;`;
    const values = [djName];
    return await pool.query(text, values);;
}



async function getEpisodeDj(episodeId, djId, pool) {
    const text = `
    SELECT episode_dj_id
    FROM episode_dj
    WHERE episode_id = $1 AND dj_id = $2`;
    const values = [episodeId, djId];
    return await pool.query(text, values);
}
async function addEpisodeDj(episodeId, djId, pool) {
    const text = `
    INSERT INTO episode_dj (episode_id, dj_id)
    VALUES ($1, $2)
    `;
    const values = [episodeId, djId];
    return await pool.query(text, values);
}
async function addUniqueEpDj(episodeId, djId, pool) {
    const text = `
        WITH s AS (
                SELECT episode_dj_id, episode_id, dj_id
                FROM episode_dj
                WHERE episode_id = $1 AND dj_id = $2),
            i AS (
                INSERT INTO episode_dj (episode_id, dj_id)
                    SELECT $1, $2
                    WHERE NOT EXISTS (SELECT 1 FROM s)
                    RETURNING episode_dj_id, episode_id, dj_id)
        SELECT episode_dj_id, episode_id, dj_id
        FROM i
        UNION ALL
        SELECT episode_dj_id, episode_id, dj_id
        FROM s;`;
    const values = [episodeId, djId];
    return await pool.query(text, values);;
}



module.exports = {
    upsertEpisode: upsertEpisode,
    addUniqueSong: addUniqueSong,
    addUniqueArtist: addUniqueArtist,
    addUniqueGenre: addUniqueGenre,
    addUniqueEpGenre: addUniqueEpGenre,
    addUniqueSongArtist: addUniqueSongArtist,
    addUniqueSetlist: addUniqueSetlist,
    addUniqueDj: addUniqueDj,
    addUniqueEpDj: addUniqueEpDj
}