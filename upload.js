const IMGUR_CLIENT_ID = '8db0a94a56a0071'; 

const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const ratingOptions = document.querySelectorAll('.rating-option');
let selectedRating = null;

// Preview image
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('Image must be less than 5MB');
            fileInput.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
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

// Handle form submission
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
        // Upload to Imgur
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
        if (!data.success) throw new Error('Upload failed');

        const entry = {
            name: document.getElementById('foodName').value,
            location: document.getElementById('location').value,
            imageUrl: data.data.link,
            rating: selectedRating,
            comment: document.getElementById('comment').value,
            timestamp: Date.now()
        };

        let entries = JSON.parse(localStorage.getItem('foodRatings') || '[]');
        entries.unshift(entry)
        localStorage.setItem('foodRatings', JSON.stringify(entries));

        alert('Rating submitted successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading rating. Please try again.');
    }
});
