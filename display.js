

async function fetchPosts() {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/VicB`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched posts:", data); // Debugging

        if (!data || !data.data || data.data.length === 0) {
            console.warn("No posts found.");
            return;
        }

        displayPosts(data.data); // Call a function to render the posts
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
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