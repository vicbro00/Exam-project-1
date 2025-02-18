if (!window.token) {
    window.token = localStorage.getItem("jwt"); 
}

async function fetchPosts() {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/VicB`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        const posts = data.data; // Adjust this based on API response structure

        // Only fetch and display posts if we are not on the create post page
        if (document.getElementById("blogGrid")) {
            const blogGrid = document.getElementById("blogGrid");
            blogGrid.innerHTML = ""; // Clear old content

            posts.forEach(post => {
                const postElement = document.createElement("div");
                postElement.classList.add("post-item");
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <img src="${post.media?.url || ''}" alt="Post Image" : "none"}">
                    <br>
                    <button class="editBtn" data-id="${post.id}">Edit</button>
                    <button class="deleteBtn" data-id="${post.id}">Delete</button>
                    <hr>
                `;
                blogGrid.appendChild(postElement);
            });

            attachEventListeners();
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

async function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/VicB/${postId}`, { 
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to delete post");

        alert("Post deleted successfully!");

        // Remove post from DOM immediately
        document.querySelector(`.deleteBtn[data-id="${postId}"]`).parentElement.remove();

    } catch (error) {
        console.error("Error deleting post:", error);
    }
}

function attachEventListeners() {
    document.querySelectorAll(".editBtn").forEach(button => {
        button.addEventListener("click", event => {
            const postId = event.target.dataset.id;
            window.location.href = `/blog-create-post-page.html?id=${postId}`; // Pass post ID in URL
        });
    });

    document.querySelectorAll(".deleteBtn").forEach(button => {
        button.addEventListener("click", event => {
            const postId = event.target.dataset.id;
            deletePost(postId);
        });
    });
}

function displayPosts(posts) {
    const blogGrid = document.getElementById("blogGrid"); // Ensure this element exists in your HTML
    blogGrid.innerHTML = ""; // Clear old content

    posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            ${post.media?.url ? `<img src="${post.media.url}" alt="Post image">` : ""}
            <p><small>Published: ${post.published}</small></p>
        `;
        blogGrid.appendChild(postElement);
    });
}

async function loadPosts() {
    const posts = await fetchPosts();
    renderPosts(posts);
}

// Fetch posts when the page loads
document.addEventListener("DOMContentLoaded", fetchPosts);