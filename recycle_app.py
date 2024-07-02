from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import sqlite3 
from models import RecyclingCenter

from geopy.distance import geodesic

# Create the SQLAlchemy db instance
db = SQLAlchemy()

def create_app():
    app = Flask(__name__, template_folder='templates')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./database/recycling_centers.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate = Migrate(app,db)
    return app

app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
    