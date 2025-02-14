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

    if (window.location.pathname.includes('post.html')) {
        renderSinglePost('postContainer');
    } else {
        renderPosts();
    }
});

function sortPosts(posts) {
    return posts.sort((a, b) => {
        const dateA = new Date(a.publishDate);
        const dateB = new Date(b.publishDate);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
}

async function fetchBlogPosts() {
    try {
        const response = await fetch(newURL, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Blog posts:', data);

        const sortedPosts = sortPosts(data.data);
        displayBlogPosts(sortedPosts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById('blogPostsContainer');
    if (!blogPostsContainer) return;

    const sortedPosts = sortPosts(posts);

    blogPostsContainer.innerHTML = '';

    sortedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-post');

        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;
        postElement.appendChild(titleElement);

        const bodyElement = document.createElement('p');
        bodyElement.textContent = post.body;
        postElement.appendChild(bodyElement);

        if (post.media && post.media.url) {
            const mediaElement = document.createElement('img');
            mediaElement.src = post.media.url;
            mediaElement.alt = post.media.alt || 'Blog post image';
            postElement.appendChild(mediaElement);
        }

        blogPostsContainer.appendChild(postElement);
    });
}

document.addEventListener('DOMContentLoaded', fetchBlogPosts);