const editMode = true; 
let currentEditingPost = null;
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

    fetch('/api/posts')
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            displayPosts(data.posts);
        } else {
            console.error("Ошибка при загрузке постов:", data.message);
        }
    })
    .catch(err => {
        console.error("Ошибка при выполнении запроса:", err);
    });



});


function displayPosts(posts) {
    const blogBox = document.querySelector('.blog-box');
    for(let post of posts) {
        const postElement = createPostElement(post);
        blogBox.appendChild(postElement);
    }
}

function createPostElement(postData) {
    const post = document.createElement('div');
    post.className = 'post';
    post.setAttribute('data-category', postData.category);
    post.innerHTML = `
        <h2 class="post-title">${postData.title}</h2>
        <img class="post-image" src="${postData.image}" alt="${postData.title}">
        <p class="post-text">${postData.content}</p>
        <div class="post-controls" style="display:block;">
            <button onclick="editPost(this)">Edit</button>
            <button onclick="deletePost(this)">Delete</button>
        </div>
    `;
    return post;
}

function editPost(button) {
    currentEditingPost = button.closest('.post');
    const post = button.closest('.post');
    const title = post.querySelector('h2').textContent;
    const content = post.querySelector('p').textContent;
    const imageElement = post.querySelector('img');

    const imageUrl = imageElement ? imageElement.src : '';
    
    window.currentEditingPost = post;

    document.getElementById('postTitle').value = title;
    document.getElementById('postContent').value = content; 
    const currentImageElement = document.getElementById('currentPostImage');
    const removeImageButton = document.getElementById('removeImageButton'); 
    if (imageUrl) {
    
        currentImageElement.src = imageUrl;
        currentImageElement.style.display = 'block';
        removeImageButton.style.display = 'block';  // Show the remove button
    } else {
        currentImageElement.style.display = 'none';
        removeImageButton.style.display = 'none';  // Hide the remove button
    }

    toggleForm();
}

function removeCurrentImage() {
    const currentImageElement = document.getElementById('currentPostImage');
    currentImageElement.src = '';
    currentImageElement.style.display = 'none';
    document.getElementById('postImageFile').value = ''; 
    const removeImageButton = document.getElementById('removeImageButton');
    removeImageButton.style.display = 'none';  
    removeImageButton
    if (window.currentEditingPost) {
        const postImageElement = window.currentEditingPost.querySelector('.post-image');
        if (postImageElement) {
            postImageElement.remove();
        }
    }
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






document.getElementById('postImageFile').addEventListener('change', function() {
    const currentImageElement = document.getElementById('currentPostImage');
    const removeImageButton = document.getElementById('removeImageButton'); 
    if (this.files && this.files[0]) {
        currentImageElement.src = URL.createObjectURL(this.files[0]);
        currentImageElement.style.display = 'block';
        removeImageButton.style.display = 'block'; 
    } else {
        currentImageElement.style.display = 'none';
        removeImageButton.style.display = 'none'; 
    }
});



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

    if (currentEditingPost) {
        currentEditingPost.querySelector('.post-title').textContent = title;
        if (imageHtml) {
            if (currentEditingPost.querySelector('.post-image')) {
                currentEditingPost.querySelector('.post-image').src = URL.createObjectURL(imageFile);
            } else {
                const newImage = document.createElement('img');
                newImage.classList.add('post-image');
                newImage.src = URL.createObjectURL(imageFile);
                currentEditingPost.insertBefore(newImage, currentEditingPost.querySelector('.post-text'));
            }
        }
        currentEditingPost.querySelector('.post-text').textContent = content;
        currentEditingPost.setAttribute('data-category', category);
        currentEditingPost = null;
    } else {
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
    }
    const postData = {
        title: title,
        content: content,
        category: category,
        imageUrl: (imageFile && typeof imageFile !== "undefined") ? URL.createObjectURL(imageFile) : null
    };
    addPostToServer(postData);
    
    toggleForm();
    const currentImageElement = document.getElementById('currentPostImage');
    currentImageElement.src = '';
    currentImageElement.style.display = 'none';
    document.getElementById('postTitle').value = "";
    document.getElementById('postImageFile').value = "";
    document.getElementById('postContent').value = "";
}




function addPostToServer(postData) {
    fetch('/api/addpost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Пост добавлен успешно:", data.message);
        } else {
            console.error("Ошибка при добавлении поста:", data.message);
        }
    })
    .catch(error => {
        console.error("Произошла ошибка при отправке запроса:", error);
    });
}