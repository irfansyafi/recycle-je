document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map
    var map = L.map('map').setView([4.2105, 101.9758], 7); // Centered on Malaysia

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Check if the centers variable is defined and is an array
    if (Array.isArray(centers)) {
        // Add markers for each recycling center
        centers.forEach(function(center) {
            if (center.latitude && center.longitude) {
                L.marker([center.latitude, center.longitude])
                    .addTo(map)
                    .bindPopup(`<b>${center.center_name}</b><br>${center.address}`);
            }
        });
    } else {
        console.error("Centers data is not available or not in expected format.");
    }
});
