document.addEventListener("DOMContentLoaded", () => {
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    let sortOrder = 'newest';

    const renderPosts = () => {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        showSpinner();

        const posts = getPosts();
        const sortedPosts = sortPosts(posts);

        setTimeout(() => {
            blogGrid.innerHTML = sortedPosts.length
                ? sortedPosts.map(post => `
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

            hideSpinner();
        }, 500);
    };

    const showSpinner = () => {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'block';
        }
    };

    const hideSpinner = () => {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    };

    const isPostPage = () => window.location.pathname.includes('post.html');
    const isIndexPage = () => window.location.pathname.includes('index.html');
    const isEditPage = () => window.location.pathname.includes('edit.html');

    const truncateContent = (content, maxWords = 10) => {
        const words = content.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return content;
    };

    window.viewPost = id => {
        localStorage.setItem('selectedPostId', id);
        window.location.href = 'post.html';
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

    const renderSinglePost = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const posts = getPosts();
        const selectedPostId = localStorage.getItem('selectedPostId');
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

    const sortPosts = (posts) => {
        return posts.sort((a, b) => {
            const dateA = new Date(a.publishDate);
            const dateB = new Date(b.publishDate);
            return sortOrder === 'newest' ? dateA - dateB : dateB - dateA;
        });
    };

    const sortingBtn = document.getElementById('sortingBtn');
    if (sortingBtn) {
        sortingBtn.addEventListener('click', () => {
            sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
            renderPosts();
            console.log('Sort order:', sortOrder);
        });
    } else {
        console.error('Sorting button not found.');
    }

    if (window.location.pathname.includes('post.html')) {
        renderSinglePost('postContainer');
    } else {
        renderPosts();
    }
});