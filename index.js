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

let currentSlide = 0;
let posts = [];

//Displays the lates posts
async function fetchLatestPosts() {
    try {
        const response = await fetch("https://v2.api.noroff.dev/blog/posts/VicB", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        posts = data.data.sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 3);
        showSlide(currentSlide);
        createDots();
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

//Shows one slide at a time
function showSlide(index) {
    const carouselContainer = document.getElementById("carouselContainer");
    if (!carouselContainer) return;

    carouselContainer.innerHTML = `
        <div class="slide">
            <h3>${posts[index].title}</h3>
            ${posts[index].media?.url ? `<img src="${posts[index].media.url}" alt="${posts[index].title}">` : ""}
            <button onclick="viewPost('${posts[index].id}')">Read More</button>
        </div>
    `;

    updateDots(index);
}

//Displays posts
function displayCarouselGrid(posts) {
    const carouselContainer = document.getElementById("carouselContainer");
    if (!carouselContainer) return;

    if (posts.length > 0) {
        carouselContainer.innerHTML = posts.map(post => `
            <div class="carousel-item">
                <h3>${post.title}</h3>
                ${post.media?.url ? `<img src="${post.media.url}" alt="${post.title}">` : ""}
                <button onclick="viewPost('${post.id}')">Read More</button>
            </div>
        `).join("");
    } else {
        carouselContainer.innerHTML = "<p>No posts found.</p>";
    }
}

//Navigates to post page of the blog post
window.viewPost = id => {
    window.location.href = `post.html?id=${id}`;
};

//Dots for easier navigation
function createDots() {
    const carouselDots = document.getElementById("carouselDots");
    if (!carouselDots) return;

    carouselDots.innerHTML = posts.map((_, i) => 
        `<li class="carousel-dot" data-index="${i}"></li>`).join("");

    updateDots(currentSlide);
}

//Displays posts when page loads
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("index.html")) {
        fetchLatestPosts();
    }
});

//Updates the dots
function updateDots(index) {
    document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
        dot.classList.toggle("active-dot", i === index);
    });
}

//Navigates between carousel posts
function changeSlide(direction) {
    currentSlide += direction;

    if (currentSlide >= posts.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = posts.length - 1;

    showSlide(currentSlide);
}

//Buttons
document.getElementById("slideBtnPrev").addEventListener("click", () => changeSlide(-1));
document.getElementById("slideBtnNext").addEventListener("click", () => changeSlide(1));