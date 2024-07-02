from flask import render_template, request, jsonify
from recycle_app import app
from models import RecyclingCenter
from geopy.distance import geodesic

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