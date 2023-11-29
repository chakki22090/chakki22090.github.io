function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; 

    modal.querySelector('.modal-overlay').addEventListener('click', function() {
        closeModal(modalId);
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && modal.style.display === 'block') {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto'; 
    }
    
}
