const gallery = document.getElementById('gallery');

function loadGallery() {
    const entries = JSON.parse(localStorage.getItem('foodRatings') || '[]');
    
    gallery.innerHTML = ''; // Clear existing content

    entries.forEach(data => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <div class="gallery-header">${data.name}</div>
            <div class="gallery-location">${data.location}</div>
            <img class="food-image" src="${data.imageUrl}" alt="${data.name}">
            <div class="gallery-info">
                <img class="rating-image" src="images/${data.rating}.jpeg" alt="Rating: ${data.rating}">
                <div class="gallery-comment">${data.comment}</div>
            </div>
        `;
        gallery.appendChild(item);
    });
}

// Load gallery when page loads
loadGallery();
