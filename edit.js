document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://v2.api.noroff.dev/blog/posts';
    const token = localStorage.getItem('accessToken'); // Retrieve the access token
    const signedInAs = document.getElementById('signedInAs');
    const blogGrid = document.getElementById('blogGrid');
    const createPostForm = document.getElementById('createPostForm');
    const toggleCreatePostForm = document.getElementById('toggleCreatePostForm');
    const createPostBtn = document.getElementById('createPostBtn');
    const signOutBtn = document.getElementById('signOutBtn');

    // Check if the user is logged in
    if (!token) {
        alert('You must be logged in to access this page.');
        window.location.href = 'account-login-page.html'; // Redirect to the correct login page
        return;
    }

    // Display the logged-in user's name
    const userName = localStorage.getItem('userName');
    if (signedInAs) {
        signedInAs.textContent = `Signed in as: ${userName}`;
    }

    // Fetch and display the user's blog posts
    const fetchPosts = async () => {
        try {
            const response = await fetch(`${apiUrl}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                displayPosts(data.data);
            } else {
                console.error('Failed to fetch posts:', data.errors);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Display posts in the blog grid
    const displayPosts = (posts) => {
        if (!blogGrid) return; // Ensure blogGrid exists
        blogGrid.innerHTML = ''; // Clear existing posts

        // Sort posts by creation date (newest first)
        posts.sort((a, b) => new Date(b.created) - new Date(a.created));

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');
            postElement.innerHTML = `
                <img src="${post.media?.url || ''}" alt="${post.media?.alt || ''}">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <button onclick="editPost('${post.id}')">Edit</button>
                <button onclick="deletePost('${post.id}')">Delete</button>
            `;
            blogGrid.appendChild(postElement);
        });
    };

    // Toggle the create post form
    if (toggleCreatePostForm && createPostForm) {
        toggleCreatePostForm.addEventListener('click', () => {
            createPostForm.style.display = createPostForm.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Create a new post
    if (createPostBtn) {
        createPostBtn.addEventListener('click', async () => {
            const title = document.getElementById('postTitle').value;
            const body = document.getElementById('postContent').value;
            const mediaUrl = document.getElementById('postImage').value;

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
                    fetchPosts(); // Refresh the list of posts
                    if (createPostForm) {
                        createPostForm.style.display = 'none'; // Hide the form
                    }
                } else {
                    console.error('Failed to create post:', data.errors);
                }
            } catch (error) {
                console.error('Error creating post:', error);
            }
        });
    }

    // Edit a post
    window.editPost = async (postId) => {
        const newTitle = prompt('Enter the new title:');
        const newBody = prompt('Enter the new content:');
        if (newTitle && newBody) {
            const postData = {
                title: newTitle,
                body: newBody,
            };
            try {
                const response = await fetch(`${apiUrl}/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(postData),
                });
                if (response.ok) {
                    alert('Post updated successfully!');
                    fetchPosts(); // Refresh the list of posts
                } else {
                    console.error('Failed to update post:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating post:', error);
            }
        }
    };

    // Delete a post
    window.deletePost = async (postId) => {
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`${apiUrl}/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    alert('Post deleted successfully!');
                    fetchPosts(); // Refresh the list of posts
                } else {
                    console.error('Failed to delete post:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    // Sign out
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userName');
            window.location.href = 'account-login-page.html';
        });
    }

    // Fetch posts when the page loads
    fetchPosts();
});

console.log('Token:', token);
console.log('Redirecting to login page...');