//Checks current sort order
let sortOrder = 'newest';

//Toggles sort order between newest and oldest posts
function toggleSortOrder() {
    sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    const sortButton = document.getElementById('sortingBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }

    //Updates the sort button text and arrow icon
    sortButton.textContent = `Sort by ${sortOrder === 'newest' ? 'Oldest' : 'Newest'}`;
    sortButton.innerHTML += ' <i class="fa-solid fa-arrow-down"></i>';

    //Hides loading spinner after half a second
    setTimeout(() => {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }, 500);
}

//Adds event listener to the sorting button
document.getElementById('sortingBtn').addEventListener('click', () => {
    const sortButton = document.getElementById('sortingBtn');
    sortButton.classList.toggle('flipped');
    toggleSortOrder();
});

//Wait for dom to load before running scripts
document.addEventListener("DOMContentLoaded", () => {
    //Retrieves posts from local storage
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    //Shows the three latest posts in carousel
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

    //Navigates to post page
    window.viewPost = id => {
        localStorage.setItem('selectedPostId', id);
        window.location.href = 'post.html';
    };

    //Shows the carousel on index page
    if (window.location.pathname.includes('index.html')) {
        renderCarousel();
    }
});

//Tracks the current slide
let currentSlide = 0;

//Function to show the slides
const showSlide = (index) => {
    const slides = document.querySelectorAll('.slide');
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    slides.forEach((slide, i) => {
        slide.style.display = i === currentSlide ? 'flex' : 'none';
    });
};

//Adds event listeners to the previous and next button for carousel
document.getElementById('slideBtnPrev').addEventListener('click', () => {
    currentSlide--;
    showSlide(currentSlide);
});

document.getElementById('slideBtnNext').addEventListener('click', () => {
    currentSlide++;
    showSlide(currentSlide);
});

//Shows the first carousel slide
showSlide(currentSlide);