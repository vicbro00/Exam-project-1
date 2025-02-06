document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://v2.api.noroff.dev/blog/posts';
    const token = localStorage.getItem('accessToken'); // Retrieve the access token
    const signedInAs = document.getElementById('signedInAs');
    const createPostForm = document.getElementById('createPost');
    const confirmBtn = document.querySelector('.confirm-btn');

    // Check if the user is logged in
    if (!token) {
        alert('You must be logged in to access this page.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    // Display the logged-in user's name
    const userName = localStorage.getItem('userName');
    signedInAs.textContent = `Signed in as: ${userName}`;

    // Handle form submission
    confirmBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const title = document.getElementById('blogTitle').value;
        const body = document.getElementById('blogContent').value;
        const mediaUrl = document.getElementById('blogImage').value;

        // Validate required fields
        if (!title || !body) {
            alert('Please fill in the title and content.');
            return;
        }

        const postData = {
            title,
            body,
            media: mediaUrl ? { url: mediaUrl, alt: 'Blog post image' } : undefined,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Post created successfully!');
                // Redirect to the post-edit.html page
                window.location.href = 'post-edit.html';
            } else {
                console.error('Failed to create post:', data.errors);
                alert('Failed to create post. Please try again.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred. Please try again.');
        }
    });
});