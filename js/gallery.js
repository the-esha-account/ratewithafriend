import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadGallery() {
    const gallery = document.getElementById('gallery');
    
    try {
        console.log('Fetching ratings...');
        const { data: ratings, error } = await supabase
            .from('ratings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Ratings received:', ratings);

        if (ratings.length === 0) {
            console.log('No ratings found');
            gallery.innerHTML = '<p>No ratings yet! Go to Upload to add the first one.</p>';
            return;
        }

        gallery.innerHTML = '';

        ratings.forEach(data => {
            console.log('Processing rating:', data);
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
        console.error('Detailed error:', error);
        gallery.innerHTML = '<p>Error loading gallery. Please try again later.</p>';
    }
}

loadGallery();
