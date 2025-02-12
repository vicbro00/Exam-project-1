document.addEventListener("DOMContentLoaded", () => {
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    const renderPosts = () => {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        const posts = getPosts();
        blogGrid.innerHTML = posts.length
            ? posts.map(post => `
                <div class="post" data-id="${post.id}">
                    <h2>${post.title}</h2>
                    <img src="${post.image}" alt="Post Image" style="max-width: 200px;">
                    <p>${post.content}</p>
                    <button onclick="editPost('${post.id}')">Edit</button>
                    <button onclick="deletePost('${post.id}')">Delete</button>
                </div>
            `).join('')
            : "<p>No posts found.</p>";
    };

    window.editPost = id => {
        window.location.href = `blog-create-post-page.html?id=${id}`;
    };

    window.deletePost = id => {
        const posts = getPosts();
        const updatedPosts = posts.filter(post => post.id !== id);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        alert("Post deleted successfully!");
        renderPosts();
    };

    renderPosts();
});
