# -*- coding: utf-8 -*-
"""
Created on Tue Oct 26 13:58:26 2021

@author: Travis Metzger
         https://github.com/An-Emu
         
Scrapes Artist Page URLS and show URLS for each artist from https://www.nts.live
"""
import csv
import requests
from bs4 import BeautifulSoup
import json

''' INPUTS '''
residents_save_file = 'nts_resident_pages.csv'
shows_save_file = 'nts_all_shows.csv'

nts_home_page = "https://www.nts.live"
residents_page_stub = "/shows/page/pgnum?ajax=true"
resident_page_class = "grid-item nts-app"

api_stub = '/api/v2'
shows_page_stub = '/episodes?offset=firstitem&limit=12'

''' Setup '''
class Artist:
    def __init__(self, name, page_url):
        self.artist_name = name
        self.page_url = page_url
        self.show_urls = []

artists = []

''' RUN SCRAPER '''
#Create Output File
with open(residents_save_file, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Artist','Page URL'])    
    
    
    #Loop over infinitely scrolling residents page
    resident_page_tags = 'placeholder'
    ii=0
    # TODO: avoid while loop
    while resident_page_tags:
        ii += 1
        # print('Page #'+str(ii))
        this_page = nts_home_page + residents_page_stub.replace("pgnum",
                                                                str(ii))
        content = requests.get(this_page)    
        
        soup = BeautifulSoup(content.text,'lxml')
        resident_page_tags = soup.find_all(class_=resident_page_class)
        #Get artist names and links on page
        for artist in resident_page_tags:
            artist_name = artist.find('h3')
            artist_name = artist_name.get_text().strip()
            artist_page = nts_home_page+artist.get('href')
            artists.append(Artist(artist_name,artist_page))
            writer.writerow([artist_name,artist_page])

#Create Output File            
with open(shows_save_file, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Artist','Show URL'])  
    for artist in artists:
        # print(artist.artist_name)
        ii = -12
        show_json = 'placeholder'
        # TODO: avoid while loop
        while show_json:
            ii += 12
            # print(ii)
            this_page =  artist.page_url.replace(nts_home_page,
                                                  nts_home_page+api_stub) + \
                            shows_page_stub.replace('firstitem', str(ii))
            content = requests.get(this_page)
            # TODO: BeautifulSoup may be unnecessary for json parsing            
            soup = BeautifulSoup(content.text,'html.parser')
            artist_json = json.loads(soup.text)
            try:
                show_json = [d.get('links') for d in artist_json['results'] if d.get('links')]
            except:
                show_json = []
                print('Invalid request, skipping')
            for show in show_json:
                # TODO: Add better way to get 'self' element instead of calling show[0]
                show_link = show[0].get('href').replace(nts_home_page+api_stub,nts_home_page)
                # print(show_link)
                artist.show_urls.append(show_link)
                writer.writerow([artist.artist_name,show_link])
        
        
        
