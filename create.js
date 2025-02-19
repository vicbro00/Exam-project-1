let isSubmitting = false;

//Check if user is logged in
const token = localStorage.getItem("jwt");

if (!token) {
    alert("You must be logged in to create a post.");
    window.location.href = "/account-login-page.html";
} else {
    console.log("User is logged in. Token:", token);
}

//Creates a new post and posts it
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
        ? `https://v2.api.noroff.dev/blog/posts/VicB/${postId}`
        : `https://v2.api.noroff.dev/blog/posts/VicB`;

    const method = postId ? "PUT" : "POST";

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
        window.location.href = "/index.html";
    } catch (error) {
        console.error("There was a problem:", error);
        alert(error.message || "Failed to save post. Check console for details.");
    }
}