const jwt = localStorage.getItem('jwt');

if (jwt) {
    console.log("User is signed in.");
} else {
    console.log("User is not signed in.");
}

if (jwt) {
    hambMenuLoggedOut.style.display = 'none';
    hambMenuLoggedIn.style.display = 'block';
} else {
    hambMenuLoggedOut.style.display = 'block';
    hambMenuLoggedIn.style.display = 'none';
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://v2.api.noroff.dev/auth/login");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
            email: email,
            password: password,
        })
    );
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            try {
                const response = JSON.parse(this.responseText);
                if (response.data && response.data.accessToken) {
                    localStorage.setItem("jwt", response.data.accessToken);
                    console.log("User is now signed in."); // Log sign-in status
                    alert("You are now signed in!");
                    window.location.href = "./index.html";
                } else {
                    console.log("Login failed. User is not signed in."); // Log failed login
                    alert(response.message || "Login failed. Please check your credentials.");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                alert("An error occurred. Please try again.");
            }
        }
    };
    return false;
}