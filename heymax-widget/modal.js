(function() {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeymaxWidget);
  } else {
    initHeymaxWidget();
  }

  function initHeymaxWidget() {
    // Obtém configuração do ID
    const clientId = window.HEYMAX_ID || document.body.getAttribute('data-heymax-id');
    const baseURL = window.HEYMAX_URL || document.body.getAttribute('data-heymax-url') || 'https://heymax-widget.kemosoft.com.br/journey';

    if (!clientId) {
      console.error('Heymax Widget: ID não configurado. Defina window.HEYMAX_ID ou data-heymax-id no body');
      return;
    }

    // Cria o modal automaticamente
    createModal();

    // Seleciona os elementos
    const modal = document.querySelector('.heymax-modal-container');
    const iframe = document.getElementById('heymax-iframe');
    const closeBtn = document.querySelector('.heymax-btn-close');

    // Função para abrir o modal
    const openModal = () => {
      const urlReferencia = document.referrer || '';
      const urlOrigem = window.location.href;
      const params = window.location.search.replace(/^\?/, '');

      let iframeURL = `${baseURL}?id=${encodeURIComponent(clientId)}`;
      iframeURL += `&urlReferencia=${encodeURIComponent(urlReferencia)}`;
      iframeURL += `&urlOrigem=${encodeURIComponent(urlOrigem)}`;
      
      if (params) {
        iframeURL += `&${params}`;
      }

      console.log('Heymax Widget - URL:', iframeURL);

      iframe.src = iframeURL;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    // Função para fechar o modal
    const closeModal = () => {
      modal.classList.remove('active');
      iframe.src = '';
      document.body.style.overflow = '';
    };

    // Adiciona eventos nos botões com a classe
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-modal-open') || 
          e.target.closest('.btn-modal-open')) {
        e.preventDefault();
        openModal();
      }
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Cria a estrutura do modal no DOM
  function createModal() {
    const modalHTML = `
      <div class="heymax-modal-container">
        <div class="heymax-modal-content">
          <iframe id="heymax-iframe" src=""></iframe>
          <button class="heymax-btn-close">✕</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
})();
  