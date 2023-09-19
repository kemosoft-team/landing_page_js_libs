
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

}




const traducoes = {
  "h1": { 
    "Agency Dashboard": "Painel da Agência"
  },
  "h4": {
    "No Response" : "Sem resposta",
    "Busy":"Ocupado",
    "Voicemail" : "Caixa de correio de voz",
    "Completed" : "Concluído", 
  },
  "h5": {
    "Schedule appointment": "Agendar consulta",
    "How was the call?" : "Como foi a ligação?", 
  },
  "a": {
    "Agency Dashboard" : "Painel da Agência",
    "Prospecting" : "Prospecção",
    "Subaccounts" : "Subcontas",
    "Account Snapshots" : "Instantâneos de conta",
    "Resell" : "Revenda",
    "Online Marketplace" : "Mercado online",
    "Affiliate Portal": "Portal de Afiliados",
    "Partners" : "Parceiros",
    "University" : "Universidade",
    "SaaS Education" : "Educação SaaS",
    "Ideas" : "Ideias",
    "New Mobile App" : "Mobile App New",
    "Connect WhatsApp": "Conectar WhatsApp",
    "Settings": "Configurações",
    "View Changelog": "Ver histórico de alterações",
    "Notifications": "Notificações",
    "Support": "Suporte",
    "Signout": "Sair",
    "Login to Stripe": "Entrar no Stripe",
    "Why are my stats inaccurate?": "Por que minhas estatísticas estão imprecisas?"
  },
  "span": {
    "Click here to switch": "Clique aqui para alternar",
    "Agency Dashboard": "Painel da Agência",
    "Prospecting": "Prospecção",
    "New": "Novo",
    "Subaccounts": "Subcontas",
    "Instantâneos de conta": "Instantâneos de conta",
    "Resell": "Revenda",
    "Online Marketplace": "Mercado online",
    "Affiliate Portal": "Portal de Afiliados",
    "Partners": "Parceiros",
    "University": "Universidade",
    "SaaS Education": "Educação SaaS",
    "Ideas": "Ideias",
    "Mobile App": "Aplicativo Móvel",
    "Connect WhatsApp": "Conectar WhatsApp",
    "Settings": "Configurações",
    "View Changelog": "Ver histórico de alterações",
    "Notifications": "Notificações",
    "Support": "Suporte",
    "Learn More": "Saiba mais",
    "Use setting": "Usar configuração"
  }
};

// Função para substituir o texto de acordo com as traduções
function traduzirTexto() {
  translateCards();
    // Loop através das tags e seus textos
    for (const tag in traducoes) {
        const elementos = document.querySelectorAll(tag);
        elementos.forEach(elemento => {
            const textoOriginal = elemento.textContent.trim();
            if (traducoes[tag][textoOriginal]) {
                elemento.textContent = traducoes[tag][textoOriginal];
            }
        });
    }
}


/*  setTimeout(applyTranslate, 2000); */


function handlePathChange() {
    const newPath = window.location.pathname;

    console.log(`O path da URL foi alterado para: ${newPath}`);
    setTimeout(traduzirTexto, 4000);
    console.log('test');
}

window.addEventListener('popstate', handlePathChange);

handlePathChange();
