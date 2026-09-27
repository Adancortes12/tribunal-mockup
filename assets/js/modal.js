// =====================================================
// MODAL SYSTEM
// Manejo de ventanas emergentes
// =====================================================

export function openModal(content) {
  const modal = document.getElementById("modal");

  const modalContent = document.getElementById("modalContent");

  if (!modal || !modalContent) {
    console.error("Modal no encontrado");

    return;
  }

  modalContent.innerHTML = content;

  modal.classList.add("show");

  document.body.style.overflow = "hidden";
}

export function closeModal() {
  const modal = document.getElementById("modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("show");

  document.body.style.overflow = "";
}

export function setupModal() {
  const modal = document.getElementById("modal");

  if (!modal) {
    return;
  }

  // cerrar haciendo click fuera

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // cerrar con ESC

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
