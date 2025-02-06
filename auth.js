document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const signUpBtn = document.getElementById('signUpBtn');
    const message = document.getElementById('message');
    const loggedOutMenu = document.querySelector('.hamb-menu-logged-out');
    const loggedInMenu = document.querySelector('.hamb-menu-logged-in');
    const signOutBtn = document.getElementById('signOutBtn');

    // Function to handle user registration
    if (signUpBtn) {
        signUpBtn.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent the form from submitting the traditional way

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const bio = document.getElementById('bio').value;
            const avatarAlt = document.getElementById('avatarAlt').value;
            const bannerUrl = document.getElementById('bannerUrl').value;
            const bannerAlt = document.getElementById('bannerAlt').value;

            const userData = {
                name,
                email,
                password,
                bio: bio || undefined, // Omit if empty
                avatar: avatarAlt ? { alt: avatarAlt } : undefined, // Omit if empty
                banner: bannerUrl ? { url: bannerUrl, alt: bannerAlt } : undefined, // Omit if empty
            };

            console.log('User Data:', userData); // Debugging

            try {
                // Step 1: Register the user
                const registerResponse = await fetch('https://v2.api.noroff.dev/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const registerData = await registerResponse.json();

                if (registerResponse.ok) {
                    // Registration successful
                    message.textContent = 'Registration successful! Logging you in...';
                    message.style.color = 'green';

                    // Step 2: Log in the user
                    const loginResponse = await fetch('https://v2.api.noroff.dev/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const loginData = await loginResponse.json();

                    if (loginResponse.ok) {
                        // Login successful
                        const accessToken = loginData.data.accessToken;
                        const userName = loginData.data.name;

                        // Store the access token and user name in localStorage
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('userName', userName);

                        // Update the UI to show the logged-in menu
                        loggedOutMenu.style.display = 'none';
                        loggedInMenu.style.display = 'block';

                        // Redirect to the home page
                        window.location.href = 'index.html'; // Replace with your home page URL
                    } else {
                        // Login failed
                        message.textContent = loginData.errors?.[0]?.message || 'Login failed. Please try again.';
                        message.style.color = 'red';
                    }
                } else {
                    // Registration failed
                    if (registerResponse.status === 409) {
                        message.textContent = 'This email is already registered. Please use a different email.';
                    } else {
                        message.textContent = registerData.errors?.[0]?.message || 'Registration failed. Please try again.';
                    }
                    message.style.color = 'red';
                }
            } catch (error) {
                console.error('Error during registration:', error);
                message.textContent = 'An error occurred. Please try again.';
                message.style.color = 'red';
            }
        });
    }

    // Function to handle sign out
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            // Clear the authentication state
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userName');

            // Update the UI to show the logged-out menu
            loggedInMenu.style.display = 'none';
            loggedOutMenu.style.display = 'block';

            // Optionally, redirect to the login page
            window.location.href = 'login.html'; // Redirect to login page (adjust as needed)
        });
    }

    // Check if the user is already logged in
    const isLoggedIn = localStorage.getItem('accessToken') !== null;
    if (isLoggedIn) {
        // User is logged in
        loggedOutMenu.style.display = 'none';
        loggedInMenu.style.display = 'block';
        if (registerForm) {
            registerForm.style.display = 'none'; // Hide the form if already logged in
        }
    } else {
        // User is not logged in
        loggedOutMenu.style.display = 'block';
        loggedInMenu.style.display = 'none';
        if (registerForm) {
            registerForm.style.display = 'block'; // Show the form if not logged in
        }
    }
});