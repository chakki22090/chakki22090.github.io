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

function editPost(button) {
    const post = button.closest('.post');
    const title = post.querySelector('h2').textContent;
    const content = post.querySelector('p').textContent;

    // Теперь можно редактировать контент. Например, отображая форму с текущим содержимым поста.
    // Далее ты можешь использовать AJAX, чтобы сохранить изменения на сервере.
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
