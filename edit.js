document.addEventListener("DOMContentLoaded", () => {
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    const renderPosts = () => {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;
    
        const posts = getPosts();
        blogGrid.innerHTML = posts.length
            ? posts.map(post => `
                <div class="post" data-id="${post.id}">
                    <h3>${post.title}</h3>
                    <img src="${post.image}" alt="Post Image">
                    ${isIndexPage() 
                        ? ''
                        : `<p>${isEditPage() ? truncateContent(post.content) : post.content}</p>`
                    }
                    ${isEditPage() 
                        ? `
                            <button onclick="editPost('${post.id}')">Edit</button>
                            <button onclick="deletePost('${post.id}')">Delete</button>
                        `
                        : isPostPage() 
                            ? ''
                            : `<button onclick="viewPost('${post.id}')">Read More</button>`
                    }
                </div>
            `).join('')
            : "<p>No posts found.</p>";
    };

    function isPostPage() {
        return window.location.pathname.includes('post.html');
    }

    function isIndexPage() {
        return window.location.pathname.includes('index.html');
    }

    function truncateContent(content, maxWords = 10) {
        const words = content.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return content;
    }

    window.viewPost = id => {
        localStorage.setItem('selectedPostId', id);
        window.location.href = 'post.html';
    };

    window.editPost = id => {
        window.location.href = `blog-create-post-page.html?id=${id}`;
    };

    window.deletePost = id => {
        const isConfirmed = confirm("Are you sure you want to delete this post? This action cannot be undone.");
        if (isConfirmed) {
            const posts = getPosts();
            const updatedPosts = posts.filter(post => post.id !== id);
            localStorage.setItem('posts', JSON.stringify(updatedPosts));
            alert("Post deleted successfully!");
            renderPosts();
        }
    };

    renderPosts();
});

function isEditPage() {
    return window.location.pathname.includes('edit.html');
}

window.editPost = id => {
    window.location.href = `edit.html?id=${id}`;
};

window.deletePost = id => {
    const posts = getPosts();
    const updatedPosts = posts.filter(post => post.id !== id);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    alert("Post deleted successfully!");
    renderPosts();
};

document.addEventListener("DOMContentLoaded", () => {
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];
    const selectedPostId = localStorage.getItem('selectedPostId');

    const renderSinglePost = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const posts = getPosts();
        const selectedPost = posts.find(post => post.id === selectedPostId);

        if (selectedPost) {
            container.innerHTML = `
                <h3>${selectedPost.title}</h3>
                <img src="${selectedPost.image}" alt="Post Image">
                <p>${selectedPost.content}</p>
                <p class="publish-date">Published on: ${new Date(selectedPost.publishDate).toLocaleDateString()}</p>
            `;
        } else {
            container.innerHTML = "<p>Post not found.</p>";
        }
    };

    if (window.location.pathname.includes('post.html')) {
        renderSinglePost('postContainer');
    }
});

// Add this block for the create/edit post page functionality
document.addEventListener("DOMContentLoaded", () => {
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    // Get the post ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // Fetch the post data
    const posts = getPosts();
    const postToEdit = posts.find(post => post.id === postId);

    // If a post is found, pre-fill the form fields
    if (postToEdit) {
        document.getElementById('blogTitle').value = postToEdit.title;
        document.getElementById('blogContent').value = postToEdit.content;
        document.getElementById('publishDate').value = postToEdit.publishDate;

        // Display the existing image
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = postToEdit.image;
            previewImage.style.display = "block";
        }
    }

    // Handle form submission for updating the post
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const title = document.getElementById('blogTitle').value;
            const content = document.getElementById('blogContent').value;
            const publishDate = document.getElementById('publishDate').value;
            const imageFile = document.getElementById('blogImage').files[0];

            if (!title || !content || !publishDate) {
                alert("Please fill in all required fields.");
                return;
            }

            // If no new image is uploaded, keep the existing one
            const reader = new FileReader();
            if (imageFile) {
                reader.onload = (e) => {
                    updatePost(postId, title, content, e.target.result, publishDate);
                };
                reader.readAsDataURL(imageFile);
            } else {
                updatePost(postId, title, content, postToEdit.image, publishDate);
            }
        });
    }

    // Function to update the post
    const updatePost = (id, title, content, image, publishDate) => {
        const posts = getPosts();
        const updatedPosts = posts.map(post => 
            post.id === id ? { ...post, title, content, image, publishDate } : post
        );
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        alert("Post updated successfully!");
        window.location.href = "index.html"; // Redirect to the main page
    };
});