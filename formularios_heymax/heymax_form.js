// Função para inserir o modal no DOM
function insertModalHTML(journeyId, urlParams) {
   
  let urlReferrer = document.referrer
   
  const modalHTML = `
    <div
      class="background-modal">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        "
      >
        <iframe src="https://simule.faz.vc/formFGTS?id=${journeyId}&${urlParams}&urlReferrer=${urlReferrer}" width="100%" height="100%" frameborder="0"></iframe>

        <div class="btnClose">
          <svg
            width="35"
            height="35"
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Adicionar evento de fechar modal
  const btnClose = document.querySelector(".btnClose");
  btnClose.addEventListener("click", () => {
    const modal = document.querySelector(".background-modal");
    modal.style.display = "none";

     document.body.classList.remove("modal-open"); // Remove classe para habilitar scroll

      // Permitir scroll
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('mousewheel', preventDefault);
  });
}


