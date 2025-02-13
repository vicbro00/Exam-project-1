const SLIDE_WIDTH = document.querySelector('.slide')?.clientWidth + 10 || 0;

const carouselContainer = document.getElementById('carouselContainer');
const prevBtn = document.getElementById('slideBtnPrev');
const nextBtn = document.getElementById('slideBtnNext');

if (nextBtn && prevBtn && carouselContainer) {
    nextBtn.addEventListener('click', () => {
        showLoadingSpinner();
        setTimeout(() => {
            carouselContainer.scrollLeft += SLIDE_WIDTH;
            hideLoadingSpinner();
        }, 500);
    });

    prevBtn.addEventListener('click', () => {
        showLoadingSpinner();
        setTimeout(() => {
            carouselContainer.scrollLeft -= SLIDE_WIDTH;
            hideLoadingSpinner();
        }, 500);
    });
}

function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';
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
    showLoadingSpinner();

    setTimeout(() => {
        if (hambMenuLoggedOut.style.display === 'block' || hambMenuLoggedIn.style.display === 'block') {
            hambMenuLoggedOut.style.display = 'none';
            hambMenuLoggedIn.style.display = 'none';
        } else {
            toggleMenu();
        }

        hideLoadingSpinner();
    }, 500);
}

function signOut() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'block';

    setTimeout(() => {
        localStorage.removeItem('jwt');
        hambMenuLoggedOut.style.display = 'block';
        hambMenuLoggedIn.style.display = 'none';
        alert("You are now signed out.");
        
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }, 500);
}

if (hamburgerIcon) {
    hamburgerIcon.addEventListener('click', handleHamburgerClick);
}

if (signOutButton) {
    signOutButton.addEventListener('click', signOut);
}

document.addEventListener('DOMContentLoaded', async () => {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'block';

    try {
        await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
        console.error('Error during loading:', error);
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
});
