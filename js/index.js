// Global state
let sortOrder = "newest"; // Tracks current sort order
let allPosts = []; // Stores all posts fetched from the API
let filteredPosts = []; // Stores posts after filtering or sorting

// Fetch posts from the API
async function fetchPosts() {
    try {
        const response = await fetch("https://v2.api.noroff.dev/blog/posts/VicB", {
            headers: { "Authorization": `Bearer ${window.token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        allPosts = data.data;
        filteredPosts = [...allPosts]; // Initialize filteredPosts with all posts
        displayPosts(filteredPosts); // Display posts after fetching
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Display posts in the blog grid
function displayPosts(posts) {
    const blogGrid = document.getElementById("blogGrid");
    if (!blogGrid) return;

    blogGrid.innerHTML = ""; // Clear existing content

    posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post-item");

        const publishDate = new Date(post.created).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        let postContent = `
            <h3>${post.title}</h3>
            ${post.media?.url ? `<img src="${post.media.url}" alt="${post.title || 'Blog post image'}">` : ""}
            <p class="post-date">Published on: ${publishDate}</p>
            <p>${post.body}</p>
            <button class="readMoreBtn" data-id="${post.id}">Read More</button>
        `;

        postElement.innerHTML = postContent;
        blogGrid.appendChild(postElement);
    });

    attachEventListeners(); // Re-attach event listeners after updating the DOM
}

// Attach event listeners to buttons
function attachEventListeners() {
    document.querySelectorAll(".readMoreBtn").forEach(button => {
        button.addEventListener("click", event => {
            const postId = event.target.dataset.id;
            window.location.href = `/Exam-project-1/post/index.html?id=${postId}`;
        });
    });
}

// Toggle sort order between newest and oldest
function toggleSortOrder() {
    sortOrder = sortOrder === "newest" ? "oldest" : "newest";
    const sortButton = document.getElementById("sortingBtn");

    // Update the sort button text
    sortButton.textContent = `Sort by ${sortOrder === "newest" ? "Oldest" : "Newest"}`;

    // Sort posts
    filteredPosts.sort((a, b) => {
        const dateA = new Date(a.created);
        const dateB = new Date(b.created);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    displayPosts(filteredPosts); // Display sorted posts
}

// Filter posts based on search query
function filterPosts(query) {
    filteredPosts = allPosts.filter(post => {
        const title = post.title.toLowerCase();
        const body = post.body.toLowerCase();
        return title.includes(query) || body.includes(query);
    });

    displayPosts(filteredPosts); // Display filtered posts
}

// Initialize the page
function initializePage() {
    fetchPosts(); // Fetch and display posts

    // Add event listener to the sorting button
    document.getElementById("sortingBtn").addEventListener("click", toggleSortOrder);

    // Add event listener to the search input
    document.getElementById("searchInput").addEventListener("input", (event) => {
        const searchQuery = event.target.value.trim().toLowerCase();
        filterPosts(searchQuery);
    });
}

// Run initialization when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);