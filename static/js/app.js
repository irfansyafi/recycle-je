// scripts.js

// Initialize and add the map
function initMap() {
    // The location of Malaysia
    var malaysia = { lat: 4.2105, lng: 101.9758 };
    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 6,
        center: malaysia
    });

    // The data from the Flask view
    var centers = JSON.parse('{{ centers | tojson | safe }}');

    // Loop through the centers and place a marker for each
    centers.forEach(function(center) {
        var position = { lat: center.latitude, lng: center.longitude };
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: center.center_name
        });

        var infowindow = new google.maps.InfoWindow({
            content: `<h4>${center.center_name}</h4><p>${center.address}</p>`
        });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
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
