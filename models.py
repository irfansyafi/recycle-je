# models.py

from main import db

class RecyclingCenter(db.Model):
    __tablename__ = 'recycling_center'
    id = db.Column(db.Integer, primary_key=True)
    center_name = db.Column(db.String(255))
    address = db.Column(db.String(255))
    categories = db.Column(db.String(255))
    phone_number = db.Column(db.String(50))
    operating_hours = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    def as_dict(self):
        return {
            'id': self.id,
            'center_name': self.center_name,
            'address': self.address,
            'categories': self.categories,
            'phone_number': self.phone_number,
            'operating_hours': self.operating_hours,
            'latitude': self.latitude,
            'longitude': self.longitude
        }
