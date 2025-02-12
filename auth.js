var jwt = localStorage.getItem("jwt");
if (jwt != null) {
  window.location.href = "./index.html";
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://v2.api.noroff.dev");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
        email: email,
        password: password,
      })
    );
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          console.log("Raw response:", this.responseText); // Log the raw response
          try {
            const objects = JSON.parse(this.responseText);
            console.log(objects);
            if (objects["status"] == "ok") {
              localStorage.setItem("jwt", objects["accessToken"]);
              alert("You are now signed in!");
              setTimeout(function () {
                window.location.href = "./index.html";
              }, 100);
            } else {
              alert(objects["message"]);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("An error occurred. Please try again.");
          }
        }
    };
    return false;
}

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "./account-login-page.html";
}