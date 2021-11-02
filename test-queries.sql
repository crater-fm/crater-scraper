/* Show tracklist data by episode */
SELECT
    setlist.setlist_track_id,
    song.song_name,
    artist.artist_name,
	setlist.episode_id,
    episode.episode_name,
    setlist.setlist_seq
FROM
    setlist
INNER JOIN
    song_artist ON setlist.song_artist_id = song_artist.song_artist_id
INNER JOIN
    episode ON setlist.episode_id = episode.episode_id
INNER JOIN
    song ON song_artist.song_id = song.song_id
INNER JOIN
    artist ON song_artist.artist_id = artist.artist_id
ORDER BY setlist.episode_id, setlist.setlist_seq;

/* Show nearly everything in Setlist view */
SELECT
    setlist.setlist_track_id,
    song.song_name,
    artist.artist_name,
    setlist.setlist_seq,
    episode.episode_name,
    dj.dj_name,
    episode.episode_platform,
    episode.episode_description,
    episode.episode_url
FROM
    setlist
INNER JOIN
    song_artist ON setlist.song_artist_id = song_artist.song_artist_id
INNER JOIN
    episode ON setlist.episode_id = episode.episode_id
INNER JOIN
    episode_dj ON episode.episode_id = episode_dj.episode_id
INNER JOIN
    dj ON episode_dj.dj_id = dj.dj_id
INNER JOIN
    song ON song_artist.song_id = song.song_id
INNER JOIN
    artist ON song_artist.artist_id = artist.artist_id
ORDER BY setlist.episode_id, setlist.setlist_seq;

/* Show Genre data */
SELECT
	episode_genre.episode_genre_id,
	episode.episode_name,
	genre.genre_name
FROM episode_genre
INNER JOIN
	episode ON episode_genre.episode_id = episode.episode_id
INNER JOIN
	genre ON episode_genre.genre_id = genre.genre_id;