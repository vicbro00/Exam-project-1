const newURL = 'https://v2.api.noroff.dev/blog/posts/v';

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
        displayBlogPosts(data.data);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById('blogPostsContainer');
    if (!blogPostsContainer) return;

    blogPostsContainer.innerHTML = '';

    posts.forEach(post => {
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

fetchBlogPosts();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmljQiIsImVtYWlsIjoidmljYnJvMDI0NThAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzkzMDYyMDV9.do_r_gfOnK_21KipYndjC_QtQhlmnk8hUzTjCk33dj8'; // Replace with your actual token

const response = fetch(newURL, {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
});