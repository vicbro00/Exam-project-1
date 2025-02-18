//Wait for dom to load before running scripts
document.addEventListener("DOMContentLoaded", () => {
    //Function to generate ID
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

    //Function to save post to local storage
    const savePosts = (posts) => localStorage.setItem('posts', JSON.stringify(posts));

    //Function to retrieve post from local storage
    const getPosts = () => JSON.parse(localStorage.getItem('posts')) || [];

    //Create post form element
    const createPostForm = document.getElementById('createPostForm');
    if (!createPostForm) return;

    //Form input elements
    const blogTitle = document.getElementById('blogTitle');
    const blogContent = document.getElementById('blogContent');
    const blogImage = document.getElementById('blogImage');
    const publishDate = document.getElementById('publishDate');
    const previewImage = document.getElementById('previewImage');
    const confirmBtn = document.getElementById('confirmBtn');

    //Post ID
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    let originalPost = null;

    //If post ID is present, find the post in local storage
    if (postId) {
        const posts = getPosts();
        originalPost = posts.find(post => post.id === postId);

        //Fill in form with original post data
        if (originalPost) {
            blogTitle.value = originalPost.title;
            blogContent.value = originalPost.content;
            publishDate.value = originalPost.publishDate;
            previewImage.src = originalPost.image;
            previewImage.style.display = "block";
        }
    }

    //Handle image preview when a post is selected
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

    //Check if posts have been changed
    const arePostsEqual = (post1, post2) => {
        return post1.title === post2.title &&
               post1.content === post2.content &&
               post1.image === post2.image &&
               post1.publishDate === post2.publishDate;
    };

    //Form submission when confirm button is clicked
    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            const title = blogTitle.value;
            const content = blogContent.value;
            const publishDateValue = publishDate.value;
            const imageFile = blogImage ? blogImage.files[0] : null;

            //Show alert if form is not completely filled in
            if (!title || !content || !publishDateValue) {
                alert("Please fill in all fields.");
                return;
            }

            //Handle post saving
            const savePost = (imageBase64) => {
                const newPost = {
                    id: postId || generateId(),
                    title,
                    content,
                    image: imageBase64,
                    publishDate: publishDateValue
                };
                const posts = getPosts();

                //Check if forms have been changed
                if (postId && arePostsEqual(newPost, originalPost)) {
                    alert("No changes detected.");
                    return;
                }

                //Update post in local storage
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

            //Handle image files
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    savePost(e.target.result);
                };
                reader.readAsDataURL(imageFile);
            } else {
                savePost(originalPost ? originalPost.image : '');
            }
        });
    }
});