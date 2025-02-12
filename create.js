document.addEventListener("DOMContentLoaded", () => {
    const confirmBtn = document.querySelector('.confirm-btn');
    const blogTitle = document.getElementById('blogTitle');
    const blogContent = document.getElementById('blogContent');
    const blogImage = document.getElementById('blogImage');

    confirmBtn.addEventListener('click', () => {
        const title = blogTitle.value;
        const content = blogContent.value;
        const image = blogImage.value;

        if (title && content && image) {
            const newPost = {
                title,
                content,
                image,
                id: Date.now(),
            };

            let posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts.push(newPost);
            localStorage.setItem('posts', JSON.stringify(posts));

            window.location.href = 'post-edit.html';
        } else {
            alert('Please fill in all the fields');
        }
    });
});