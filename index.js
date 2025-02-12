const SLIDE_WIDTH = document.querySelector('.slide').clientWidth + 10;

// DOM Elements
const blogPostsContainer = document.getElementById('blog-posts-container');
const carouselContainer = document.getElementById('carouselContainer');
const prevBtn = document.getElementById('slideBtnPrev');
const nextBtn = document.getElementById('slideBtnNext');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const hambMenuLoggedOut = document.getElementById('hambMenuLoggedOut');
const hambMenuLoggedIn = document.getElementById('hambMenuLoggedIn');
const logoutButton = document.querySelector('.hamb-menu-logged-in button');

// Toggle menu visibility based on login status
function toggleMenu() {
    const token = localStorage.getItem('token');
    hambMenuLoggedOut.style.display = token ? 'none' : 'block';
    hambMenuLoggedIn.style.display = token ? 'block' : 'none';
}

// Handle hamburger icon click
function handleHamburgerClick(event) {
    event.stopPropagation();
    if (hambMenuLoggedOut.style.display === 'block' || hambMenuLoggedIn.style.display === 'block') {
        hambMenuLoggedOut.style.display = 'none';
        hambMenuLoggedIn.style.display = 'none';
    } else {
        toggleMenu();
    }
}

nextBtn.addEventListener('click', () => carouselContainer.scrollLeft += SLIDE_WIDTH);
prevBtn.addEventListener('click', () => carouselContainer.scrollLeft -= SLIDE_WIDTH);
hamburgerIcon.addEventListener('click', handleHamburgerClick);