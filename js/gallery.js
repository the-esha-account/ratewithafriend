const gallery = document.getElementById('gallery');

function loadGallery() {
    const entries = JSON.parse(localStorage.getItem('foodRatings') || '[]');
    
    console.log('Loading entries:', entries); // Debug line

    if (entries.length === 0) {
        gallery.innerHTML = '<p>No entries yet!</p>';
        return;
    }
    
    gallery.innerHTML = ''; // Clear existing content

    entries.forEach(data => {
        console.log('Processing entry:', data); // Debug line
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <div class="gallery-header">${data.name}</div>
            <div class="gallery-location">${data.location}</div>
            <img class="food-image" src="${data.imageUrl}" alt="${data.name}">
            <div class="gallery-info">
                <img class="rating-image" src="${data.rating}.jpeg" alt="Rating: ${data.rating}">
                <div class="gallery-comment">${data.comment}</div>
            </div>
        `;
        gallery.appendChild(item);
    });
}

// Load gallery when page loads
loadGallery();
