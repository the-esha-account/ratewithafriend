const IMGUR_CLIENT_ID = '8db0a94a56a0071'; // Make sure this is your actual Client ID

const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const ratingOptions = document.querySelectorAll('.rating-option');
let selectedRating = null;

// Test localStorage immediately
console.log('Initial localStorage content:', localStorage.getItem('foodRatings'));

// Handle rating selection
ratingOptions.forEach(option => {
    option.addEventListener('click', () => {
        ratingOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedRating = option.dataset.rating;
    });
});

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug line
    console.log('Selected rating:', selectedRating);
    console.log('File selected:', fileInput.files[0]?.name || 'No file');
    console.log('Food name:', document.getElementById('foodName').value);
    console.log('Location:', document.getElementById('location').value);
    console.log('Comment:', document.getElementById('comment').value);

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
        console.log('Starting Imgur upload...'); // Debug line
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
            },
            body: formData
        });

        console.log('Imgur response status:', response.status); // Debug line
        const data = await response.json();
        console.log('Imgur response data:', data); // Debug line

        if (!data.success) {
            console.error('Imgur upload failed:', data);
            throw new Error('Upload failed: ' + JSON.stringify(data));
        }

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
        let entries = [];
        try {
            const existingEntries = localStorage.getItem('foodRatings');
            console.log('Existing entries:', existingEntries);
            entries = existingEntries ? JSON.parse(existingEntries) : [];
        } catch (e) {
            console.error('Error parsing existing entries:', e);
        }

        entries.unshift(entry);
        console.log('New entries array:', entries);

        try {
            localStorage.setItem('foodRatings', JSON.stringify(entries));
            console.log('Successfully saved to localStorage');
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }

        alert('Rating submitted successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Detailed error:', error);
        alert('Error uploading rating. Please check the console for details.');
    }
});
