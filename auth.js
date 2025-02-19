if (window.location.pathname.includes("account-login-page.html")) {
    function login() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Please fill in both email and password fields.");
            return false;
        }

        const loginData = {
            email: email,
            password: password
        };

        fetch("https://v2.api.noroff.dev/auth/login", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("Login failed:", errorData);
                    throw new Error(errorData.message || "Login failed");
                });
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("jwt", data.data.accessToken);
            localStorage.setItem("email", email.toLowerCase());

            console.log("User is now signed in.");
            alert("You are now signed in!");

            window.location.href = "./blog-create-post-page.html";
        })
        .catch(error => {
            console.error("Error during login:", error);
            alert(error.message || "An error occurred. Please try again.");
        });
    }

    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        login();
    });
} else {
    console.log("Not on the account-login-page. Login script will not run.");
}

//Function only works in create and edit post pages
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes("blog-create-post-page.html") || currentPage.includes("post-edit.html")) { 
        const userEmail = localStorage.getItem("email");
        document.getElementById("email").textContent = userEmail ? userEmail : "Not signed in";
    }
});