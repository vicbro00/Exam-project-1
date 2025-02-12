const SLIDE_WIDTH = document.querySelector('.slide')?.clientWidth + 10 || 0;

const carouselContainer = document.getElementById('carouselContainer');
const prevBtn = document.getElementById('slideBtnPrev');
const nextBtn = document.getElementById('slideBtnNext');

if (nextBtn && prevBtn && carouselContainer) {
    nextBtn.addEventListener('click', () => carouselContainer.scrollLeft += SLIDE_WIDTH);
    prevBtn.addEventListener('click', () => carouselContainer.scrollLeft -= SLIDE_WIDTH);
}

const hamburgerIcon = document.getElementById('hamburgerIcon');
const hambMenuLoggedOut = document.getElementById('hambMenuLoggedOut');
const hambMenuLoggedIn = document.getElementById('hambMenuLoggedIn');
const signOutButton = document.getElementById('signOutBtn');

function toggleMenu() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        hambMenuLoggedOut.style.display = 'none';
        hambMenuLoggedIn.style.display = 'block';
    } else {
        hambMenuLoggedOut.style.display = 'block';
        hambMenuLoggedIn.style.display = 'none';
    }
}

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

if (hamburgerIcon) {
    hamburgerIcon.addEventListener('click', handleHamburgerClick);
}

if (signOutButton) {
    signOutButton.addEventListener('click', signOut);
}