document.addEventListener("DOMContentLoaded", () => {
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

    const savePosts = (posts) => localStorage.setItem('posts', JSON.stringify(posts));
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    const createPostForm = document.getElementById('createPostForm');
    if (!createPostForm) return;

    const blogTitle = document.getElementById('blogTitle');
    const blogContent = document.getElementById('blogContent');
    const blogImage = document.getElementById('blogImage');
    const previewImage = document.getElementById('previewImage');
    const confirmBtn = document.getElementById('confirmBtn');

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
            const imageFile = blogImage ? blogImage.files[0] : null;

            if (!title || !content || !imageFile) {
                alert("Please fill in all fields and select an image.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageBase64 = e.target.result;
                const newPost = { id: generateId(), title, content, image: imageBase64 };
                const posts = getPosts();
                posts.push(newPost);
                savePosts(posts);
                alert("Post created successfully!");
                window.location.href = "post-edit.html";
            };
            reader.readAsDataURL(imageFile);
        });
    }
});