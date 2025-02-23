//Constants for slide width and other elements
const SLIDE_WIDTH = document.querySelector(".slide")?.clientWidth + 10 || 0;
const carouselContainer = document.getElementById("carouselContainer");
const prevBtn = document.getElementById("slideBtnPrev");
const nextBtn = document.getElementById("slideBtnNext");
const dots = document.querySelectorAll(".carousel-dots li");

//Tracks current slide index
let currentIndex = 0;

//Updates the dots under the carousel to show which slide the user is on
function updateActiveDot() {
    dots.forEach((dot, index) => {
        dot.classList.toggle("active-dot", index === currentIndex);
    });
}

//Adds functions to previous and next buttons if they exist on the page
if (nextBtn && prevBtn && carouselContainer) {
    nextBtn.addEventListener("click", () => {
        if (currentIndex < dots.length - 1) {
            currentIndex++;
            carouselContainer.scrollLeft += SLIDE_WIDTH;
            updateActiveDot();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            carouselContainer.scrollLeft -= SLIDE_WIDTH;
            updateActiveDot();
        }
    });
}

//Shows and hides loading spinner for async actions
function showLoadingSpinner() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) loadingSpinner.style.display = "block";
}

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) loadingSpinner.style.display = "none";
}

//Adds loading spinner when clicking next and previous buttons
if (nextBtn && prevBtn && carouselContainer) {
    nextBtn.addEventListener("click", () => {
        showLoadingSpinner();
        setTimeout(() => {
            carouselContainer.scrollLeft += SLIDE_WIDTH;
            hideLoadingSpinner();
        }, 500);
    });

    prevBtn.addEventListener("click", () => {
        showLoadingSpinner();
        setTimeout(() => {
            carouselContainer.scrollLeft -= SLIDE_WIDTH;
            hideLoadingSpinner();
        }, 500);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateActiveDot();
});

//Hamburger menu elements
const hamburgerIcon = document.getElementById("hamburgerIcon");
const hambMenuLoggedOut = document.getElementById("hambMenuLoggedOut");
const hambMenuLoggedIn = document.getElementById("hambMenuLoggedIn");
const signOutButton = document.getElementById("signOutBtn");

//Toggles the menu depending on if the user is logged in or not
function toggleMenu() {
    const jwt = localStorage.getItem("jwt");
    const desktopNavLoggedIn = document.querySelector(".desktop-nav-logged-in");
    const desktopNavLoggedOut = document.querySelector(".desktop-nav-logged-out");
    const mobileNavLoggedIn = document.querySelector(".hamb-menu-logged-in");
    const mobileNavLoggedOut = document.querySelector(".hamb-menu-logged-out");

    const isDesktop = window.innerWidth >= 768;

    if (jwt) {
        if (isDesktop) {
            desktopNavLoggedIn.style.display = "flex";
            desktopNavLoggedOut.style.display = "none";
        } else {
            desktopNavLoggedIn.style.display = "none";
            desktopNavLoggedOut.style.display = "none";
        }
        mobileNavLoggedIn.style.display = "none";
        mobileNavLoggedOut.style.display = "none";
    } else {
        if (isDesktop) {
            desktopNavLoggedIn.style.display = "none";
            desktopNavLoggedOut.style.display = "flex";
        } else {
            desktopNavLoggedIn.style.display = "none";
            desktopNavLoggedOut.style.display = "none";
        }
        mobileNavLoggedIn.style.display = "none";
        mobileNavLoggedOut.style.display = "none";
    }
}

//Toggles the hamburger menu in mobile view
function toggleHamburgerMenu() {
    const jwt = localStorage.getItem("jwt");
    const mobileNavLoggedIn = document.querySelector(".hamb-menu-logged-in");
    const mobileNavLoggedOut = document.querySelector(".hamb-menu-logged-out");

    if (jwt) {
        if (mobileNavLoggedIn.style.display === "block") {
            mobileNavLoggedIn.style.display = "none";
        } else {
            mobileNavLoggedIn.style.display = "block";
        }
    } else {
        if (mobileNavLoggedOut.style.display === "block") {
            mobileNavLoggedOut.style.display = "none";
        } else {
            mobileNavLoggedOut.style.display = "block";
        }
    }
}

toggleMenu();

window.addEventListener("resize", toggleMenu);

document.addEventListener("DOMContentLoaded", toggleMenu);

//Shows menu display
document.addEventListener("DOMContentLoaded", () => {
    hambMenuLoggedOut.style.display = "none";
    hambMenuLoggedIn.style.display = "none";
});

//Handles hamburger click event
function handleHamburgerClick(event) {
    event.stopPropagation();

    const wasMenuVisible = hambMenuLoggedOut.style.display === "block" || hambMenuLoggedIn.style.display === "block";

    showLoadingSpinner();

    setTimeout(() => {
        if (wasMenuVisible) {
            hambMenuLoggedOut.style.display = "none";
            hambMenuLoggedIn.style.display = "none";
        } else {
            toggleHamburgerMenu();
        }

        hideLoadingSpinner();
    }, 500);
}

//Handles sign out function
function signOut() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) loadingSpinner.style.display = "block";

    setTimeout(() => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("email");
        hambMenuLoggedOut.style.display = "block";
        hambMenuLoggedIn.style.display = "none";
        
        alert("You are now signed out.");
        
        if (loadingSpinner) loadingSpinner.style.display = "none";

        window.location.href = "https://vicbro00.github.io/Exam-project-1/index.html";  
    }, 500);
}

//Event listener for the hamburger icon
if (hamburgerIcon) {
    hamburgerIcon.addEventListener("click", handleHamburgerClick);
}

if (signOutButton) {
    signOutButton.addEventListener("click", signOut);
}

//Closes menu when clicking on somewhere on the page with loading spinner
document.addEventListener("click", (event) => {
    const isClickInsideMenu = hambMenuLoggedOut.contains(event.target) || hambMenuLoggedIn.contains(event.target) || hamburgerIcon.contains(event.target);
    const isMenuOpen = hambMenuLoggedOut.style.display === "block" || hambMenuLoggedIn.style.display === "block";

    if (!isClickInsideMenu && isMenuOpen) {
        showLoadingSpinner();
        setTimeout(() => {
            hambMenuLoggedOut.style.display = "none";
            hambMenuLoggedIn.style.display = "none";
            hideLoadingSpinner();
        }, 500);
    }
});

//Shows loading spinner when page is loading in
document.addEventListener("DOMContentLoaded", async () => {
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) loadingSpinner.style.display = "block";

    try {
        await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
        console.error("Error during loading:", error);
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = "none";
    }
});