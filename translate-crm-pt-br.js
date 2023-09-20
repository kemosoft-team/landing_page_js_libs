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

var translateH1 = [
  "Painel da Agência"
];

var translateSpan = [
  "Clique aqui para alternar"
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
  const h1Text = document.querySelectorAll('h1[data-v-4b953133=""]');
  const spanNav = document.querySelectorAll('.hl_location-text .hl_text-overflow');

  translateElements(navTitles, translatesNav);
  translateElements(cardsTitle, translatesCardsDashboards);
  translateElements(h1Text, translateH1);
  translateElements(spanNav, translateSpan);

};
setTimeout(translates, 3000);



// Crie um elemento no corpo do documento para adicionar o EventListener
const body = document.body;

// Adicione um EventListener para o evento popstate no elemento body
body.addEventListener('popstate', function(event) {
  const currentPath = window.location.pathname;
  console.log(`Caminho da página alterado para: ${currentPath}`);
});

// Execute o código acima depois que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Adicione o EventListener após o DOM estar completamente carregado
  // Isso garante que o elemento body esteja disponível para ser selecionado.
  // Você também pode usar frameworks JavaScript, como jQuery, para isso.
});

