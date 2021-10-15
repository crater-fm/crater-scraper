##import nts_scraper as scrape_nts
import psycopg2
from csv import reader
from decouple import config

# Set environmental variables
DB_HOST = config('DB_HOST')
DB_NAME = config('DB_NAME')
DB_USER = config('DB_USER')
DB_PASSWORD = config('DB_PASSWORD')

## Connect to PostgreSQL database
conn = psychopg2.connect(
    host = DB_HOST,
    database = DB_NAME,
    user = DB_USER,
    password = DB_PASSWORD)



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
        
