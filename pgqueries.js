const fs = require('fs')
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();


// Functions to check if episode, artist, song, genre already exist in the database
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

module.exports = {
    getEpisode: getEpisode,
    addEpisode: addEpisode,
    getSong: getSong,
    addSong: addSong,
    getArtist: getArtist,
    addArtist: addArtist,
    getGenre: getGenre,
    addGenre: addGenre,
    getEpisodeGenre: getEpisodeGenre,
    addEpisodeGenre: addEpisodeGenre,
    getSongArtist: getSongArtist,
    addSongArtist: addSongArtist,
    getSetlist: getSetlist,
    addSetlist: addSetlist
}