# Dependencies
from splinter import Browser
from bs4 import BeautifulSoup
import bs4
import time
import requests
import pandas as pd


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {'executable_path': 'Resources/chromedriver.exe'}
    return Browser('chrome', **executable_path, headless=False)


def scrape():
    browser = init_browser()

    #### NASA Mars News ####
    url = 'https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest'
    browser.visit(url)

    time.sleep(1)

    # HTML object
    html = browser.html
    # Parse HTML with Beautiful Soup
    soup = BeautifulSoup(html, 'html.parser')

    # results are returned as an iterable list
    results = soup.find_all('li', class_="slide")

    # Loop through returned results
    for result in results[0]:
        # Error handling
        try:
            # Identify and return title of listing
            news_title = result.find('div', class_="bottom_gradient").text
            news_para = result.find('div', class_="rollover_description_inner").text

        except AttributeError as e:
            print(e)






    #### JPL Mars Space Images - Featured Image ####
    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url)

    # HTML object
    html = browser.html
    # Parse HTML with Beautiful Soup
    soup = BeautifulSoup(html, 'html.parser')

    featured_image_url = soup.find('a', class_='button fancybox')['data-fancybox-href']

    featured_image_url='https://www.jpl.nasa.gov'+featured_image_url






    #### Mars Weather ####
    url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(url)

    # HTML object
    html = browser.html
    # Parse HTML with Beautiful Soup
    soup = BeautifulSoup(html, 'html.parser')

    weather = soup.find_all('p', class_="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text")

    weather_list = []
    for i in weather:
        if "InSight sol" in i.text:
            weather_list.append(i)
            break


    text = []
    for x in weather_list[0]:
        if isinstance(x, bs4.element.NavigableString):
            text.append(x.strip())
    mars_weather=("".join(text))







    #### Mars Facts ####
    url = 'https://space-facts.com/mars/'

    tables = pd.read_html(url)
    tables

    df = tables[0]
    df.columns = ['','value']

    df.set_index('', inplace=True)

    # Export dataframe to html
    html_table = df.to_html()
    html_table.replace('\n', '')

    df.to_html('table.html')







    #### Mars Hemispheres ####
    main_url = "https://astrogeology.usgs.gov"
    img_url = ["https://astrogeology.usgs.gov/search/map/Mars/Viking/cerberus_enhanced","https://astrogeology.usgs.gov/search/map/Mars/Viking/schiaparelli_enhanced","https://astrogeology.usgs.gov/search/map/Mars/Viking/syrtis_major_enhanced","https://astrogeology.usgs.gov/search/map/Mars/Viking/valles_marineris_enhanced"]

    hemisphere_image_urls = []

    for url in img_url:
        browser.visit(url)
        # HTML object
        html = browser.html
        # Parse HTML with Beautiful Soup
        soup = BeautifulSoup(html, 'html.parser')
        
        image_url = soup.find('img', class_="wide-image")['src']
        
        img_title = soup.find('h2', class_="title").text.split(" ")
        
        img_title = " ".join(img_title[:-1])
        
        dict_ = {"title": img_title, "img_url": main_url + image_url}
        
        hemisphere_image_urls.append(dict_)


    # Close the browser after scraping
    browser.quit()

 
    mars_data = {
        "news_title": news_title,
        "news_para": news_para,
        "featured_image": featured_image_url,
        "weather": mars_weather,
        "hemisphere": hemisphere_image_urls
    }

    return mars_data