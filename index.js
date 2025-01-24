const apiKey = "mglf122gi42j"
const apiURL = "https://v2.api.noroff.dev/blog/posts/blog"

//Account login form
const loginForm = document.getElementById('loginForm');
const responseMessage = document.getElementById('responseMessage')

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
  
    const formData = new FormData(loginForm);
    const jsonData = Object.fromEntries(formData);
  
    const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      };
    
    fetch(apiURL, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        responseMessage.textContent = `Success: ${JSON.stringify(data)}`;
      })
      .catch(error => {
        console.error('Error:', 'Error submitting the form. Please try again.');
      });
  });