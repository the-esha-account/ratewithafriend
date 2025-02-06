import { SUPABASE_URL, SUPABASE_KEY, IMGUR_CLIENT_ID } from './config.js';

// Initialize Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
let selectedRating = null;

console.log('upload.js loaded'); // Debug line

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
document.querySelectorAll('.rating-option-container').forEach(container => {
    container.addEventListener('click', (e) => {
        console.log('Container clicked'); // Debug line
        const img = container.querySelector('.rating-option');
        const rating = img.dataset.rating;
        console.log('Rating clicked:', rating);
        
        // Remove selected class from all options
        document.querySelectorAll('.rating-option').forEach(opt => 
            opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        img.classList.add('selected');
        selectedRating = rating;
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    
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
        console.log('Uploading to Imgur...');
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
        console.log('Imgur response:', imgurData);

        if (!imgurData.success) throw new Error('Imgur upload failed');

        const entry = {
            name: document.getElementById('foodName').value,
            location: document.getElementById('location').value,
            imageUrl: imgurData.data.link,
            rating: selectedRating,
            comment: document.getElementById('comment').value
        };

        console.log('Saving to Supabase:', entry);

        const { data, error } = await supabaseClient
            .from('ratings')
            .insert([entry]);

        if (error) throw error;

        console.log('Saved successfully:', data);
        alert('Rating submitted successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading rating. Please check the console for details.');
    }
});
