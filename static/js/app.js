document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const address = document.getElementById('address').value;
    
    // Fetch the coordinates for the given address (you would use an API like Google Maps here)
    // For now, assume a dummy coordinate:
    const coords = { latitude: 40.7128, longitude: -74.0060 }; // Example for New York City
    
    // Fetch nearby recycling centers (dummy data here)
    const response = await fetch(`/api/search?latitude=${coords.latitude}&longitude=${coords.longitude}`);
    const centers = await response.json();
    
    // Display results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = centers.map(center => `
        <div>
            <h3>${center.name}</h3>
            <p>${center.address}</p>
            <p>Categories: ${center.categories}</p>
        </div>
    `).join('');
});
