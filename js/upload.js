const IMGUR_CLIENT_ID = '8db0a94a56a0071'; // Make sure this is your actual Client ID
const GITHUB_REPO = 'the-esha-account/ratewithafriend';

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

        const entry = {
            name: document.getElementById('foodName').value,
            location: document.getElementById('location').value,
            imageUrl: imgurData.data.link,
            rating: selectedRating,
            comment: document.getElementById('comment').value,
            timestamp: new Date().toISOString()
        };

        const issueData = {
            title: `Food Rating: ${entry.name}`,
            body: JSON.stringify(entry)
        };

        await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token YOUR_GITHUB_TOKEN`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(issueData)
        });

        alert('Rating submitted successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading rating. Please try again.');
    }
});
