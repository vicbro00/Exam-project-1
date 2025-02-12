document.addEventListener("DOMContentLoaded", () => {
    const blogGrid = document.getElementById('blogGrid');
    
    loadPosts();

    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];

        if (posts.length === 0) {
            blogGrid.innerHTML = '<p>No posts available. Create one!</p>';
        }

        posts.forEach(post => {
            displayPost(post);
        });
    }

    function displayPost(post) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.dataset.id = post.id;

        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <img src="${post.image}" alt="Blog image">
            <p>${post.content}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        const editBtn = postElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            editPost(post.id);
        });

        const deleteBtn = postElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deletePost(post.id);
            postElement.remove();
        });

        blogGrid.appendChild(postElement);
    }

    function editPost(postId) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const post = posts.find(post => post.id === postId);

        window.location.href = `blog-create-post-page.html?edit=${postId}`;
    }

    function deletePost(postId) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts = posts.filter(post => post.id !== postId);
        localStorage.setItem('posts', JSON.stringify(posts));
    }
});
