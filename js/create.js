let isSubmitting = false;

//Check if user is logged in
const token = localStorage.getItem("jwt");

if (!token && window.location.pathname.includes("/post/create.html")) {
    alert("You must be logged in to access this page.");
    window.location.href = "https://vicbro00.github.io/Exam-project-1/account/login.html";
}

//Creates or updates a post
async function createPost(title, body, publishDate, mediaUrl = "") {
    const username = localStorage.getItem("email");
    const postId = new URLSearchParams(window.location.search).get("id");
    const url = postId
        ? `https://v2.api.noroff.dev/blog/posts/VicB/${postId}`
        : `https://v2.api.noroff.dev/blog/posts/VicB`;

    const method = postId ? "PUT" : "POST";

    const postData = {
        title,
        body,
        published: publishDate,
        media: mediaUrl ? { url: mediaUrl } : {}
    };

    try {
        //Sends a request to create or update post
        const response = await fetch(url, {
            method,
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
        window.location.href = "https://vicbro00.github.io/Exam-project-1/index.html";
    } catch (error) {
        console.error("There was a problem:", error);
        alert(error.message || "Failed to save post. Check console for details.");
    }
}

//Checks if this is the create page
if (window.location.pathname.includes("/post/create.html")) {
    document.getElementById("blogImage").addEventListener("input", function () {
        const imageUrl = this.value;
        const previewImage = document.getElementById("previewImage");

        //Previews image
        if (imageUrl) {
            previewImage.src = imageUrl;
            previewImage.style.display = "block";
        } else {
            previewImage.style.display = "none";
        }
    });
}