## Repository Contents

- [`app.py`](app.py) main application to run to host interactive webpage
- [`index.html`](templates/index.html) a template HTML to build webpage
- [`app.js`](static/js/app.js) javascript file to build interactive charts and dropdowns
- [`bonus.js`](static/js/bonus.js) javascript file containing function to build interactive gauge chart
- [`requirement.txt`](requirements.txt) requirement installation before running [`app.py`](app.py) and when pushing to Heroku


## Before Starting

Some modules you will need to run [`app.py`](app.py) are as follow:

- pip install pandas
- pip install flask
- pip install flask_sqlalchemy
- pip install sqlalchemy

Install requirements in the console
```
$ pip install -r requirements.txt
```


## Running Application

Run [app.py](app.py) on the console
```
$ python app.py
```
