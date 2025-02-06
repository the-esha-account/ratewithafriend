const IMGUR_CLIENT_ID = '8db0a94a56a0071'; // First, make sure you added your Imgur Client ID here!

const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const ratingOptions = document.querySelectorAll('.rating-option');
let selectedRating = null;

// Handle rating selection
ratingOptions.forEach(option => {
    option.addEventListener('click', () => {
        ratingOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedRating = option.dataset.rating;
        console.log('Selected rating:', selectedRating); // Debug line
    });
});

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug line

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
        console.log('Uploading to Imgur...'); // Debug line
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
            },
            body: formData
        });

        const data = await response.json();
        console.log('Imgur response:', data); // Debug line

        if (!data.success) throw new Error('Upload failed');

        // Create the entry
        const entry = {
            name: document.getElementById('foodName').value,
            location: document.getElementById('location').value,
            imageUrl: data.data.link,
            rating: selectedRating,
            comment: document.getElementById('comment').value,
            timestamp: Date.now()
        };

        console.log('Creating entry:', entry); // Debug line

        // Save to localStorage
        let entries = JSON.parse(localStorage.getItem('foodRatings') || '[]');
        entries.unshift(entry);
        localStorage.setItem('foodRatings', JSON.stringify(entries));

        console.log('Saved to localStorage'); // Debug line

        alert('Rating submitted successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error details:', error); // More detailed error logging
        alert('Error uploading rating. Please check the console for details.');
    }
});

// Test localStorage access
try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('localStorage is working');
} catch (e) {
    console.error('localStorage is not available:', e);
}
