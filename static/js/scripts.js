document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
    const map = L.map('map').setView([4.2105, 101.9758], 6); // Centered on Malaysia

    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Get the centers data from the HTML template
    const centersData = JSON.parse(document.getElementById('centers-data').textContent);

    // Function to add markers to the map
    function addMarkers(centers) {
        centers.forEach(center => {
            const marker = L.marker([center.latitude, center.longitude]).addTo(map);
            marker.bindPopup(`
                <strong>${center.center_name}</strong><br>
                ${center.address}<br>
                Categories: ${center.categories}<br>
                Phone: ${center.phone_number}<br>
                Hours: ${center.operating_hours}
            `);
        });
    }

    // Add initial markers
    addMarkers(centersData);

    // Filter functionality
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const stateSelect = document.getElementById('state');

    function filterCenters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value.toLowerCase();
        const selectedState = stateSelect.value.toLowerCase();

        const filteredCenters = centersData.filter(center => {
            const matchesSearch = center.center_name.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === "" || center.categories.toLowerCase().includes(selectedCategory);
            const matchesState = selectedState === "" || center.address.toLowerCase().includes(selectedState);

            return matchesSearch && matchesCategory && matchesState;
        });

        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add filtered markers
        addMarkers(filteredCenters);
    }

    // Attach event listeners to filter inputs
    searchInput.addEventListener('input', filterCenters);
    categorySelect.addEventListener('change', filterCenters);
    stateSelect.addEventListener('change', filterCenters);

    // Pagination handling
    function updatePagination(currentPage, totalPages) {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = ''; // Clear existing pagination

        const createButton = (page, text, disabled = false, active = false) => {
            const button = document.createElement('a');
            button.href = `?page=${page}`;
            button.className = 'page-link';
            button.textContent = text;
            const listItem = document.createElement('li');
            listItem.className = 'page-item';
            if (disabled) {
                listItem.classList.add('disabled');
            }
            if (active) {
                listItem.classList.add('active');
            }
            listItem.appendChild(button);
            return listItem;
        };

        // Previous button
        if (currentPage > 1) {
            paginationContainer.appendChild(createButton(currentPage - 1, 'Previous'));
        } else {
            paginationContainer.appendChild(createButton(currentPage - 1, 'Previous', true));
        }

        // Page numbers (showing a limited range around the current page)
        const maxPagesToShow = 10;  // Show 10 page links around the current page
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Adjust the startPage and endPage if they're out of bounds
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            paginationContainer.appendChild(createButton(1, '1'));
            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                paginationContainer.appendChild(dots);
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            const pageButton = createButton(page, page, false, page === currentPage);
            paginationContainer.appendChild(pageButton);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                paginationContainer.appendChild(dots);
            }
            paginationContainer.appendChild(createButton(totalPages, totalPages));
        }

        // Next button
        if (currentPage < totalPages) {
            paginationContainer.appendChild(createButton(currentPage + 1, 'Next'));
        } else {
            paginationContainer.appendChild(createButton(currentPage + 1, 'Next', true));
        }
    }

    // Get current page and total pages from HTML data
    const currentPage = parseInt(document.getElementById('current-page').textContent, 10);
    const totalPages = parseInt(document.getElementById('total-pages').textContent, 10);

    // Update pagination on page load
    updatePagination(currentPage, totalPages);
});
