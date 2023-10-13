let isUserLoggedIn = false;
fetch('/api/isUserLoggedIn')
    .then(response => response.json())
    .then(data => {
        isUserLoggedIn = data.loggedIn;
        if (!isUserLoggedIn) {
            const controlButtons = document.querySelectorAll(".post-controls, #addPostBtn,.logout-link");
            
            controlButtons.forEach(button => {
                button.style.display = "none";
            });
        }
        else
        {
            document.querySelector('.logout-link').style.display = 'block';
        }
    })
    .catch(err => {
        console.error("Error doing request:", err);
    });




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

    const userIsLoggedIn = true;  
  
    if (!userIsLoggedIn) {
        const controlButtons = document.querySelectorAll(".post-controls, #addPostBtn");
        controlButtons.forEach(button => {
            button.style.display = "none";
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener("click", function() {
            const category = this.getAttribute("data-category");
            const allPosts = document.querySelectorAll(".post"); 
    
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

        const addPostButton = document.getElementById('addPostBtn');
        if (!editMode) { 
            addPostButton.style.display = 'none';
        }
    });
    

    fetch('/api/posts')
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            displayPosts(data.posts);
            document.querySelector('.category-btn[data-category="digital-strategy"]').click();
        } else {
            console.error("Error updating posts:", data.message);
        }
    })
    .catch(err => {
        console.error("Error doing request:", err);
    });



});
function displayPosts(posts) {
    const blogBox = document.querySelector('.blog-box');
    for(let post of posts) {
        const postElement = createPostElement(post);
        const fullText = postElement.querySelector('p').textContent;
        if (fullText.split(" ").length > 30) {
            postElement.text = fullText.split(" ", 300).join(" ") + "...";
        }
        blogBox.appendChild(postElement);
    }
}

function createPostElement(postData) {
    const post = document.createElement('div');
    post.className = 'post';
    post.setAttribute('data-category', postData.category);
    post.setAttribute('data-id', postData._id);
    
    let controlsHtml = ''; 
    if(isUserLoggedIn) { 
        controlsHtml = `
            <div class="post-controls" style="display:block;">
                <button onclick="editPost(this)">Edit</button>
                <button onclick="deletePost(this)">Delete</button>
            </div>
        `; 
    }

    let fullText = postData.content;
    
    post.innerHTML = `
        <div class="post-box">
            <h2 class="post-title">${postData.title}</h2>
            <div class="post-content">
                <p class="post-text" data-full-text="${fullText}">${fullText}</p>
                <img class="post-image" src="${postData.image}" alt="${postData.title}">
            </div>
            <p class="post-date">${new Date(postData.date).toLocaleDateString()}</p> 
        </div>
        ${controlsHtml}
    `;

    post.onclick = function() { openModal(this); }; // Тут можешь передать fullText, если нужно
    return post;
}



function editPost(button) {
    currentEditingPost = button.closest('.post');
    const post = button.closest('.post');
    const title = post.querySelector('h2').textContent;
    const content = post.querySelector('p').textContent;
    const imageElement = post.querySelector('img');
    const date = post.querySelector('.post-date').textContent;
    document.getElementById('postDate').value = date;
    
    const imageUrl = imageElement ? imageElement.src : '';
    window.currentEditingPostId = post.getAttribute('data-id'); 
    

    document.getElementById('postTitle').value = title;
    document.getElementById('postContent').value = content; 
    const currentImageElement = document.getElementById('currentPostImage');
    const removeImageButton = document.getElementById('removeImageButton'); 
    if (imageUrl) {
    
        currentImageElement.src = imageUrl;
        currentImageElement.style.display = 'block';
        removeImageButton.style.display = 'block';  
    } else {
        currentImageElement.style.display = 'none';
        removeImageButton.style.display = 'none';  
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

    if (window.currentEditingPost) {
        const postImageElement = window.currentEditingPost.querySelector('.post-image');
        if (postImageElement) {
            postImageElement.remove();
        }
    }

    window.removeImage = true;  
}
function deletePost(button) {
    const postId = button.closest('.post').getAttribute('data-id');
    fetch(`/api/deletepost/${postId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            button.closest('.post').remove();
        } else {
            console.error('Error deleting post');
        }
    })
    .catch(error => console.error('Error:', error));
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
    const date = document.getElementById('postDate').value;
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
        date: date,
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
    const imageFile = document.getElementById('postImageFile').files[0];
    const formData = new FormData();
    formData.append('removeImage', window.removeImage ? 'true' : 'false');
    formData.append('postImage', imageFile);
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('category', postData.category);
    formData.append('postId', window.currentEditingPostId ? window.currentEditingPostId : "");
    formData.append('date', postData.date);

   
    const postUrl = window.currentEditingPostId ? `/api/editpost/${window.currentEditingPostId}` : '/api/addpost';

    fetch(postUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Post added:", data.message);
        } else {
            console.error("Error Adding post:", data.message);
        }
    })
    .catch(error => {
        console.error("Error while sending request:", error);
    });
}

function viewFullPost(postData) {
    const modal = document.getElementById('fullPostModal');
    const modalContent = modal.querySelector('.full-post-content');
    
    modalContent.innerHTML = `
        <h2 class="post-title">${postData.title}</h2>
        <img class="post-image" src="${postData.image}" alt="${postData.title}">
        <p class="post-text">${postData.content}</p>
    `;
    
    modal.style.display = 'block';
}
function closeFullPost() {
    const modal = document.getElementById('fullPostModal');
    modal.style.display = 'none';
}

const posts = document.querySelectorAll('.post');
posts.forEach(post => {
    post.addEventListener('click', function() {
        const postData = {
            title: post.querySelector('.post-title').textContent,
            image: post.querySelector('.post-image') ? post.querySelector('.post-image').src : '',
            content: post.querySelector('.post-text').textContent
        };
        
        viewFullPost(postData);
    });
});



function openModal(postElement) {
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];
    const modalBody = document.getElementById("modalBody");
    modal.scrollTo(0,0);
    modalBody.innerHTML = postElement.innerHTML;  // копируем содержимое поста в модальное окно
    
    // Показываем модальное окно
    modal.style.display = "block";
    
    // Закрыть модальное окно
    span.onclick = function() {
      modal.style.display = "none";
    }
    
    // Закрыть на клик вне
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }
  