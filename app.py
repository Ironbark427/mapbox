from flask import Flask, render_template, jsonify
import pandas as pd
import sqlite3

app = Flask(__name__)


@app.route('/')
@app.route('/home')
def index():
    return render_template('index.html')


@app.route('/years/')
def years():
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query('select distinct iyear from terror_data;', conn)
    return jsonify(list(df['iyear']))


@app.route("/position/<year>")
def position(year):
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query(
        f'select iyear, longitude, latitude, attacktype1_txt from terror_data WHERE iyear = (?);', conn, params=(year,))
    return df.to_json()


@app.route("/bubble/<year>")
def bubble(year):
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query(
        f'select iyear, country, country_txt from terror_data WHERE iyear = (?);', conn, params=(year,))
    return df.to_json()


if __name__ == '__main__':
    app.run(debug=True)
