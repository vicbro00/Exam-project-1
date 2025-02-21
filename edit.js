const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

console.log("Post ID:", postId);

async function fetchPostById(postId) {
    try {
        const token = localStorage.getItem("jwt");
        console.log("Token:", token);

        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/VicB/${postId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch post");

        const data = await response.json();
        console.log("API Response:", data);
        return data.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

async function populateFormWithPostData(postId) {
    if (!postId) {
        console.warn("No post ID provided.");
        return;
    }

    const post = await fetchPostById(postId);

    if (post) {
        console.log("Post Data:", post);

        document.getElementById("blogTitle").value = post.title;
        document.getElementById("blogContent").value = post.body;
        document.getElementById("publishDate").value = post.published?.split("T")[0] || new Date().toISOString().split("T")[0];
        document.getElementById("blogImage").value = post.media?.url || "";

        if (post.media?.url) {
            document.getElementById("previewImage").src = post.media.url;
            document.getElementById("previewImage").style.display = "block";
        }
    } else {
        console.warn("No post data found.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateFormWithPostData(postId);
});

document.getElementById("confirmBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    const title = document.getElementById("blogTitle").value;
    const body = document.getElementById("blogContent").value;
    const publishDate = document.getElementById("publishDate").value;
    const mediaUrl = document.getElementById("blogImage").value;

    if (!title || !body || !publishDate) {
        alert("Please fill in all required fields.");
        return;
    }

    await createPost(title, body, publishDate, mediaUrl);
});

async function editPost(postId, updatedPostData) {
    try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/VicB/${postId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPostData),
        });

        if (!response.ok) throw new Error("Failed to update post");

        alert("Post updated successfully!");
        window.location.href = "/index.html";

    } catch (error) {
        console.error("Error updating post:", error);
    }
}