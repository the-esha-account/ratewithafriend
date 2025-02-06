const GITHUB_REPO = 'the-esha-account/ratewithafriend';

async function loadGallery() {
    const gallery = document.getElementById('gallery');
    
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues?state=open`);
        const issues = await response.json();
        
        gallery.innerHTML = '';

        issues.forEach(issue => {
            try {
                const data = JSON.parse(issue.body);
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
            } catch (e) {
                console.error('Error parsing issue:', e);
            }
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
        gallery.innerHTML = '<p>Error loading gallery. Please try again later.</p>';
    }
}

loadGallery();
