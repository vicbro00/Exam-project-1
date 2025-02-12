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

//Toggle menu
function toggleMenu() {
    const jwt = localStorage.getItem('jwt'); // Get JWT token again when toggling
    if (jwt) {
        hambMenuLoggedOut.style.display = 'none';
        hambMenuLoggedIn.style.display = 'block';
    } else {
        hambMenuLoggedOut.style.display = 'block';
        hambMenuLoggedIn.style.display = 'none';
    }
}

//Toggle menu with hamburger icon
function handleHamburgerClick(event) {
    event.stopPropagation();
    if (hambMenuLoggedOut.style.display === 'block' || hambMenuLoggedIn.style.display === 'block') {
        hambMenuLoggedOut.style.display = 'none';
        hambMenuLoggedIn.style.display = 'none';
    } else {
        toggleMenu();
    }
}

function signOut() {
    localStorage.removeItem('jwt');
    
    hambMenuLoggedOut.style.display = 'block';
    hambMenuLoggedIn.style.display = 'none';
    
    alert("You are now signed out.");
}

const signOutButton = document.getElementById('signOutBtn');
if (signOutButton) {
    signOutButton.addEventListener('click', signOut);
}

nextBtn.addEventListener('click', () => carouselContainer.scrollLeft += SLIDE_WIDTH);
prevBtn.addEventListener('click', () => carouselContainer.scrollLeft -= SLIDE_WIDTH);
hamburgerIcon.addEventListener('click', handleHamburgerClick);