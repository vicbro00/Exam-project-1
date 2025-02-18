// Check if the current page is the account-login page
if (window.location.pathname.includes("account-login-page.html")) {
    // Function to log in a user
    function login() {
        // Get email and password from input fields
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validate inputs
        if (!email || !password) {
            alert("Please fill in both email and password fields.");
            return false; // Prevent form submission
        }

        // Prepare the request body
        const loginData = {
            email: email,
            password: password
        };

        // Send login request to the API
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
            // Save the token and email to localStorage
            localStorage.setItem("jwt", data.data.accessToken);
            localStorage.setItem("email", email.toLowerCase());

            console.log("User is now signed in.");
            alert("You are now signed in!");

            // Redirect to the home page
            window.location.href = "./blog-create-post-page.html";
        })
        .catch(error => {
            console.error("Error during login:", error);
            alert(error.message || "An error occurred. Please try again.");
        });
    }

    // Add event listener to the login form
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        login(); // Call the login function
    });
} else {
    console.log("Not on the account-login-page. Login script will not run.");
}