from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from geopy.distance import geodesic



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = r'sqlite:///database/recycling_centers.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create the SQLAlchemy db instance

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Define a model
class RecyclingCenter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    center_name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(300), nullable=False)
    categories = db.Column(db.String(300), nullable=False)
    phone_number = db.Column(db.String(20))
    operating_hours = db.Column(db.String(50))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)


@app.route('/')
def index():
    centers = RecyclingCenter.query.all()
    return render_template('index.html', centers=centers)

@app.route('/api/search')
def search_centers():
    latitude = float(request.args.get('latitude'))
    longitude = float(request.args.get('longitude'))
    
    # Example: find centers within 10 km radius
    centers = RecyclingCenter.query.all()
    nearby_centers = []
    user_location = (latitude, longitude)
    
    for center in centers:
        center_location = (center.latitude, center.longitude)
        distance = geodesic(user_location, center_location).km
        if distance <= 10:  # Within 10 km
            nearby_centers.append({
                'name': center.name,
                'address': center.address,
                'categories': center.categories,
                'distance': distance
            })
    
    return jsonify(nearby_centers)



if __name__ == '__main__':
    app.run(debug=True)
    
    

    