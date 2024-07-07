# routes.py
from flask import Flask, render_template
from models import RecyclingCenter
from main import db, app

@app.route('/')
def index():
    centers = RecyclingCenter.query.all()
    centers_dicts = [center.as_dict() for center in centers]
    return render_template('index.html', centers=centers_dicts)