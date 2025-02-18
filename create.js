// Function to create a new blog post using the API
async function createPost(title, body, publishDate, mediaUrl = "") {
    const username = localStorage.getItem("email");
    const token = localStorage.getItem("jwt");

    const url = `https://v2.api.noroff.dev/blog/posts/VicB`;

    console.log("Username (email):", username); // Debugging
    console.log("Token:", token); // Debugging

    if (!username) {
        alert("You must be logged in to create a post.");
        window.location.href = "/account-login-page.html"; // Redirect to login page
        return;
    }

    if (!token) {
        alert("You must be logged in to create a post.");
        return;
    }

    const postData = {
        title: title,
        body: body,
        published: publishDate, // Ensure the date format is correct
        media: mediaUrl ? { url: mediaUrl } : {}
    };

    // Check if the image URL exceeds the 300 characters limit
    if (mediaUrl.length > 300) {
        alert("Image URL cannot be longer than 300 characters.");
        return;
    }

    console.log("Post data being sent:", postData); // Debugging

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
            console.error("API error response:", errorData);
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

document.getElementById("confirmBtn").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form inputs
    const title = document.getElementById("blogTitle").value;
    const body = document.getElementById("blogContent").value;
    const publishDate = document.getElementById("publishDate").value;    
    const blogImageElement = document.getElementById("blogImage");


    // Get the image URL from the data-url attribute
    const mediaUrl = blogImageElement && blogImageElement.value.trim() ? blogImageElement.value.trim() : "";
    
    // Ensure required fields are filled
    if (!title || !body || !publishDate) {
        alert("Please fill in all required fields.");
        return;
    }

    // Call createPost with the correct data
    await createPost(title, body, publishDate, mediaUrl);
});

// Check if user is logged in
const token = localStorage.getItem("jwt"); // Fix inconsistent token key

if (!token) {
    alert("You must be logged in to create a post.");
    window.location.href = "/account-login-page.html"; // Redirect to login page
} else {
    console.log("User is logged in. Token:", token);
}

document.getElementById("blogImage").addEventListener("change", function (event) {
    const imageUrl = event.target.value; // Get the URL from the input field

    if (imageUrl) {
        // Display the image preview
        document.getElementById("previewImage").src = imageUrl;
        document.getElementById("previewImage").style.display = "block";

        // Store the URL in a hidden input or global variable
        event.target.setAttribute("data-url", imageUrl);
        console.log("Image URL set to:", imageUrl); // Debugging: Check the image URL
    } else {
        // Clear the preview if the URL is empty
        document.getElementById("previewImage").style.display = "none";
        console.warn("No URL entered.");
    }
});

console.log("Media URL:", mediaUrl); // Debugging: Check the media URL