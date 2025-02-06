import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const gallery = document.getElementById('gallery');

async function loadGallery() {
    try {
        const q = query(collection(db, 'food-ratings'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        gallery.innerHTML = '';=

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <div class="gallery-header">${data.name}</div>
                <div class="gallery-location">${data.location}</div>
                <img class="food-image" src="${data.imageUrl}" alt="${data.name}">
                <div class="gallery-info">
                    <img class="rating-image" src="images/${data.rating}.jpeg" alt="Rating: ${data.rating}">
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
