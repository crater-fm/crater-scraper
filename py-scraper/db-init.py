## specify database filename
sqlite_filename = 'crater-app-v2.db'
## TODO: remove this hardcoded filename

## connect to SQLite database
con = None
# Error handling for connection status
try:
    con = lite.connect(sqlite_filename)
    cur = con.cursor()
    cur.execute('SELECT SQLITE_VERSION()')
    data = cur.fetchone()
    print("SQLite version: %s" % data)
except (lite.Error) as error:
    print("Error %s:" % e.args[0])
    sys.exit(1)
finally:
    if con:
        con.close()
con = lite.connect(sqlite_filename)

## create database tables
setlist_table = """CREATE TABLE IF NOT EXISTS Setlist(Setlist_id INTEGER PRIMARY KEY, Setlist_url TEXT, Setlist_Name TEXT, Setlist_Date TEXT, Platform_Name TEXT, Track_Number INTEGER, Track_Name TEXT, Artist_Name TEXT);"""
track_table = """CREATE TABLE IF NOT EXISTS Track(Track_id INTEGER PRIMARY KEY, Track_Name TEXT, Artist_name TEXT);"""
artist_table = """CREATE TABLE IF NOT EXISTS Artist(Artist_id INTEGER PRIMARY KEY, Artist_Name TEXT);"""
dj_table = """CREATE TABLE IF NOT EXISTS DJ(DJ_id INTEGER PRIMARY KEY, DJ_Name TEXT);"""
platform_table = """CREATE TABLE IF NOT EXISTS Platform(Platform_id INTEGER PRIMARY KEY, Platform_Name TEXT);"""
genre_table = """CREATE TABLE IF NOT EXISTS Genre(Genre_id INTEGER PRIMARY KEY, Genre_Name TEXT);"""


with con:
    cur = con.cursor()
    cur.execute(setlist_table)
    con.commit()
with con:
    cur = con.cursor()
    cur.execute(track_table)
    con.commit()
with con:
    cur = con.cursor()
    cur.execute(artist_table)
    con.commit()
with con:
    cur = con.cursor()
    cur.execute(dj_table)
    con.commit()
with con:
    cur = con.cursor()
    cur.execute(platform_table)
    con.commit()
with con:
    cur = con.cursor()
    cur.execute(genre_table)
    con.commit()
