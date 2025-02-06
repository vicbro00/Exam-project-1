// API Configuration
const apiKey = "e7233a3c-2b99-4654-8660-8c9ec1479029";
const apiURL = "https://v2.api.noroff.dev";
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmljQiIsImVtYWlsIjoidmljYnJvMDI0NThAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzgwMTEwNzV9.Ke81gamCJK8NSBi-dNBiMOQSPUvGjdt_Sis7_vD2TZg';

const options = {
    headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey
    }
}

// Function to fetch blog posts
async function fetchBlogPosts() {
    try {
        const response = await fetch(apiURL, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data; // Assuming the API returns the posts in a 'data' field
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

// Function to render blog posts
function renderBlogPosts(posts) {
    const container = document.getElementById('blog-posts-container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-post');

        const title = document.createElement('h2');
        title.textContent = post.title;

        const body = document.createElement('p');
        body.textContent = post.body;

        const author = document.createElement('p');
        author.textContent = `Author: ${post.author.name}`;

        const date = document.createElement('p');
        date.textContent = `Date: ${new Date(post.created).toLocaleDateString()}`;

        postElement.appendChild(title);
        postElement.appendChild(body);
        postElement.appendChild(author);
        postElement.appendChild(date);

        container.appendChild(postElement);
    });
}

// Fetch and render blog posts on page load
document.addEventListener('DOMContentLoaded', async () => {
    const posts = await fetchBlogPosts();
    if (posts) {
        renderBlogPosts(posts);
    }
});

//Slider functionality
const carouselContainer = document.getElementById('carouselContainer');
const slide = document.querySelector('.slide');
const prevBtn = document.getElementById('slideBtnPrev');
const nextBtn = document.getElementById('slideBtnNext');

nextBtn.addEventListener("click", () => {
    const slideWidth = slide.clientWidth + 10;
	carouselContainer.scrollLeft += slideWidth;
});

prevBtn.addEventListener("click", () => {
	const slideWidth = slide.clientWidth + 10;
	carouselContainer.scrollLeft -= slideWidth;
});

//Hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const hambMenuLoggedOut  = document.getElementById('hambMenuLoggedOut');
    const hambMenuLoggedIn  = document.getElementById('hambMenuLoggedIn');

    // Function to toggle the menu visibility
    function toggleMenu() {
        if (hambMenuLoggedIn.style.display === 'block') {
            hambMenuLoggedIn.style.display = 'none';
        } else {
            hambMenuLoggedOut.style.display = hambMenuLoggedOut.style.display === 'block' ? 'none' : 'block';
        }
    }

    // Event listener for the hamburger icon
    hamburgerIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from bubbling up to the document
        toggleMenu();
    });

    // Event listener to close the menu when clicking outside
    document.addEventListener('click', function(event) {
        if (hambMenuLoggedOut.style.display === 'block' || hambMenuLoggedIn.style.display === 'block') {
            if (!hambMenuLoggedOut.contains(event.target) && !hambMenuLoggedIn.contains(event.target) && !hamburgerIcon.contains(event.target)) {
                hambMenuLoggedOut.style.display = 'none';
                hambMenuLoggedIn.style.display = 'none';
            }
        }
    });

    // Prevent the menu from closing when clicking inside it
    hambMenuLoggedOut.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    hambMenuLoggedIn.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Ensure the menu is hidden on page load
document.addEventListener('DOMContentLoaded', function () {
    const hambMenuLoggedOut = document.getElementById('hambMenuLoggedOut');
    const hambMenuLoggedIn = document.getElementById('hambMenuLoggedIn');

    hambMenuLoggedOut.style.display = 'none';
    hambMenuLoggedIn.style.display = 'none';
});
});