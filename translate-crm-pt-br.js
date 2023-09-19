
//Injeta tradução dos cards do dashboard
function translateCards(){

  const translates = [
    "Receita do Último Mês",
    "Receita Mensal Recorrente",
    "Clientes no Stripe",
    "Novos Clientes neste Mês",
    "Distribuição de Receita",
    "Crescimento nos Últimos 6 Meses"
  ];

    const cardsTitle = document.querySelectorAll('.card-title');

    for (const index in cardsTitle) { 
      const text = translates[index];
      const cardDiv = document.querySelectorAll('.card-title')[index];
      cardDiv.textContent = text;
    }

};


//Injeta tradução dos links do nav
function translateNav(){

  const translates = [
    "Painel da Agência",
    "Prospecção",
    "Subcontas",
    "Capturas de Conta",
    "Revenda",
    "Mercado",
    "Portal de Afiliados",
    "Parceiros",
    "Universidade",
    "Educação SaaS",
    "Ideas",
    "Aplicativo Móvel",
    "Conectar WhatsApp"
  ];

    const navTitles = document.querySelectorAll('a .nav-title');

    for (const index in navTitles) { 
      const text = translates[index];
      const nav = document.querySelectorAll('a .nav-title')[index];
      nav.textContent = text;
    }

};



/*  setTimeout(applyTranslate, 2000); */
function handlePathChange() {
    const newPath = window.location.pathname;

    console.log(`O path da URL foi alterado para: ${newPath}`);
    setTimeout(traduzirTexto, 3000);
    console.log('foi teste');
}

window.addEventListener('popstate', handlePathChange);

handlePathChange();
