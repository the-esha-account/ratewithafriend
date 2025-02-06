import { storage, db } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
        // Upload image to Firebase Storage
        const storageRef = ref(storage, 'food-images/' + Date.now() + '-' + file.name);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        // Save entry to Firestore
        await addDoc(collection(db, 'food-ratings'), {
            name: document.getElementById('foodName').value,
            location: document.getElementById('location').value,
            imageUrl: imageUrl,
            rating: selectedRating,
            comment: document.getElementById('comment').value,
            timestamp: serverTimestamp()
        });

        alert('Rating submitted successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading rating. Please try again.');
    }
});
