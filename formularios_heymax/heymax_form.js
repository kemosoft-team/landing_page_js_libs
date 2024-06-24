
const btnsOpenFormFGTS = document.querySelectorAll(".btn-open-formFGTS");
const backgroundModal = document.querySelector(".background-modal");
const btnClose = document.querySelector(".btnClose");

// Adiciona um listener para cada botão
btnsOpenFormFGTS.forEach((btn) => {
  btn.addEventListener("click", function () {
    // Toggle para mostrar ou ocultar o modal
    if (backgroundModal.style.display === "block") {
      backgroundModal.style.display = "none";
    } else {
      backgroundModal.style.display = "block";
    }
  });
});

btnClose.addEventListener("click", function () {
  backgroundModal.style.display = "none";
});