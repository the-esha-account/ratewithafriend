import { SUPABASE_URL, SUPABASE_KEY, IMGUR_CLIENT_ID } from './config.js';

// Initialize Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const submitButton = document.querySelector('button[type="submit"]');
let selectedRating = null;

console.log('upload.js loaded');

// Preview image
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG, and GIF images are allowed.');
        fileInput.value = '';
        return;
    }
    
    const MAX_SIZE = 5 * 4000 * 4000; // 5MB
    if (file.size > MAX_SIZE) {
        alert('Image must be smaller than 5MB.');
        fileInput.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

// Handle rating selection
document.querySelectorAll('.rating-option-container').forEach(container => {
    container.addEventListener('click', (e) => {
        console.log('Container clicked');
        const img = container.querySelector('.rating-option');
        const rating = img.dataset.rating;
        console.log('Rating clicked:', rating);
        
        document.querySelectorAll('.rating-option').forEach(opt => opt.classList.remove('selected'));
        
        if (selectedRating === rating) {
            selectedRating = null;
        } else {
            img.classList.add('selected');
            selectedRating = rating;
        }
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
    
    submitButton.disabled = true;
    submitButton.innerText = 'Uploading...';
    
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

        if (!imgurResponse.ok) throw new Error('Imgur upload failed');

        const imgurData = await imgurResponse.json();
        console.log('Imgur response:', imgurData);

        if (!imgurData.success) throw new Error(imgurData.data.error || 'Imgur upload failed');

        const sanitizeInput = (input) => input.trim().replace(/<[^>]*>/g, '').substring(0, 255);
        const entry = {
            name: sanitizeInput(document.getElementById('foodName').value),
            location: sanitizeInput(document.getElementById('location').value),
            imageUrl: imgurData.data.link,
            rating: selectedRating,
            comment: sanitizeInput(document.getElementById('comment').value)
        };

        console.log('Saving to Supabase:', entry);

        const { data, error } = await supabaseClient.from('ratings').insert([entry]);

        if (error) throw error;

        console.log('Saved successfully:', data);
        alert('Rating submitted successfully!');
        
        form.reset();
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        selectedRating = null;
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading rating. Please check the console for details.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = 'Submit';
    }
});
