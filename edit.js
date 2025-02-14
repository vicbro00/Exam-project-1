document.addEventListener("DOMContentLoaded", () => {
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const posts = getPosts();
    const postToEdit = posts.find(post => post.id === postId);

    if (postToEdit) {
        document.getElementById('blogTitle').value = postToEdit.title;
        document.getElementById('blogContent').value = postToEdit.content;
        document.getElementById('publishDate').value = postToEdit.publishDate;

        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = postToEdit.image;
            previewImage.style.display = "block";
        }
    }

    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const title = document.getElementById('blogTitle').value;
            const content = document.getElementById('blogContent').value;
            const publishDate = document.getElementById('publishDate').value;
            const imageFile = document.getElementById('blogImage').files[0];

            if (!title || !content || !publishDate) {
                alert("Please fill in all required fields.");
                return;
            }

            const reader = new FileReader();
            if (imageFile) {
                reader.onload = (e) => {
                    updatePost(postId, title, content, e.target.result, publishDate);
                };
                reader.readAsDataURL(imageFile);
            } else {
                updatePost(postId, title, content, postToEdit.image, publishDate);
            }
        });
    }

    const updatePost = (id, title, content, image, publishDate) => {
        const posts = getPosts();
        const updatedPosts = posts.map(post => 
            post.id === id ? { ...post, title, content, image, publishDate } : post
        );
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        alert("Post updated successfully!");
        window.location.href = "index.html";
    };
});

document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem('email'); // Retrieve the email from localStorage

    if (email) {
        const signedInText = document.querySelector('main h1');
        if (signedInText) {
            signedInText.textContent = `Signed in as: ${email}`; // Update the text
        }
    } else {
        console.log('No user email found in localStorage.');
        window.location.href = 'account-login-page.html'; // Redirect to login page if no email is found
    }
});