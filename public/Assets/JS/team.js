document.addEventListener("DOMContentLoaded", function() {
    const openModalButtons = document.querySelectorAll("[data-modal-target]");
    const closeModalButtons = document.querySelectorAll(".close-button");
    const overlay = document.getElementById("overlay");

    openModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            closeModal(modal);
        });
    });

    function openModal(modal) {
        if (modal == null) return;
        modal.style.display = "block";
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.style.display = "none";
    }
});
