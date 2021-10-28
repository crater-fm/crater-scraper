--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 14.0

-- Started on 2021-10-28 17:39:57 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 16612)
-- Name: artist; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.artist (
    artist_id integer NOT NULL,
    artist_name text NOT NULL
);


ALTER TABLE public.artist OWNER TO admin;

--
-- TOC entry 202 (class 1259 OID 16610)
-- Name: artist_artist_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.artist_artist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.artist_artist_id_seq OWNER TO admin;

--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 202
-- Name: artist_artist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.artist_artist_id_seq OWNED BY public.artist.artist_id;


--
-- TOC entry 213 (class 1259 OID 16692)
-- Name: crater_users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.crater_users (
    user_id integer NOT NULL,
    user_email text NOT NULL,
    token text,
    password_digest text,
    created_at timestamp without time zone
);


ALTER TABLE public.crater_users OWNER TO admin;

--
-- TOC entry 212 (class 1259 OID 16690)
-- Name: crater_users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.crater_users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.crater_users_user_id_seq OWNER TO admin;

--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 212
-- Name: crater_users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.crater_users_user_id_seq OWNED BY public.crater_users.user_id;


--
-- TOC entry 219 (class 1259 OID 16766)
-- Name: dj; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.dj (
    dj_id integer NOT NULL,
    dj_name text NOT NULL,
    nts_artist_url text
);


ALTER TABLE public.dj OWNER TO admin;

--
-- TOC entry 218 (class 1259 OID 16764)
-- Name: dj_dj_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.dj_dj_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dj_dj_id_seq OWNER TO admin;

--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 218
-- Name: dj_dj_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.dj_dj_id_seq OWNED BY public.dj.dj_id;


--
-- TOC entry 205 (class 1259 OID 16623)
-- Name: episode; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.episode (
    episode_id integer NOT NULL,
    episode_name text NOT NULL,
    episode_description text,
    episode_date text,
    episode_url text NOT NULL,
    episode_platform text,
    episode_dj_id integer
);


ALTER TABLE public.episode OWNER TO admin;

--
-- TOC entry 221 (class 1259 OID 16777)
-- Name: episode_dj; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.episode_dj (
    episode_dj_id integer NOT NULL,
    dj_id integer NOT NULL,
    episode_id integer NOT NULL
);


ALTER TABLE public.episode_dj OWNER TO admin;

--
-- TOC entry 220 (class 1259 OID 16775)
-- Name: episode_dj_episode_dj_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.episode_dj_episode_dj_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.episode_dj_episode_dj_id_seq OWNER TO admin;

--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 220
-- Name: episode_dj_episode_dj_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.episode_dj_episode_dj_id_seq OWNED BY public.episode_dj.episode_dj_id;


--
-- TOC entry 204 (class 1259 OID 16621)
-- Name: episode_episode_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.episode_episode_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.episode_episode_id_seq OWNER TO admin;

--
-- TOC entry 3364 (class 0 OID 0)
-- Dependencies: 204
-- Name: episode_episode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.episode_episode_id_seq OWNED BY public.episode.episode_id;


--
-- TOC entry 217 (class 1259 OID 16746)
-- Name: episode_genre; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.episode_genre (
    episode_genre_id integer NOT NULL,
    episode_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.episode_genre OWNER TO admin;

--
-- TOC entry 216 (class 1259 OID 16744)
-- Name: episode_genre_episode_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.episode_genre_episode_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.episode_genre_episode_genre_id_seq OWNER TO admin;

--
-- TOC entry 3365 (class 0 OID 0)
-- Dependencies: 216
-- Name: episode_genre_episode_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.episode_genre_episode_genre_id_seq OWNED BY public.episode_genre.episode_genre_id;


--
-- TOC entry 214 (class 1259 OID 16724)
-- Name: genre; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.genre (
    genre_id integer NOT NULL,
    genre_name text NOT NULL,
    genre_parent_string text,
    parent_genre_id integer
);


ALTER TABLE public.genre OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 16727)
-- Name: genre_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.genre_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genre_genre_id_seq OWNER TO admin;

--
-- TOC entry 3366 (class 0 OID 0)
-- Dependencies: 215
-- Name: genre_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.genre_genre_id_seq OWNED BY public.genre.genre_id;


--
-- TOC entry 211 (class 1259 OID 16670)
-- Name: parent_genre; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.parent_genre (
    parent_genre_id integer NOT NULL,
    parent_genre_name text NOT NULL
);


ALTER TABLE public.parent_genre OWNER TO admin;

--
-- TOC entry 210 (class 1259 OID 16668)
-- Name: parent_genre_parent_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.parent_genre_parent_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parent_genre_parent_genre_id_seq OWNER TO admin;

--
-- TOC entry 3367 (class 0 OID 0)
-- Dependencies: 210
-- Name: parent_genre_parent_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.parent_genre_parent_genre_id_seq OWNED BY public.parent_genre.parent_genre_id;


--
-- TOC entry 209 (class 1259 OID 16652)
-- Name: setlist; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.setlist (
    setlist_track_id integer NOT NULL,
    song_artist_id integer NOT NULL,
    episode_id integer NOT NULL,
    setlist_seq integer NOT NULL
);


ALTER TABLE public.setlist OWNER TO admin;

--
-- TOC entry 208 (class 1259 OID 16650)
-- Name: setlist_setlist_track_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.setlist_setlist_track_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.setlist_setlist_track_id_seq OWNER TO admin;

--
-- TOC entry 3368 (class 0 OID 0)
-- Dependencies: 208
-- Name: setlist_setlist_track_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.setlist_setlist_track_id_seq OWNED BY public.setlist.setlist_track_id;


--
-- TOC entry 201 (class 1259 OID 16601)
-- Name: song; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.song (
    song_id integer NOT NULL,
    song_name text NOT NULL
);


ALTER TABLE public.song OWNER TO admin;

--
-- TOC entry 207 (class 1259 OID 16634)
-- Name: song_artist; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.song_artist (
    song_artist_id integer NOT NULL,
    song_id integer NOT NULL,
    artist_id integer NOT NULL
);


ALTER TABLE public.song_artist OWNER TO admin;

--
-- TOC entry 206 (class 1259 OID 16632)
-- Name: song_artist_song_artist_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.song_artist_song_artist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.song_artist_song_artist_id_seq OWNER TO admin;

--
-- TOC entry 3369 (class 0 OID 0)
-- Dependencies: 206
-- Name: song_artist_song_artist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.song_artist_song_artist_id_seq OWNED BY public.song_artist.song_artist_id;


--
-- TOC entry 200 (class 1259 OID 16599)
-- Name: song_song_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.song_song_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.song_song_id_seq OWNER TO admin;

--
-- TOC entry 3370 (class 0 OID 0)
-- Dependencies: 200
-- Name: song_song_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.song_song_id_seq OWNED BY public.song.song_id;


--
-- TOC entry 3183 (class 2604 OID 16615)
-- Name: artist artist_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.artist ALTER COLUMN artist_id SET DEFAULT nextval('public.artist_artist_id_seq'::regclass);


--
-- TOC entry 3188 (class 2604 OID 16695)
-- Name: crater_users user_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.crater_users ALTER COLUMN user_id SET DEFAULT nextval('public.crater_users_user_id_seq'::regclass);


--
-- TOC entry 3191 (class 2604 OID 16769)
-- Name: dj dj_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.dj ALTER COLUMN dj_id SET DEFAULT nextval('public.dj_dj_id_seq'::regclass);


--
-- TOC entry 3184 (class 2604 OID 16626)
-- Name: episode episode_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode ALTER COLUMN episode_id SET DEFAULT nextval('public.episode_episode_id_seq'::regclass);


--
-- TOC entry 3192 (class 2604 OID 16780)
-- Name: episode_dj episode_dj_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode_dj ALTER COLUMN episode_dj_id SET DEFAULT nextval('public.episode_dj_episode_dj_id_seq'::regclass);


--
-- TOC entry 3190 (class 2604 OID 16749)
-- Name: episode_genre episode_genre_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode_genre ALTER COLUMN episode_genre_id SET DEFAULT nextval('public.episode_genre_episode_genre_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 16729)
-- Name: genre genre_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.genre ALTER COLUMN genre_id SET DEFAULT nextval('public.genre_genre_id_seq'::regclass);


--
-- TOC entry 3187 (class 2604 OID 16673)
-- Name: parent_genre parent_genre_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.parent_genre ALTER COLUMN parent_genre_id SET DEFAULT nextval('public.parent_genre_parent_genre_id_seq'::regclass);


--
-- TOC entry 3186 (class 2604 OID 16655)
-- Name: setlist setlist_track_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.setlist ALTER COLUMN setlist_track_id SET DEFAULT nextval('public.setlist_setlist_track_id_seq'::regclass);


--
-- TOC entry 3182 (class 2604 OID 16604)
-- Name: song song_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.song ALTER COLUMN song_id SET DEFAULT nextval('public.song_song_id_seq'::regclass);


--
-- TOC entry 3185 (class 2604 OID 16637)
-- Name: song_artist song_artist_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.song_artist ALTER COLUMN song_artist_id SET DEFAULT nextval('public.song_artist_song_artist_id_seq'::regclass);


--
-- TOC entry 3196 (class 2606 OID 16620)
-- Name: artist artist_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.artist
    ADD CONSTRAINT artist_pkey PRIMARY KEY (artist_id);


--
-- TOC entry 3206 (class 2606 OID 16700)
-- Name: crater_users crater_users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.crater_users
    ADD CONSTRAINT crater_users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3212 (class 2606 OID 16774)
-- Name: dj dj_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.dj
    ADD CONSTRAINT dj_pkey PRIMARY KEY (dj_id);


--
-- TOC entry 3214 (class 2606 OID 16782)
-- Name: episode_dj episode_dj_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode_dj
    ADD CONSTRAINT episode_dj_pkey PRIMARY KEY (episode_dj_id);


--
-- TOC entry 3210 (class 2606 OID 16751)
-- Name: episode_genre episode_genre_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode_genre
    ADD CONSTRAINT episode_genre_pkey PRIMARY KEY (episode_genre_id);


--
-- TOC entry 3198 (class 2606 OID 16631)
-- Name: episode episode_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode
    ADD CONSTRAINT episode_pkey PRIMARY KEY (episode_id);


--
-- TOC entry 3208 (class 2606 OID 16731)
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (genre_id);


--
-- TOC entry 3204 (class 2606 OID 16678)
-- Name: parent_genre parent_genre_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.parent_genre
    ADD CONSTRAINT parent_genre_pkey PRIMARY KEY (parent_genre_id);


--
-- TOC entry 3202 (class 2606 OID 16657)
-- Name: setlist setlist_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.setlist
    ADD CONSTRAINT setlist_pkey PRIMARY KEY (setlist_track_id);


--
-- TOC entry 3200 (class 2606 OID 16639)
-- Name: song_artist song_artist_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.song_artist
    ADD CONSTRAINT song_artist_pkey PRIMARY KEY (song_artist_id);


--
-- TOC entry 3194 (class 2606 OID 16609)
-- Name: song song_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.song
    ADD CONSTRAINT song_pkey PRIMARY KEY (song_id);


--
-- TOC entry 3223 (class 2606 OID 16783)
-- Name: episode_dj episode_dj_dj_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode_dj
    ADD CONSTRAINT episode_dj_dj_id_fkey FOREIGN KEY (dj_id) REFERENCES public.dj(dj_id);


--
-- TOC entry 3224 (class 2606 OID 16788)
-- Name: episode_dj episode_dj_episode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode_dj
    ADD CONSTRAINT episode_dj_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES public.episode(episode_id);


--
-- TOC entry 3221 (class 2606 OID 16752)
-- Name: episode_genre episode_genre_episode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode_genre
    ADD CONSTRAINT episode_genre_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES public.episode(episode_id);


--
-- TOC entry 3222 (class 2606 OID 16757)
-- Name: episode_genre episode_genre_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode_genre
    ADD CONSTRAINT episode_genre_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genre(genre_id);


--
-- TOC entry 3215 (class 2606 OID 16793)
-- Name: episode fk_episode_dj; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.episode
    ADD CONSTRAINT fk_episode_dj FOREIGN KEY (episode_dj_id) REFERENCES public.episode_dj(episode_dj_id);


--
-- TOC entry 3220 (class 2606 OID 16739)
-- Name: genre fk_genre_parent; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT fk_genre_parent FOREIGN KEY (parent_genre_id) REFERENCES public.parent_genre(parent_genre_id);


--
-- TOC entry 3219 (class 2606 OID 16663)
-- Name: setlist setlist_episode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.setlist
    ADD CONSTRAINT setlist_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES public.episode(episode_id);


--
-- TOC entry 3218 (class 2606 OID 16658)
-- Name: setlist setlist_song_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.setlist
    ADD CONSTRAINT setlist_song_artist_id_fkey FOREIGN KEY (song_artist_id) REFERENCES public.song_artist(song_artist_id);


--
-- TOC entry 3217 (class 2606 OID 16645)
-- Name: song_artist song_artist_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.song_artist
    ADD CONSTRAINT song_artist_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artist(artist_id);


--
-- TOC entry 3216 (class 2606 OID 16640)
-- Name: song_artist song_artist_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.song_artist
    ADD CONSTRAINT song_artist_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.song(song_id);


-- Completed on 2021-10-28 17:39:57 CEST

--
-- PostgreSQL database dump complete
--

