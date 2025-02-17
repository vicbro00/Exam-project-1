document.addEventListener("DOMContentLoaded", () => {
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    let sortOrder = 'newest';
    let searchTerm = '';

    const handleSearchInput = () => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                if (searchInput.value === '') {
                    searchInput.placeholder = '';
                }
            });

            searchInput.addEventListener('blur', () => {
                if (searchInput.value === '') {
                    searchInput.placeholder = 'Search...';
                }
            });

            searchInput.addEventListener('input', (e) => {
                searchTerm = e.target.value;
                renderPosts();
            });
        }
    };

    const renderPosts = () => {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        showSpinner();

        const posts = getPosts();
        const filteredPosts = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const sortedPosts = sortPosts(filteredPosts);

        setTimeout(() => {
            blogGrid.innerHTML = sortedPosts.length
                ? sortedPosts.map(post => `
                    <div class="post" data-id="${post.id}">
                        <h3>${post.title}</h3>
                        <img src="${post.image}" alt="Post Image">
                        ${isIndexPage() || isPostPage()
                            ? `<p>${isEditPage() ? truncateContent(post.content) : post.content}</p>`
                            : ''
                        }
                        ${isEditPage()
                            ? `
                                <button onclick="editPost('${post.id}')">Edit</button>
                                <button id="deleteBtn" onclick="deletePost('${post.id}')">Delete</button>
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

    window.editPost = (id) => {
        window.location.href = `blog-create-post-page.html?id=${id}`;
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
    const isEditPage = () => window.location.pathname.includes('post-edit.html');

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
            <div class="blog-grid">
                <h3>${selectedPost.title}</h3>
                <img src="${selectedPost.image}" alt="Post Image">
                <p>${selectedPost.content}</p>
                <p class="publish-date">Published on: ${new Date(selectedPost.publishDate).toLocaleDateString()}</p>
            </div>
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

    if (isIndexPage()) {
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

        handleSearchInput();
    } else {
        const sortingBtn = document.getElementById('sortingBtn');
        if (sortingBtn) {
            sortingBtn.style.display = 'none';
        }
    }

    if (window.location.pathname.includes('post.html')) {
        renderSinglePost('postContainer');
    } else {
        renderPosts();
    }
});