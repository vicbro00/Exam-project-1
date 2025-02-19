let isSubmitting = false;

//Function to create a new post
async function createPost(title, body, publishDate, mediaUrl = "") {
    const username = 'VicB';
    const token = localStorage.getItem("jwt");
    const url = `https://v2.api.noroff.dev/blog/posts/${username}`;

    const postData = {
        title,
        body,
        published: publishDate,
        media: mediaUrl ? { url: mediaUrl } : {}
    };

    if (mediaUrl.length > 300) {
        alert("Image URL cannot be longer than 300 characters.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: "POST",
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
        console.log("Post created successfully:", data);
        alert("Post created successfully!");
        window.location.href = "/index.html";
    } catch (error) {
        console.error("There was a problem creating the post:", error);
        alert(error.message || "Failed to create post. Check console for details.");
    }
}

// Check if user is logged in
const token = localStorage.getItem("jwt");

if (!token) {
    alert("You must be logged in to create a post.");
    window.location.href = "/account-login-page.html";
} else {
    console.log("User is logged in. Token:", token);
}