from recycle_app import db

# Define a model
class RecyclingCenter(db.Model):
    __tablename__ = 'Recycling Center'
    id = db.Column(db.Integer, primary_key=True)
    center_name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(300), nullable=False)
    categories = db.Column(db.String(300), nullable=False)
    phone_number = db.Column(db.String(20))
    operating_hours = db.Column(db.String(50))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)


    def __repr__(self):
        return "Completed"