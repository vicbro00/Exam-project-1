//Checks current sort order
let sortOrder = "newest";

//Toggles sort order between newest and oldest posts
function toggleSortOrder() {
    sortOrder = sortOrder === "newest" ? "oldest" : "newest";
    const sortButton = document.getElementById("sortingBtn");
    const loadingSpinner = document.getElementById("loadingSpinner");

    if (loadingSpinner) {
        loadingSpinner.style.display = "block";
    }

    //Updates the sort button
    sortButton.textContent = `Sort by ${sortOrder === "newest" ? "oldest" : "Newest"}`;
    sortButton.innerHTML += ` <i class="fa-solid fa-arrow-down"></i>`;

    posts.sort((a, b) => {
        const dateA = new Date(a.created);
        const dateB = new Date(b.created);
        return sortOrder === "oldest" ? dateB - dateA : dateA - dateB;
    });

    displayBlogGrid(posts);

    //Hides loading spinner after half a second
    setTimeout(() => {
        if (loadingSpinner) {
            loadingSpinner.style.display = "none";
        }
    }, 500);
}

//Adds event listener to the sorting button
document.getElementById("sortingBtn").addEventListener("click", () => {
    const sortButton = document.getElementById("sortingBtn");
    sortButton.classList.toggle("flipped");
    toggleSortOrder();
});

function displayBlogGrid(posts) {
    const blogGrid = document.getElementById("blogGrid");
    if (!blogGrid) return;

    blogGrid.innerHTML = "";

    posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post-item");

        //Publish date
        const publishDate = new Date(post.created).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        let postContent = `
            <h3>${post.title}</h3>
            <a href="/post/index.html?id=${post.id}">${post.media?.url ? `<img src="${post.media.url}" alt="${post.title}">` : ""}</a>
            <p class="post-date">Published on: ${publishDate}</p>
            <p>${post.body}</p>
            <button onclick="viewPost("${post.id}")">Read More</button>
        `;

        postElement.innerHTML = postContent;
        blogGrid.appendChild(postElement);
    });
}


let currentSlide = 0;
let posts = [];

//Displays the latest posts
async function fetchLatestPosts() {
    try {
        const response = await fetch("https://v2.api.noroff.dev/blog/posts/VicB", {
            headers: { "Authorization": "Bearer ${token}" }
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        //Shows only 3 posts
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
            <button onclick="viewPost("${posts[index].id}")">Read More</button>
        </div>
    `;

    updateDots(index);
}

//Navigates to post page of the blog post
window.viewPost = id => {
    window.location.href = `/post/index.html?id=${id}`;
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

document.addEventListener("DOMContentLoaded", async () => {
    if (window.location.pathname.includes("index.html")) {
        const response = await fetch("https://v2.api.noroff.dev/blog/posts/VicB", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            posts = data.data;
            displayBlogGrid(posts);
        }
    }
});

//Search
document.getElementById("searchInput").addEventListener("input", (event) => {
    const searchQuery = event.target.value.trim().toLowerCase();
    if (searchQuery) {
        filterPosts(searchQuery);
    } else {
        displayBlogGrid(posts);
    }
});

//Filter
function filterPosts(query) {
    const filteredPosts = posts.filter(post => {
        const title = post.title.toLowerCase();
        const body = post.body.toLowerCase();
        return title.includes(query) || body.includes(query);
    });

    displayBlogGrid(filteredPosts);
}