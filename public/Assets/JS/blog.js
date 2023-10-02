const editMode = true; 

if (editMode) {
    const postOptions = document.querySelectorAll(".post-options");
    postOptions.forEach(option => option.addEventListener('click', function() {
        const controls = this.querySelector('.post-controls');
        if(controls.style.display === "block") {
            controls.style.display = "none";
        } else {
            controls.style.display = "block";
        }
    }));
}


document.addEventListener("DOMContentLoaded", function() {
    const categoryButtons = document.querySelectorAll(".category-btn");
    const allPosts = document.querySelectorAll(".post");
    const heading = document.querySelector(".blog-section h2");

    categoryButtons.forEach(button => {
        button.addEventListener("click", function() {
            const category = this.getAttribute("data-category");
            const allPosts = document.querySelectorAll(".post"); // обновляем список постов
    
            allPosts.forEach(post => {
                if (post.getAttribute("data-category") === category) {
                    post.style.display = "block";
                } else {
                    post.style.display = "none";
                }
            });
    
            if (category === "digital-strategy") {
                heading.textContent = "Digital Strategy Posts";
            } else if (category === "journalism") {
                heading.textContent = "Journalism Posts";
            }
        });
    });
    
    document.querySelector('.category-btn[data-category="digital-strategy"]').click();
});



function editPost(button) {
    const post = button.closest('.post');
    const title = post.querySelector('h2').textContent;
    const content = post.querySelector('p').textContent;
    const imageUrl = post.querySelector('img').src;
    
    document.getElementById('postTitle').value = title;
    document.getElementById('postContent').textContent = content; 

    const currentImageElement = document.getElementById('currentPostImage');
    if (imageUrl) {
        currentImageElement.src = imageUrl;
        currentImageElement.style.display = 'block';
    } else {
        currentImageElement.style.display = 'none';
    }

    toggleForm();
}

function removeCurrentImage() {
    const currentImageElement = document.getElementById('currentPostImage');
    currentImageElement.src = '';
    currentImageElement.style.display = 'none';
    document.getElementById('postImageFile').value = ''; // это сбросит файл изображения, если он был выбран
}
function deletePost(button) {
    const post = button.closest('.post');
    post.remove();
    // Далее ты можешь использовать AJAX, чтобы уведомить сервер о удалении поста.
}

function hidePost(button) {
    const post = button.closest('.post');
    post.style.display = "none";
    // Далее ты можешь использовать AJAX, чтобы уведомить сервер о том, что пост скрыт.
}

function toggleHiddenPosts() {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        if(post.style.display === "none") {
            post.style.display = "block";
        } else {
            post.style.display = "none";
        }
    });
}








document.getElementById('addPostBtn').addEventListener('click', toggleForm);

function toggleForm() {
    const form = document.getElementById('addPostForm');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}
function addPost() {
    const title = document.getElementById('postTitle').value;
    const imageFile = document.getElementById('postImageFile').files[0]; 
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;

    let imageHtml = '';
    if (imageFile) {
        imageHtml = `<img class="post-image" src="${URL.createObjectURL(imageFile)}" alt="${title}">`;
    }

    const post = document.createElement('div');
    post.className = 'post';
    post.setAttribute('data-category', category);
    post.innerHTML = `
        <h2 class="post-title">${title}</h2>
        ${imageHtml}
        <p class="post-text">${content}</p>
        <div class="post-controls" style="display:block;">
            <button onclick="editPost(this)">Edit</button>
            <button onclick="deletePost(this)">Delete</button>
        </div>
    `;

    document.querySelector('.blog-box').appendChild(post);
    toggleForm();

    document.getElementById('postTitle').value = "";
document.getElementById('postImageFile').value = "";
document.getElementById('postContent').value = "";

}


