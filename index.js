const SLIDE_WIDTH = document.querySelector('.slide').clientWidth + 10;

// DOM Elements
const blogPostsContainer = document.getElementById('blogPostsContainer');
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


const newURL = 'https://v2.api.noroff.dev/blog/posts/v';

async function fetchBlogPosts() {
    try {
        const response = await fetch(newURL, {
            method: 'GET', // HTTP method
            headers: {
                'accept': 'application/json', // Set the 'accept' header
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        console.log('Blog posts:', data);
        displayBlogPosts(data.data); // Display the posts (assuming the response has a `data` array)
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById('blogPostsContainer');

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-post');

        // Add post title
        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;
        postElement.appendChild(titleElement);

        // Add post body
        const bodyElement = document.createElement('p');
        bodyElement.textContent = post.body;
        postElement.appendChild(bodyElement);

        // Add post media (if available)
        if (post.media && post.media.url) {
            const mediaElement = document.createElement('img');
            mediaElement.src = post.media.url;
            mediaElement.alt = post.media.alt || 'Blog post image';
            postElement.appendChild(mediaElement);
        }

        // Append the post to the container
        blogPostsContainer.appendChild(postElement);
    });
}

// Fetch and display blog posts when the page loads
fetchBlogPosts();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmljQiIsImVtYWlsIjoidmljYnJvMDI0NThAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzkzMDYyMDV9.do_r_gfOnK_21KipYndjC_QtQhlmnk8hUzTjCk33dj8'; // Replace with your actual token

const response = fetch(newURL, {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
});