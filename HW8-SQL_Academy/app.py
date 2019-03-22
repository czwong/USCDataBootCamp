import numpy as np
import pandas as pd
import datetime as dt

# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func

engine = create_engine("sqlite:///Resources/hawaii.sqlite", connect_args={'check_same_thread': False})

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

from flask import Flask, jsonify

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# API Route to home directory
@app.route("/")
def welcome():
    """List all available api routes"""
    return (
        f"Available Routes:<br/>"
        f"<br/>Return a JSON list of dates and precipition values.<br/>---------------------------<br/>/api/v1.0/precipitation<br/>---------------------------<br/>"
        f"<br/>Return a JSON list of stations from the dataset.<br/>---------------------<br/>/api/v1.0/stations<br/>---------------------<br/>"
        f"<br/>Return a JSON list of Temperature Observations (tobs) a year from the last data point.<br/>-----------------<br/>/api/v1.0/tobs<br/>-----------------<br/>"
        f"<br/>Return a JSON list of the minimum temperature, the average temperature, and the max temperature for all dates greater than and equal to the start date.<br/>Example API Endpoint: /api/v1.0/2014-05-13<br/>------------------------<br/>/api/v1.0/start_date<br/>------------------------<br/>"
        f"<br/>Return a JSON list of the minimum temperature, the average temperature, and the max temperature for dates between the start and end date inclusive.<br/>Example API Endpoint: /api/v1.0/2014-05-13/2014-05-20<br/>-----------------------------------<br/>/api/v1.0/start_date/end_date<br/>-----------------------------------<br/>"
    )

# API Route to find precipitation for all dates
@app.route("/api/v1.0/precipitation")
def precipitation():
    """List of dates and precipitation values"""
    results = session.query(Measurement.date, Measurement.prcp).all()
    
    result_list = []

    for result in results:
        prcp_dict = {result[0]:result[1]}
        result_list.append(prcp_dict
        )
    return jsonify(result_list)

# API Route to find all active stations
@app.route("/api/v1.0/stations")
def stations():
    """List of stations"""
    results = session.query(Station.station).all()

    stations = list(np.ravel(results))

    return(jsonify(stations))

# API Route to find observed temperature for last twelve months since date of last data point
@app.route("/api/v1.0/tobs")
def tobs():
    # Perform query to find date for last data point
    last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    last_date_list = last_date[0].split('-')
    last_year = int(last_date_list[0])
    last_month = int(last_date_list[1])
    last_day = int(last_date_list[2])

    # Calculate the date 1 year ago from the last data point in the database
    last_twelve_month = str(dt.date(last_year, last_month, last_day) - dt.timedelta(days = 365))

    last_twelve_month_list = last_twelve_month.split('-')
    last_twelve_year = last_twelve_month_list[0]
    last_twelve_month = last_twelve_month_list[1]
    last_twelve_day = last_twelve_month_list[2]

    # Perform a query to retrieve the data and precipitation scores
    last_twelve_months = session.query(Measurement.date, Measurement.tobs).\
        filter(Measurement.date > f'{last_twelve_year}-{last_twelve_month}-{last_twelve_day}').\
        order_by(Measurement.date).all()

    tobs_list = []
    for result in last_twelve_months:
        tob_dict = {result[0]:result[1]}
        tobs_list.append(tob_dict)

    return(jsonify(tobs_list))

# API Route to find tmin, tavg, and tmax from given start date to date of last data point
@app.route("/api/v1.0/<start_date>")
def start(start_date):
    """TMIN, TAVG, and TMAX for a list of dates.
    
    Args:
        start_date (string): A date string in the format %Y-%m-%d
        
    Returns:
        TMIN, TAVE, and TMAX
    """
    # Find TMIN, TAVG, and TMAX
    results = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
            filter(Measurement.date >= start_date).\
            all()

    # List of dates from start date to date of last data point
    dates = session.query(Measurement.date).\
            filter(Measurement.date >= start_date).\
            order_by(Measurement.date.asc()).\
            all()

    try:
        # Get start date and last date from results list
        start_day = dates[0][0]
        last_day = dates[-1][0]
        
        # Append results as dictionary into empty list
        temp_list = []
        for result in results:
            temp_dict = {
                        'start_date': start_day,
                        'end_date': last_day,
                        'tmin' : result[0], 
                        'tavg': result[1], 
                        'tmax': result[2]
                            }

            temp_list.append(temp_dict)

        return(jsonify(temp_list))

    except (IndexError, KeyError):
        return(jsonify({"error": f"Data from {start_date} could not be found."}), 404)

# API Route to find tmin, tavg, and tmax from given start date to end date
@app.route("/api/v1.0/<start_date>/<end_date>")
def start_end(start_date, end_date):
    """TMIN, TAVG, and TMAX for a list of dates.
    
    Args:
        start_date (string): A date string in the format %Y-%m-%d
        end_date (string): A date string in the format %Y-%m-%d
        
    Returns:
        TMIN, TAVE, and TMAX
    """
    # Find TMIN, TAVG, and TMAX
    results = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start_date).\
        filter(Measurement.date <= end_date).\
        all()

    # List of dates from start date to last date
    dates = session.query(Measurement.date).\
            filter(Measurement.date >= start_date).\
            filter(Measurement.date <= end_date).\
            order_by(Measurement.date.asc()).\
            all()

    try:
        # Get start date and last date from results list
        start_day = dates[0][0]
        last_day = dates[-1][0]
        
        # Append results as dictionary into empty list
        temp_list = []
        for result in results:
            temp_dict = {
                        'start_date': start_day,
                        'end_date': last_day,
                        'tmin' : result[0], 
                        'tavg': result[1], 
                        'tmax': result[2]
                            }

            temp_list.append(temp_dict)

        return(jsonify(temp_list))

    except (IndexError, KeyError):
        return(jsonify({"ERROR": f"Data from {start_date} to {end_date} could not be found."}), 404)

if __name__ == '__main__':
    app.run(debug=True)