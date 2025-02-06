import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

// Initialize Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadGallery() {
    const gallery = document.getElementById('gallery');
    
    try {
        console.log('Fetching ratings...');
        const { data: ratings, error } = await supabaseClient
            .from('ratings')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('Ratings:', ratings);

        if (error) throw error;

        if (!ratings || ratings.length === 0) {
            gallery.innerHTML = '<p>No ratings yet! Go to Upload to add the first one.</p>';
            return;
        }

        gallery.innerHTML = '';

        ratings.forEach(data => {
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
    } catch (error) {
        console.error('Error loading gallery:', error);
        gallery.innerHTML = '<p>Error loading gallery. Please try again later.</p>';
    }
}

loadGallery();
