import nts_scraper as scrape_nts
import sqlite3 as lite
from csv import reader

## specify database filename
## TODO: remove this hardcoded filename
sqlite_filename = 'crater-app.db'

## connect to SQLite database
con = None
# Error handling for connection status
try:
    con = lite.connect(sqlite_filename)
    cur = con.cursor()
    cur.execute('SELECT SQLITE_VERSION()')
    data = cur.fetchone()
except (lite.Error) as error:
    print("Error %s:" % e.args[0])
    sys.exit(1)
finally:
    if con:
        con.close()
con = lite.connect(sqlite_filename)

## read CSV containing URLs
## TODO: remove this hardcoded filename
urlfile = open("URL-list-full.csv")
read_urlfile = reader(urlfile)
url_list = list(read_urlfile)
urlfile.close()

## run scraper over multiple URLs
# check if setlist URL already exists in database
with con:
    cur = con.cursor()
    cur.execute(
        "SELECT Setlist_url FROM Setlist;")
    existing_urls = cur.fetchall()
# flatten list of urls that already exist in database
existing_urls_flat = []
for index, sublist in enumerate(existing_urls):
    item = sublist[0]
    existing_urls_flat.append(item)

for index, url in enumerate(url_list):
    scrape_url = url[0]
    if scrape_url in existing_urls_flat:
        print("Skipped " + scrape_url)
    else:
        scrape_nts(index, scrape_url, sqlite_filename)
        # wait before scraping next URL
        time_wait = 1  # wait time in seconds
        time.sleep(time_wait)
