//Fetches posts on post.html
async function fetchPostById(postId) {
    const token = localStorage.getItem("jwt");
    const username = 'VicB';
    const url = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

    try {
        const response = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch the post.");
        }

        const data = await response.json();
        displayPost(data.data);
    } catch (error) {
        console.error("Error fetching post:", error);
    }
}

//Displayds posts on post.html
function displayPost(post) {
    const blogGrid = document.getElementById("blogGrid");
    if (!blogGrid) return;

    //Publish date
    const publishDate = new Date(post.created).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    blogGrid.innerHTML = `
        <h1>${post.title}</h1>
        <p class="post-date">Published on: ${publishDate}</p>
        <p>${post.body}</p>
        ${post.media?.url ? `<img src="${post.media.url}" alt="Post image">` : ""}
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