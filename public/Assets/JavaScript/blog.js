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








//create posts that user sees with check whether admin or not 
function createPostElement(postData) {
    const post = document.createElement('div');
    post.className = 'post';
    post.setAttribute('data-category', postData.category);
    post.setAttribute('data-id', postData._id);
    post.setAttribute('data-full-text', postData.content); 

    let controlsHtml = ''; 
    if(isUserLoggedIn) { 
        controlsHtml = `
            <div class="post-controls" style="display:block;">
                <button onclick="editPost(this, event)">Edit</button>
                <button onclick="deletePost(this, event)">Delete</button>
            </div>
        `; 
    }

    const fullText = FormatText(postData.content); // Полный отформатированный и с ссылками
    let shortText = fullText.length > 50 ? fullText.substring(0, 50) : fullText; // Обрезаем текст до 50 символов
    postData.title = FormatText(postData.title);
    // Ищем первый перенос строки после 50 символов, чтобы завершить абзац
    const newlineIndex = fullText.indexOf('\n', 50);
    if (newlineIndex !== -1 && newlineIndex < shortText.length) {
        shortText = fullText.substring(0, newlineIndex + 1); // Включаем перенос строки в короткий текст
    }

    post.innerHTML = `
        <div class="post-all">
            <div class="post-box">
                <h2 class="post-title">${postData.title}</h2>
                <div class="post-content">
                    <p class="post-text" data-full-text="${fullText}"></p> <!-- Убрана замена на <br> -->
                </div>
            </div>
            <img class="post-image" src="${postData.image}" alt="${postData.title}">
        </div>
        ${controlsHtml}
    `;

    const postTextElement = post.querySelector('.post-text');
    postTextElement.innerHTML = shortText; // Добавляем короткий текст с сохранением переносов строк

    post.onclick = function() { openModal(this); };
    return post;
}












//change post 
function editPost(button, event) {
    event.stopPropagation();
    currentEditingPost = button.closest('.post');
    const post = button.closest('.post');
    const title = post.querySelector('h2').textContent;
    const content = post.querySelector('p').textContent;
    const imageElement = post.querySelector('img');
    
    const imageUrl = imageElement ? imageElement.src : '';
    window.currentEditingPostId = post.getAttribute('data-id'); 
    
    const clonedElement = post.cloneNode(true); 
    const fullText = post.getAttribute('data-full-text');  

    document.getElementById('postTitle').value = title;
    document.getElementById('postContent').value = fullText; 
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





//remove post 
function deletePost(button, event) {
    event.stopPropagation();
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



//delete image from post 
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

//work with image 
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


//check for add post press 
document.getElementById('addPostBtn').addEventListener('click', toggleForm);



//update post 
function toggleForm() {
    const form = document.getElementById('addPostForm');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}




//adding a new post 
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
            <button onclick="editPost(this, event)">Edit</button>
            <button onclick="deletePost(this, event)">Delete</button>
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


function FormatText(inputText)
{
    let replacedText = AddBold(inputText);
    replacedText = linkify(replacedText);

    return replacedText;

    
}



function linkify(inputText) {
    let replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

function AddBold(inputText)
{
    boldPattern = /\*\*(.*?)\*\*/g;
    let replacedText = inputText.replace(boldPattern, '<strong>$1</strong>');

    return replacedText;
}


//add post to the server 
function addPostToServer(postData) {
    const imageFile = document.getElementById('postImageFile').files[0];
    const formData = new FormData();
    formData.append('removeImage', window.removeImage ? 'true' : 'false');
    formData.append('postImage', imageFile);
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('category', postData.category);
    formData.append('postId', window.currentEditingPostId ? window.currentEditingPostId : "");

   
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










  
//show all posts 
 
  function displayPosts(posts) {
    const blogBox = document.querySelector('.blog-box');

    for(let post of posts) {
        const postElement = createPostElement(post);
        blogBox.appendChild(postElement);
        
        const textElement = postElement.querySelector('p.post-text');
        const fullText = textElement.getAttribute('data-full-text');
        ;
        const num = 50;
        if (fullText.split(" ").length > num) {
            textElement.textContent = fullText.split(" ", num).join(" ") + "...";
        }
    }
}
 








// if clicked on post 
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
    const modalBody = document.getElementById("modalBody");
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");

    const fullText = FormatText(postElement.getAttribute('data-full-text').replace(/\n/g, '<br>')); // Получаем полный текст с переносами строк и ссылкой
    // Заполняем модальное окно данными
    modalTitle.innerHTML = FormatText(postElement.querySelector('.post-title').outerHTML);
    if (postElement.querySelector('.post-image')) {
        modalImage.innerHTML = postElement.querySelector('.post-image').outerHTML;
    } else {
        modalImage.innerHTML = ''; // Очищаем, если изображения нет
    }
    modalBody.innerHTML = `<p>${fullText}</p>`; // Используем полный текст

    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}


//update post info with full
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


//close back to modal 

function closeFullPost() {
    const modal = document.getElementById('fullPostModal');
    modal.style.display = 'none';
}



// category buttons


  const buttons = document.querySelectorAll('.category-btn');

  function setActiveButton() {
    buttons.forEach(button => {
      button.classList.remove('active');
    });

    this.classList.add('active');
  }

  buttons.forEach(button => {
    button.addEventListener('click', setActiveButton);
  });