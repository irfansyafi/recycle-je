# routes.py
from flask import render_template, request
from models import RecyclingCenter
from main import app

@app.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    per_page = 5
    centers_paginated = RecyclingCenter.query.paginate(page=page, per_page=per_page, error_out=False)
    total_pages = centers_paginated.pages
    centers = centers_paginated.items

    centers_dicts = [center.as_dict() for center in centers]
    return render_template('index.html', centers=centers_dicts, total_pages=total_pages, current_page=page)
