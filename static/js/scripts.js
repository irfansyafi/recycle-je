// scripts.js

// Initialize and add the Leaflet map
function initMap() {
    var map = L.map('map').setView([4.2105, 101.9758], 6); // Coordinates for Malaysia

    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // The data from the Flask view
    var centers = JSON.parse('{{ centers | tojson | safe }}');

    // Loop through the centers and place a marker for each
    centers.forEach(function(center) {
        var position = [center.latitude, center.longitude];
        var marker = L.marker(position).addTo(map)
            .bindPopup(`<h4>${center.center_name}</h4><p>${center.address}</p>`)
            .openPopup();
    });
}

// Filter centers based on input
function filterCenters() {
    var search = document.getElementById('search').value.toLowerCase();
    var category = document.getElementById('category').value.toLowerCase();
    var state = document.getElementById('state').value.toLowerCase();

    var centers = document.querySelectorAll('.center-card');
    centers.forEach(function(center) {
        var name = center.querySelector('h3').textContent.toLowerCase();
        var address = center.querySelector('p').textContent.toLowerCase();
        var categories = center.querySelectorAll('p')[1].textContent.toLowerCase();
        var visible = true;

        if (search && !name.includes(search) && !address.includes(search)) {
            visible = false;
        }

        if (category && !categories.includes(category)) {
            visible = false;
        }

        if (state && !address.includes(state)) {
            visible = false;
        }

        center.style.display = visible ? 'block' : 'none';
    });
}

// Event listeners for filters
document.getElementById('search').addEventListener('input', filterCenters);
document.getElementById('category').addEventListener('change', filterCenters);
document.getElementById('state').addEventListener('change', filterCenters);

// Call the initMap function to initialize the map
initMap();
