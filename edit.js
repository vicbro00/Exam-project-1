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
                    <img src="${post.image}" alt="Post Image" style="max-width: 200px;">
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
        const posts = getPosts();
        const updatedPosts = posts.filter(post => post.id !== id);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        alert("Post deleted successfully!");
        renderPosts();
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