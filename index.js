let sortOrder = 'newest';

function toggleSortOrder() {
    sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    const sortButton = document.getElementById('sortingBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (loadingSpinner) loadingSpinner.style.display = 'block';

    sortButton.textContent = `Sort by ${sortOrder === 'newest' ? 'Oldest' : 'Newest'}`;
    sortButton.innerHTML += ' <i class="fa-solid fa-arrow-down"></i>';

    setTimeout(async () => {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }, 500);
}

document.getElementById('sortingBtn').addEventListener('click', () => {
    const sortButton = document.getElementById('sortingBtn');
    sortButton.classList.toggle('flipped');
    toggleSortOrder();
});

document.addEventListener("DOMContentLoaded", () => {
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    const renderCarousel = () => {
        const carouselContainer = document.getElementById('carouselContainer');
        if (!carouselContainer) return;

        const posts = getPosts();
        const sortedPosts = posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        const latestPosts = sortedPosts.slice(0, 3);

        if (latestPosts.length > 0) {
            carouselContainer.innerHTML = latestPosts.map(post => `
                <li class="slide">
                    <h3>${post.title}</h3>
                    <img src="${post.image}" alt="${post.title}">
                    <button onclick="viewPost('${post.id}')">Read More</button>
                </li>
            `).join('');
        } else {
            carouselContainer.innerHTML = "<li>No posts found.</li>";
        }
    };

    window.viewPost = id => {
        localStorage.setItem('selectedPostId', id);
        window.location.href = 'post.html';
    };

    if (window.location.pathname.includes('index.html')) {
        renderCarousel();
    }
});

let currentSlide = 0;

const showSlide = (index) => {
    const slides = document.querySelectorAll('.slide');
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    slides.forEach((slide, i) => {
        slide.style.display = i === currentSlide ? 'flex' : 'none';
    });
};

document.getElementById('slideBtnPrev').addEventListener('click', () => {
    currentSlide--;
    showSlide(currentSlide);
});

document.getElementById('slideBtnNext').addEventListener('click', () => {
    currentSlide++;
    showSlide(currentSlide);
});

showSlide(currentSlide);