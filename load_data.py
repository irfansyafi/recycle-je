from geopy.geocoders import Nominatim
import pandas as pd
from recycle_app import db, RecyclingCenter

# Initialize the geolocator
geolocator = Nominatim(user_agent="recycling_locator")

# Load data
df = pd.read_csv('malaysia_recycling_centers.csv')

# Geocode addresses
latitudes = []
longitudes = []

for address in df['Address']:
    location = geolocator.geocode(address)
    if location:
        latitudes.append(location.latitude)
        longitudes.append(location.longitude)
    else:
        latitudes.append(None)
        longitudes.append(None)

# Add latitude and longitude to the DataFrame
df['Latitude'] = latitudes
df['Longitude'] = longitudes

# Initialize the database (create tables if not exist)
db.create_all()

# Iterate over DataFrame rows and add them to the database
for _, row in df.iterrows():
    center = RecyclingCenter(
        center_name=row['Center Name'],
        address=row['Address'],
        categories=row['Categories'],
        phone_number=row['Phone Number'],
        operating_hours=row['Operating Hours'],
        latitude=row['Latitude'],
        longitude=row['Longitude']
    )
    db.session.add(center)

# Commit changes to the database
db.session.commit()
print("Data has been geocoded and loaded into the database.")
