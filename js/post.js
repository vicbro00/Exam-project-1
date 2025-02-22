//Fetches posts on post.html
async function fetchPostById(postId) {
    const token = localStorage.getItem("jwt");
    const username = "VicB";
    const url = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error("Failed to fetch the post.");
        }

        const data = await response.json();
        displayPosts(data);
    } catch (error) {
        console.error("Error fetching post:", error);
    }
}

//Displays posts on post.html
function displayPosts(post) {
    const blogGrid = document.getElementById("blogGrid");
    if (!blogGrid) return;

    //Finds who the author of the post is
    const authorName = post.author && post.author.name ? post.author.name : "Unknown Author";

    //Publish date
    const publishDate = new Date(post.created).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    //Displays blog
    blogGrid.innerHTML = `
        <h1>${post.title}</h1>
        ${post.media?.url ? `<img src="${post.media.url}" alt="Post image">` : ""}
        <p class="post-date">Published on: ${publishDate}</p>
        <p>${post.body}</p>
        <p class="post-author">By: ${authorName}</p>
    `;
}

//Fetches the correct post
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (postId) {
        fetchPostById(postId);
    } else {
        console.error("No post ID provided");
    }
});

//Creates a link button to share the url and copies to clipboard
document.addEventListener("DOMContentLoaded", function () {
    const shareBtn = document.getElementById("shareBtn");

    if (shareBtn) {
        shareBtn.addEventListener("click", function () {
            const postId = getPostIdFromURL();
            if (postId) {
                const shareableURL = `${window.location.origin}/post/index.html?id=${postId}`;

                if (navigator.share) {
                    navigator.share({
                        title: "Check out this blog post!",
                        url: shareableURL
                    }).catch(err => console.error("Sharing failed:", err));
                } else {
                    navigator.clipboard.writeText(shareableURL).then(() => {
                        alert("Link copied to clipboard!");
                    }).catch(err => console.error("Copy failed:", err));
                }
            }
        });
    }

    function getPostIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }
});

async function fetchPosts() {
    const token = localStorage.getItem("jwt");
    try {
        // Fetches blogs from api
        const response = await fetch("https://v2.api.noroff.dev/blog/posts/VicB", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        displayPosts(data);

    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

function displayPosts(posts) {
    const blogGrid = document.getElementById("blogGrid");
    if (!blogGrid) return;

    blogGrid.innerHTML = "";

    const isIndexPage = window.location.pathname === "/Exam-project-1/index.html";
    const isPostPage = window.location.pathname.includes("/Exam-project-1/post/index.html");

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
            ${post.media?.url ? `<img src="${post.media.url}" alt="Post image">` : ""}
            <p class="post-date">Published on: ${publishDate}</p>
            <p>${post.body}</p>
        `;

        postElement.innerHTML = postContent;
        blogGrid.appendChild(postElement);
    });

    attachEventListeners();
}

document.addEventListener("DOMContentLoaded", () => {
    fetchPosts();
});