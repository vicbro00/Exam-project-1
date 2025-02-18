//Wait for dom to load before running scripts
document.addEventListener("DOMContentLoaded", () => {
    //Get posts from local storage
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    //Get post ID from url
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    //Retrieve posts from local storage
    const posts = getPosts();
    const postToEdit = posts.find(post => post.id === postId);

    //If post is found, fill in forms with already filled content
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

    //Get create post form element
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        //Adds submit event to form
        createPostForm.addEventListener("submit", (event) => {
            event.preventDefault();

            //Gets input form elements
            const title = document.getElementById('blogTitle').value;
            const content = document.getElementById('blogContent').value;
            const publishDate = document.getElementById('publishDate').value;
            const imageFile = document.getElementById('blogImage').files[0];

            //Validate form inputs
            if (!title || !content || !publishDate) {
                alert("Please fill in all required fields.");
                return;
            }

            //Create function to read image file
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

    //Function to update post in local storage
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

//Wait for dom to load before running scripts
document.addEventListener("DOMContentLoaded", () => {
    //Get user email from local storage
    const email = localStorage.getItem('email');

    //If user is signed in, update signed-in text
    if (email) {
        const signedInText = document.querySelector('main h1');
        if (signedInText) {
            signedInText.textContent = `Signed in as: ${email}`;
        }
    } else {
        //If user is not signed in, redirects to login page
        console.log('No user email found in localStorage.');
        window.location.href = 'account-login-page.html';
    }
});