// Get the post ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

console.log("Post ID:", postId); // Debugging

async function fetchPostById(postId) {
    try {
        const token = localStorage.getItem("jwt");
        console.log("Token:", token); // Debugging

        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/VicB/${postId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch post");

        const data = await response.json();
        console.log("API Response:", data); // Debugging
        return data.data; // Return the post data
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

async function populateFormWithPostData(postId) {
    if (!postId) {
        console.warn("No post ID provided."); // Debugging
        return;
    }

    const post = await fetchPostById(postId);

    if (post) {
        console.log("Post Data:", post); // Debugging

        // Populate form fields with post data
        document.getElementById("blogTitle").value = post.title;
        document.getElementById("blogContent").value = post.body;

        // Handle missing `published` field
        const publishDate = post.published ? post.published.split("T")[0] : new Date().toISOString().split("T")[0];
        document.getElementById("publishDate").value = publishDate;

        document.getElementById("blogImage").value = post.media?.url || "";

        // Display the image preview if a URL exists
        if (post.media?.url) {
            document.getElementById("previewImage").src = post.media.url;
            document.getElementById("previewImage").style.display = "block";
        }
    } else {
        console.warn("No post data found."); // Debugging
    }
}

// Populate the form when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const postId = new URLSearchParams(window.location.search).get("id");
    populateFormWithPostData(postId);
});

async function createPost(title, body, publishDate, mediaUrl = "") {
    const username = localStorage.getItem("email");
    const token = localStorage.getItem("jwt");

    if (!username || !token) {
        alert("You must be logged in to create or edit a post.");
        window.location.href = "/account-login-page.html";
        return;
    }

    const postId = new URLSearchParams(window.location.search).get("id");
    const url = postId
        ? `https://v2.api.noroff.dev/blog/posts/VicB/${postId}` // Edit existing post
        : `https://v2.api.noroff.dev/blog/posts/VicB`; // Create new post

    const method = postId ? "PUT" : "POST"; // Use PUT for editing, POST for creating

    const postData = {
        title: title,
        body: body,
        published: publishDate,
        media: mediaUrl ? { url: mediaUrl } : {}
    };

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.errors ? errorData.errors[0].message : response.statusText}`);
        }

        const data = await response.json();
        console.log(postId ? "Post updated successfully:" : "Post created successfully:", data);
        alert(postId ? "Post updated successfully!" : "Post created successfully!");
        window.location.href = "/index.html"; // Redirect to the index page
    } catch (error) {
        console.error("There was a problem:", error);
        alert(error.message || "Failed to save post. Check console for details.");
    }
}

document.getElementById("confirmBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    // Get form inputs
    const title = document.getElementById("blogTitle").value;
    const body = document.getElementById("blogContent").value;
    const publishDate = document.getElementById("publishDate").value;
    const mediaUrl = document.getElementById("blogImage").value;

    // Ensure required fields are filled
    if (!title || !body || !publishDate) {
        alert("Please fill in all required fields.");
        return;
    }

    // Call createPost with the correct data
    await createPost(title, body, publishDate, mediaUrl);
});