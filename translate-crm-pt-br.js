function applyTranslate() {

  const cardTitle = document.querySelector('.card-title');

  const novoTexto = "Receita do Último Mês";
  cardTitle.textContent = novoTexto;

  const spansToTranslat1 = document.querySelectorAll('a .nav-title')[0];
  const nTexto = "Painel da Agência";
  spansToTranslat1.textContent = nTexto;

  const spansToTranslat2 = document.querySelectorAll('a .nav-title')[1];
  const nTexto2 = "Prospecção";
  spansToTranslat2.textContent = nTexto2;

  const spansToTranslat3 = document.querySelectorAll('a .nav-title')[2];
  const nTexto3 = "Subcontas";
  spansToTranslat3.textContent = nTexto3;

  const spansToTranslat4 = document.querySelectorAll('a .nav-title')[3];
  const nTexto4 = "Capturas de Conta";
  spansToTranslat4.textContent = nTexto4;

  const spansToTranslat5 = document.querySelectorAll('a .nav-title')[4];
  const nTexto5 = "Revenda";
  spansToTranslat5.textContent = nTexto5;

  const spansToTranslat6 = document.querySelectorAll('a .nav-title')[5];
  const nTexto6 = "Mercado";
  spansToTranslat6.textContent = nTexto6;

  const spansToTranslat7 = document.querySelectorAll('a .nav-title')[6];
  const nTexto7 = "Portal de Afiliados";
  spansToTranslat7.textContent = nTexto7;



}
  
  setTimeout(applyTranslate, 2000);
  
  function handlePathChange() {
    const newPath = window.location.pathname;
  
    console.log(`O path da URL foi alterado para: ${newPath}`);
  }
  
  window.addEventListener('popstate', handlePathChange);
  
  handlePathChange();