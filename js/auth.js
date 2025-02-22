//Check if this is the login page
if (window.location.pathname.includes("https://vicbro00.github.io/Exam-project-1/account/login.html")) {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        login();
    });
} else {
    console.log("Not on the login page. Login script will not run.");
}

//Handles login process
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    //Check if email and password are provided
    if (!email || !password) {
        alert("Please fill in both email and password fields.");
        return;
    }

    const loginData = { email, password };

    //Sends a POST request to the api
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

        window.location.href = "https://vicbro00.github.io/Exam-project-1/index.html";
    })
    .catch(error => {
        console.error("Error during login:", error);
        alert(error.message || "An error occurred. Please try again.");
    });
}

//Adds event listener when document is loaded
document.addEventListener("DOMContentLoaded", () => {
    //Checks if this is the register page
    if (window.location.pathname.includes("https://vicbro00.github.io/Exam-project-1/account/register.html")) {
        const signUpBtn = document.getElementById("signUpBtn");
        const message = document.getElementById("message");

        signUpBtn.addEventListener("click", function (event) {
            event.preventDefault();
            registerUser();
        });

        //Function to register a new user
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
                window.location.href = "https://vicbro00.github.io/Exam-project-1/account/login.html";
            })
            .catch(error => {
                console.error("Error during registration:", error);
                message.textContent = error.message || "An error occurred. Please try again.";
            });
        }
    }
});

//Adds event listener when document is loaded
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;

    if (currentPage.includes("/post/create.html") || currentPage.includes("/post/edit.html")) {
        const userEmail = localStorage.getItem("email");
        document.getElementById("email").textContent = userEmail || "Not signed in";
    }
});