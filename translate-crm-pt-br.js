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

// Função para tratar a mudança de caminho
function handlePathChange() {
  const currentPath = window.location.pathname;
  console.log(`Caminho da página alterado para: ${currentPath}`);
}

// Adiciona um ouvinte ao evento popstate para detectar mudanças de caminho
window.addEventListener('popstate', handlePathChange);

// Imprime o caminho inicial quando a página carrega
document.addEventListener('DOMContentLoaded', handlePathChange);

window.addEventListener('hashchange', function() {
  // O código aqui será executado sempre que a parte do fragmento da URL for alterada
  console.log('Fragmento da URL alterado para: ' + window.location.hash);
});


// Função para imprimir a mensagem
function imprimirMensagem() {
  console.log("Olá, mundo!");
}

// Define o intervalo de tempo em milissegundos (1 segundo = 1000 milissegundos)
const intervalo = 1000;

// Define o número de vezes que a mensagem será impressa
const numeroMensagens = 10;  // Altere para o número desejado de mensagens

// Variável para rastrear o número de mensagens impressas
let mensagensImpressas = 0;

// Define o intervalo de tempo para imprimir a mensagem a cada segundo
const intervaloID = setInterval(function() {
  imprimirMensagem();
  mensagensImpressas++;

  // Verifica se o número de mensagens desejado foi alcançado
  if (mensagensImpressas === numeroMensagens) {
    clearInterval(intervaloID); // Interrompe o intervalo após o número desejado de mensagens
  }
}, intervalo);

