from geopy.geocoders import Nominatim
from geopy.exc import GeocoderServiceError, GeocoderTimedOut
import pandas as pd
from main import app, db, RecyclingCenter  # Adjust the import according to your app structure
import time
import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# Initialize the geolocator with a user agent and a timeout
geolocator = Nominatim(user_agent="recycling_locator", timeout=10)

# Load data from CSV
df = pd.read_csv('scrape_data/malaysia_recycling_centers.csv')

# Initialize lists to store geocoded data
latitudes = []
longitudes = []

# Define a function to geocode an address with retries
def geocode_address(address, retries=3):
    for _ in range(retries):
        try:
            location = geolocator.geocode(address)
            if location:
                return location.latitude, location.longitude
        except (GeocoderTimedOut, GeocoderServiceError) as e:
            print(f"Error geocoding '{address}': {e}. Retrying...")
            time.sleep(2)  # Wait before retrying
    print(f"Failed to geocode '{address}' after {retries} attempts.")
    return None, None

# Optional: Use parallel processing to speed up geocoding
def parallel_geocode(addresses, max_workers=10):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(geocode_address, address): address for address in addresses}
        results = []
        for future in as_completed(futures):
            address = futures[future]
            try:
                lat, lon = future.result()
                results.append((lat, lon))
            except Exception as e:
                print(f"Error geocoding '{address}': {e}")
                results.append((None, None))
            print(f"Completed {len(results)}/{len(addresses)}: {address}")
        return results

# Geocode addresses
geocoded_results = parallel_geocode(df['Address'])

# Add latitude and longitude to the DataFrame
latitudes, longitudes = zip(*geocoded_results)
df['Latitude'] = latitudes
df['Longitude'] = longitudes

# Save the geocoded DataFrame to a new CSV
df.to_csv("scrape_data/malaysia_recycling_centers_latlon.csv", index=False)
print("Geocoding completed and saved to 'scrape_data/malaysia_recycling_centers_latlon.csv'.")

# Initialize the database and create tables if they do not exist
with app.app_context():
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
    print("Data has been loaded into the database.")
