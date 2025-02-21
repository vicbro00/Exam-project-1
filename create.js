let isSubmitting = false;

//Check if user is logged in
const token = localStorage.getItem("jwt");

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
        window.location.href = "/index.html";
    } catch (error) {
        console.error("There was a problem:", error);
        alert(error.message || "Failed to save post. Check console for details.");
    }
}

//Register a new user
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("/account/register.html")) {
        const signUpBtn = document.getElementById("signUpBtn");
        const message = document.getElementById("message");

        signUpBtn.addEventListener("click", function (event) {
            event.preventDefault();
            registerUser();
        });

        function registerUser() {
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const bio = document.getElementById("bio").value;
            const bannerUrl = document.getElementById("bannerUrl").value;
            const bannerAlt = document.getElementById("bannerAlt").value;

            if (!name || !email || !password) {
                message.textContent = "Please fill in all required fields.";
                return;
            }

            const userData = { name, email, password, bio, bannerUrl, bannerAlt };

            console.log("Sending registration data:", JSON.stringify(userData));

            fetch("https://v2.api.noroff.dev/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Registration failed:", errorData);
                        throw new Error(errorData.message || "Registration failed");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("User registered successfully:", data);
                alert("Registration successful! You can now log in.");
                window.location.href = "/account/login.html";
            })
            .catch(error => {
                console.error("Error during registration:", error);
                message.textContent = error.message || "An error occurred. Please try again.";
            });
        }
    }
});

//Show preview image
if (window.location.pathname.includes("/post/create.html")) {
    document.getElementById("blogImage").addEventListener("input", function () {
        const imageUrl = this.value;
        const previewImage = document.getElementById("previewImage");

        if (imageUrl) {
            previewImage.src = imageUrl;
            previewImage.style.display = "block";
        } else {
            previewImage.style.display = "none";
        }
    });
}