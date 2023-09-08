from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from datetime import date
import sqlite3
import sys


# initialize flask app, cors
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# initialize table
SPEND_TABLE = "user_spending"
INCOME_TABLE = "user_income"
DATABASE = "spending.db"

def create_table(delOnStart=False):
    """
    Creates a sqlite table if it doesn't exist.
    """

    # drop table if it exists
    if delOnStart:
        delete_table()

    # create new table
    con = sqlite3.connect(DATABASE)
    spend_query = f"CREATE TABLE if not exists {SPEND_TABLE} (\
            spendDate DATE, \
            amount REAL, \
            type TEXT, \
            notes TEXT, \
            addDate DATE)"
    con.execute(spend_query)

    income_query = f"CREATE TABLE if not exists {INCOME_TABLE} (\
        month TEXT, \
        year TEXT, \
        income REAL, \
        addDate DATE)"
    con.execute(income_query)
    app.logger.info("database created")

    con.close()


def delete_table():
    """
    Drops table.
    """
    con = sqlite3.connect(DATABASE)
    spend_drop_query = f"DROP TABLE IF EXISTS {SPEND_TABLE}"
    income_drop_query = f"DROP TABLE IF EXISTS {INCOME_TABLE}"
    con.execute(spend_drop_query)
    con.execute(income_drop_query)
    app.logger.info("dropped existing tables")
    con.close()


def view_tables():
    q1 = f"SELECT * FROM {SPEND_TABLE}"
    q2 = f"SELECT * FROM {INCOME_TABLE}"
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    
    cur.execute(q1)
    rv = cur.fetchall()
    print(f"Spending\n",rv)
    
    cur.execute(q2)
    rv = cur.fetchall()
    print("Income\n", rv)
    con.close()


# FLASK ENDPOINTS

@app.route('/profile')
def my_profile():
    """
    GET request to display basic spend info to the user
    """
    today = date.today()
    month = today.strftime("%m")
    Month = today.strftime("%B")
    year = today.strftime("%Y")

    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    
    spend = f"""SELECT type, SUM(amount)
            FROM {SPEND_TABLE}
            WHERE spendDate BETWEEN '{year}-{month}-01' AND '{year}-{month}-31'
            GROUP BY type"""
    income = f"""SELECT SUM(income)
            FROM {INCOME_TABLE}
            WHERE month LIKE '%{Month}%' AND year LIKE '%{year}%'"""

    spendData = "error"
    incomeData = "error"
    try:
        cur.execute(spend)
        spendData = cur.fetchall()
    except sqlite3.Error as e:
        print(e)
        app.logger.error("Could not retrieve spending data.")
    
    try:
        cur.execute(income)
        incomeData = cur.fetchall()
    except sqlite3.Error as e:
        print(e)
        app.logger.error("Could not retrieve income data.")

    spendData = dict(spendData)
    spendData['Total'] = sum(spendData.values())
    print(spendData, incomeData)
    response = {
        "code": 200,
        "spend": spendData,
        "income": incomeData[0]
    }

    return jsonify(response)


@app.route('/home')
def home():
    message = "success"
    return jsonify(message), 200


@app.route('/add-spending', methods=['POST'])
def add_spend():
    """
    POST request so that the user can upload their spending data
    """

    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    # get data sent from frontend
    data = request.json
    today = date.today()
    today = today.strftime("%Y-%m-%d")

    # transform data into a list of tuples so we can call executemany() 
    entries = [(entry['date'], entry['amount'], entry['type'], entry['notes'], today) for entry in data]
    q = f"INSERT INTO {SPEND_TABLE} (spendDate, amount, type, notes, addDate) VALUES(?, ?, ?, ?, ?)"
    try:
        cur.executemany(q, entries)
        print("Success, inserted spending")
        message = "success"
        code = 200
    except sqlite3.Error as e:
        print("Could not insert data into DB")
        print(e)
        message = "Could not insert data"
        code = 400

    con.commit()
    con.close()
    
    return jsonify(message), code


@app.route('/add-income', methods=['POST'])
def income():
    """
    Endpoint that handles POST requests to update income information.
    """
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    data = request.json
    today = date.today()
    today = today.strftime("%Y-%m-%d")
    
    entries = [(entry['month'], entry['year'], entry['income'], today) for entry in data]
    q = f"INSERT INTO {INCOME_TABLE} (month, year, income, addDate) VALUES(?, ?, ?, ?)"
    try:
        cur.executemany(q, entries)
        print("Success, inserted income")
        message = "success"
        code = 200
    except sqlite3.Error as e:
        print("Could not insert data into DB")
        print(e)
        message = "Could not insert data"
        code = 400
    con.commit()
    con.close()
    return jsonify(message), code

# @app.after_request
# def after_request(response):
#     app.logger.info('hi')
#     response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] 
#     response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
#     response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
#     return response
# Running app


if __name__ == '__main__':
    app.run(debug=True)
    # initialize table if it doesn't exist
    create_table()
    view_tables()