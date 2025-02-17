//Constants for slide width and other elements
const SLIDE_WIDTH = document.querySelector('.slide')?.clientWidth + 10 || 0;
const carouselContainer = document.getElementById('carouselContainer');
const prevBtn = document.getElementById('slideBtnPrev');
const nextBtn = document.getElementById('slideBtnNext');
const dots = document.querySelectorAll('.carousel-dots li');

//Tracks current slide index
let currentIndex = 0;

//Updates the dots under the carousel to show which slide the user is on
function updateActiveDot() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active-dot', index === currentIndex);
    });
}

//Adds functions to previous and next buttons if they exist on the page
if (nextBtn && prevBtn && carouselContainer) {
    nextBtn.addEventListener('click', () => {
        if (currentIndex < dots.length - 1) {
            currentIndex++;
            carouselContainer.scrollLeft += SLIDE_WIDTH;
            updateActiveDot();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            carouselContainer.scrollLeft -= SLIDE_WIDTH;
            updateActiveDot();
        }
    });
}

//Shows and hides loading spinner for async actions
function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';
}

//Adds loading spinner when clicking next and previous buttons
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

document.addEventListener('DOMContentLoaded', () => {
    updateActiveDot();
});

//Hamburger menu elements
const hamburgerIcon = document.getElementById('hamburgerIcon');
const hambMenuLoggedOut = document.getElementById('hambMenuLoggedOut');
const hambMenuLoggedIn = document.getElementById('hambMenuLoggedIn');
const signOutButton = document.getElementById('signOutBtn');

//Toggles the menu based on signed in status
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

//Shows menu display
document.addEventListener("DOMContentLoaded", () => {
    hambMenuLoggedOut.style.display = 'none';
    hambMenuLoggedIn.style.display = 'none';
});

//Handles hamburger click event
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

//Handles sign out function
function signOut() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'block';

    setTimeout(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('email');
        hambMenuLoggedOut.style.display = 'block';
        hambMenuLoggedIn.style.display = 'none';

        alert("You are now signed out.");
        
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        window.location.href = 'index.html';  
    }, 500);
}

//Event listener for the hamburger icon
if (hamburgerIcon) {
    hamburgerIcon.addEventListener('click', handleHamburgerClick);
}

if (signOutButton) {
    signOutButton.addEventListener('click', signOut);
}

//Closes menu when clicking on somewhere on the page with loading spinner
document.addEventListener('click', (event) => {
    const isClickInsideMenu = hambMenuLoggedOut.contains(event.target) || hambMenuLoggedIn.contains(event.target) || hamburgerIcon.contains(event.target);
    const isMenuOpen = hambMenuLoggedOut.style.display === 'block' || hambMenuLoggedIn.style.display === 'block';

    if (!isClickInsideMenu && isMenuOpen) {
        showLoadingSpinner();
        setTimeout(() => {
            hambMenuLoggedOut.style.display = 'none';
            hambMenuLoggedIn.style.display = 'none';
            hideLoadingSpinner();
        }, 500);
    }
});

//Shows loading spinner when page is loading in
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