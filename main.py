# main.py
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)

# Configuring the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recycling_centers.db'  # Adjust path if needed
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initializing the database and migration objects
db = SQLAlchemy(app)
migrate = Migrate(app, db)

import routes  # This will register the routes

if __name__ == '__main__':
    
    app.run(debug=True)