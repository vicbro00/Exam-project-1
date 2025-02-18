//JWT token and user email
const jwt = localStorage.getItem('jwt');
const userEmailDisplay = document.getElementById("userEmailDisplay");
const userEmail = localStorage.getItem('email');

//Check if current page is post-edit page
if (window.location.pathname.includes("post-edit.html")) {
    //If user is signed in, show logged-in menu
    if (jwt) {
        console.log("User is signed in.");
        document.getElementById("email").textContent = `Signed in as: ${userEmail}`;
        hambMenuLoggedOut.style.display = 'none';
        hambMenuLoggedIn.style.display = 'block';
    } else {
        //If user is not signed in, show logged-out menu
        console.log("User is not signed in.");
        document.getElementById("email").textContent = "Not signed in";
        hambMenuLoggedOut.style.display = 'block';
        hambMenuLoggedIn.style.display = 'none';
    }
}

//If user email display element exists, update the content based on sign-in status
if (userEmailDisplay) {
    if (jwt && userEmail) {
        userEmailDisplay.textContent = userEmail;
    } else {
        userEmailDisplay.textContent = "Not signed in";
    }
}

//Function to login user
function login() {
    //Get email and password from input fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    //Create new xmlhttp request object
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://v2.api.noroff.dev/auth/login");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    //Send login request with email and password
    xhttp.send(JSON.stringify({email: email,password: password,}));

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            try {
                const response = JSON.parse(this.responseText);
                if (response.data && response.data.accessToken) {
                    //If login is successful, store the content in local storage
                    localStorage.setItem("jwt", response.data.accessToken);
                    localStorage.setItem("email", email);
                    console.log("User is now signed in.");
                    alert("You are now signed in!");
                    //Redirects to home page
                    window.location.href = "./index.html";
                } else {
                    //If login is unsuccessful, display error message
                    console.log("Login failed. User is not signed in.");
                    alert(response.message || "Login failed. Please check your credentials.");
                }
            } catch (error) {
                //Handle any error occurence
                console.error("Error parsing JSON:", error);
                alert("An error occurred. Please try again.");
            }
        }
    };
    return false;
}