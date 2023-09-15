function applyTranslate() {

  const cardTitle = document.querySelector('.card-title');

  const novoTexto = "Receita do Último Mês";
  cardTitle.textContent = novoTexto;

  const spansToTranslat1 = document.querySelectorAll('a .nav-title')[0];
  const nTexto = "Painel da Agência";
  spansToTranslat1.textContent = nTexto;

  const spansToTranslat2 = document.querySelectorAll('a .nav-title')[0];
  const nTexto2 = "Prospecção";
  spansToTranslat2.textContent = nTexto2;

}
  
  setTimeout(applyTranslate, 4000);
  
  function handlePathChange() {
    const newPath = window.location.pathname;
  
    console.log(`O path da URL foi alterado para: ${newPath}`);
  }
  
  window.addEventListener('popstate', handlePathChange);
  
  handlePathChange();