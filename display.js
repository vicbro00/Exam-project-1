if (!window.token) {
    window.token = localStorage.getItem("jwt"); 
}

//Function to display posts on page
async function fetchPosts() {
    try {
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/VicB', {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        posts = data.data;

        displayPosts(posts);

    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

//Function to delete a post
async function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
        const token = localStorage.getItem("jwt");
        console.log("Deleting post with ID:", postId);
        console.log("Using token:", token);

        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/VicB/${postId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to delete post");

        alert("Post deleted successfully!");
        window.location.href = "/index.html";

    } catch (error) {
        console.error("Error deleting post:", error);
    }
}

//Functions to buttons
function attachEventListeners() {
    document.querySelectorAll(".editBtn").forEach(button => {
        button.addEventListener("click", event => {
            const postId = event.target.dataset.id;
            window.location.href = `/post/create.html?id=${postId}`;
        });
    });

    document.querySelectorAll(".deleteBtn").forEach(button => {
        button.addEventListener("click", event => {
            const postId = event.target.dataset.id;
            deletePost(postId);
        });
    });

    document.querySelectorAll(".readMoreBtn").forEach(button => {
        button.addEventListener("click", event => {
            const postId = event.target.dataset.id;
            window.location.href = `/post/index.html?id=${postId}`;
        });
    });
}

//Function to display posts
function displayPosts(posts) {
    const blogGrid = document.getElementById("blogGrid");
    if (!blogGrid) return;

    blogGrid.innerHTML = "";

    const isIndexPage = window.location.pathname === '/index.html';
    const isPostPage = window.location.pathname.includes('/post/index.html');

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
            ${post.media?.url ? `<img src="${post.media.url}" alt="Post image">` : ""}
            <p class="post-date">Published on: ${publishDate}</p>
            <p>${post.body}</p>
        `;

        if (isIndexPage) {
            postContent += `<button class="readMoreBtn" data-id="${post.id}">Read More</button>`;
        } else if (!isPostPage) {
            postContent += `
                <button class="editBtn" data-id="${post.id}">Edit</button>
                <button class="deleteBtn" data-id="${post.id}">Delete</button>
            `;
        }

        postElement.innerHTML = postContent;
        blogGrid.appendChild(postElement);
    });

    attachEventListeners();
}

//Fetches posts when page loads
document.addEventListener("DOMContentLoaded", fetchPosts);