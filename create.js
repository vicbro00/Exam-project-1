document.addEventListener("DOMContentLoaded", () => {
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

    const savePosts = (posts) => localStorage.setItem('posts', JSON.stringify(posts));
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    const createPostForm = document.getElementById('createPostForm');
    if (!createPostForm) return;

    const blogTitle = document.getElementById('blogTitle');
    const blogContent = document.getElementById('blogContent');
    const blogImage = document.getElementById('blogImage');
    const publishDate = document.getElementById('publishDate');
    const previewImage = document.getElementById('previewImage');
    const confirmBtn = document.getElementById('confirmBtn');

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    let originalPost = null;

    if (postId) {
        const posts = getPosts();
        originalPost = posts.find(post => post.id === postId);

        if (originalPost) {
            blogTitle.value = originalPost.title;
            blogContent.value = originalPost.content;
            publishDate.value = originalPost.publishDate;
            previewImage.src = originalPost.image;
            previewImage.style.display = "block";
        }
    }

    if (blogImage && previewImage) {
        blogImage.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewImage.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            const title = blogTitle.value;
            const content = blogContent.value;
            const publishDateValue = publishDate.value;
            const imageFile = blogImage ? blogImage.files[0] : null;

            if (!title || !content || !publishDateValue) {
                alert("Please fill in all fields.");
                return;
            }

            const handlePostSave = (imageBase64) => {
                const newPost = { id: postId || generateId(), title, content, image: imageBase64, publishDate: publishDateValue };
                const posts = getPosts();

                if (postId && JSON.stringify(newPost) === JSON.stringify(originalPost)) {
                    alert("No changes detected.");
                    return;
                }

                if (postId) {
                    const updatedPosts = posts.map(post =>
                        post.id === postId ? newPost : post
                    );
                    savePosts(updatedPosts);
                } else {
                    posts.push(newPost);
                    savePosts(posts);
                }

                alert("Post saved successfully!");
                window.location.href = "post-edit.html";
            };

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    handlePostSave(e.target.result);
                };
                reader.readAsDataURL(imageFile);
            } else {
                handlePostSave(originalPost ? originalPost.image : '');
            }
        });
    }
});