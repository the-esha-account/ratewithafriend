import { SUPABASE_URL, SUPABASE_KEY, IMGUR_CLIENT_ID } from './config.js';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const ratingOptions = document.querySelectorAll('.rating-option');
let selectedRating = null;

// Preview image
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Handle rating selection
ratingOptions.forEach(option => {
    option.addEventListener('click', () => {
        ratingOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedRating = option.dataset.rating;
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedRating) {
        alert('Please select a rating');
        return;
    }

    const file = fileInput.files[0];
    if (!file) {
        alert('Please select an image');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('image', file);

        const imgurResponse = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
            },
            body: formData
        });

        const imgurData = await imgurResponse.json();
        if (!imgurData.success) throw new Error('Imgur upload failed');

        // Create the entry in Supabase
        const { data, error } = await supabase
            .from('ratings')
            .insert([{
                name: document.getElementById('foodName').value,
                location: document.getElementById('location').value,
                imageUrl: imgurData.data.link,
                rating: selectedRating,
                comment: document.getElementById('comment').value
            }]);

        if (error) throw error;

        alert('Rating submitted successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading rating. Please try again.');
    }
});
