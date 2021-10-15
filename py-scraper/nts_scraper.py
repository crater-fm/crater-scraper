# Web scraper for NTS Radio using BeautifulSoup2 for Python
# following this tutorial:
# https: // www.youtube.com/watch?v = XVv6mJpFOb0

import sys
import sqlite3 as lite
import time
import requests
from bs4 import BeautifulSoup


def scrape_nts(index, url, sqlite_filename):

    # read HTML from URL
    html_text = requests.get(url).text

    soup = BeautifulSoup(html_text, 'lxml')

    # find platform
    for tag in soup.find_all("meta"):
        if tag.get("name", None) == "author":
            platform = tag.get("content", None)
            print("Platform:", platform)

    # find setlist name
    setlist_name = soup.find("title").text
    print("Setlist name:", setlist_name)

    # TODO: find setlist date

    # TODO: find setlist genres

    # TODO: find DJ name

    # find all tracks
    track_tags = soup.find_all('li', class_="track")

    # scrape track info for each track
    for index, track in enumerate(track_tags):
        # track number
        track_number = index

        # scrape track name
        for item in track.select("span.track__title"):
            track_name = item.get_text(strip=True)

        # scrape artists
        track_artists = track.find_all('a')
        for item in track_artists:
            artist_name = None # set default behavior if no artist name
            artist_name_raw = item.text
            # strip leading and trailing whitespace
            artist_name_stripped = artist_name_raw.strip()
            # remove trailing comma if exists
            if artist_name_stripped[-1] == ',':
                artist_name = artist_name_stripped[:-1]
            else:
                artist_name = artist_name_stripped

            # add artist info to SQLite Artists table
            with con:
                cur = con.cursor()
                cur.execute(
                    "INSERT INTO Artist (Artist_id, Artist_Name) VALUES (NULL, ?)", (artist_name,))
            # store track and artist info in SQLite Track table
            with con:
                cur = con.cursor()
                #if artist_name is None:
                cur.execute(
                    "INSERT INTO Track (Track_id, Track_Name, Artist_Name) VALUES (NULL, ?, ?)", (track_name,artist_name))
            # insert setlist info, track name, and track number into Setlist table
            with con:
                cur = con.cursor()
                cur.execute(
                "INSERT INTO Setlist (Setlist_id, Setlist_url, Setlist_Name, Platform_Name, Track_Number, Track_Name, Artist_Name) VALUES (NULL, ?, ?, ?, ?, ?, ?)", (url, setlist_name, platform, track_number, track_name, artist_name))