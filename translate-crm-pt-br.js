//Nav e Dashboard
var translatesCardsDashboards = [
  "Receita do Último Mês",
  "Receita Mensal Recorrente",
  "Clientes no Stripe",
  "Novos Clientes neste Mês",
  "Distribuição de Receita",
  "Crescimento nos Últimos 6 Meses"
];

var translatesNav = [
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
  "Ideias",
  "Aplicativo Móvel",
  "Conectar WhatsApp",
  "Configurações"
];


function translateElements(elements, translations) {
  elements.forEach((element, index) => {
    if (index < translations.length) {
      element.textContent = translations[index];
    }
  });
}

function translates() {

  //Seleciona os elementos a serem alterados
  const navTitles = document.querySelectorAll('.nav-title');
  const cardsTitle = document.querySelectorAll('.card-title');

  translateElements(navTitles, translatesNav);
  translateElements(cardsTitle, translatesCardsDashboards);

};

/*  setTimeout(applyTranslate, 2000); */
function handlePathChange() {
    const newPath = window.location.pathname;

    console.log(`O path da URL foi alterado para: ${newPath}`);
    setTimeout(translates, 3000);
    console.log('foi teste');
}

window.addEventListener('popstate', handlePathChange);

handlePathChange();
