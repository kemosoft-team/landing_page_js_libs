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

  const spansToTranslat8 = document.querySelectorAll('a .nav-title')[7];
  const nTexto8 = "Parceiros";
  spansToTranslat8.textContent = nTexto8;

  const spansToTranslat9 = document.querySelectorAll('a .nav-title')[8];
  const nTexto9 = "Universidade";
  spansToTranslat9.textContent = nTexto9;

  const spansToTranslat10 = document.querySelectorAll('a .nav-title')[9];
  const nTexto10 = "Educação SaaS";
  spansToTranslat10.textContent = nTexto10;

  const spansToTranslat11 = document.querySelectorAll('a .nav-title')[10];
  const nTexto11 = "Ideias";
  spansToTranslat11.textContent = nTexto11;

  const spansToTranslat12 = document.querySelectorAll('a .nav-title')[11];
  const nTexto12 = "Aplicativo Móvel";
  spansToTranslat12.textContent = nTexto12;

  const spansToTranslat13 = document.querySelectorAll('a .nav-title')[12];
  const nTexto13 = "Conectar WhatsApp";
  spansToTranslat13.textContent = nTexto13;



}
  
  setTimeout(applyTranslate, 2000);
  
  function handlePathChange() {
    const newPath = window.location.pathname;
  
    console.log(`O path da URL foi alterado para: ${newPath}`);
  }
  
  window.addEventListener('popstate', handlePathChange);
  
  handlePathChange();