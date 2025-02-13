let sortOrder = 'newest';

function sortPosts(posts) {
    return posts.sort((a, b) => {
        const dateA = new Date(a.publishDate);
        const dateB = new Date(b.publishDate);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
}

function toggleSortOrder() {
    sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    const sortButton = document.getElementById('sortingBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (loadingSpinner) loadingSpinner.style.display = 'block';

    sortButton.textContent = `Sort by ${sortOrder === 'newest' ? 'Oldest' : 'Newest'}`;
    sortButton.innerHTML += ' <i class="fa-solid fa-arrow-down"></i>';

    setTimeout(async () => {
        await fetchBlogPosts();
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }, 500);
}


document.getElementById('sortingBtn').addEventListener('click', () => {
    const sortButton = document.getElementById('sortingBtn');
    sortButton.classList.toggle('flipped');
    toggleSortOrder();
});