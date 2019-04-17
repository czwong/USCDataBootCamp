## Repository Contents

- [`mission_to_mars.ipynb`](Resources/mission_to_mars.ipynb) Jupyter Notebook file to complete all of scraping and analysis tasks
- [`scrape_mars.py`](scrape_mars.py) contains function to scrape websites
- [`app.py`](app.py) main file to run functions to output results as dictionary onto mongo and display as html
- [`index.html`](templates/index.html) a template HTML that will take the mars data dictionary and display all of the data in the appropriate HTML elements
- [`style.css`](static/css/style.css) a CSS file to format fonts and tables


## Before Starting

Change chromedriver path directory in `executable_path` in [`scrape_mars.py`](scrape_mars.py)
```
def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {'executable_path': 'Resources/chromedriver.exe'}
    return Browser('chrome', **executable_path, headless=False)
```

Some modules you will need to run [`app.py`](app.py) are PyMongo / bs4 

Installations are as follow:

- pip install PyMongo
- pip install bs4

 
## Application Procedure

### Step 1:

 - Run `mongod` in terminal

### Step 2:

 - Run [`app.py`](app.py)
```
$ python app.py
```
 

## Flask Final Product
![Screenshot](Images/Mars_Screenshot.png)

