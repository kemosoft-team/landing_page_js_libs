

const traducoes = {
  "h1": { 
    "Agency Dashboard": "Painel da Agência"
  },
  "h4": {
    "Sem resposta": "No Response",
    "Ocupado": "Busy",
    "Caixa de correio de voz": "Voicemail",
    "Concluído": "Completed"
  },
  "h5": {
    "Schedule appointment": "Agendar consulta",
    "Como foi a ligação?": "How was the call?"
  },
  "a": {
    "Painel da Agência": "Agency Dashboard",
    "Prospecção New": "Prospecting New",
    "Subcontas": "Subaccounts",
    "Instantâneos de conta": "Account Snapshots",
    "Revenda": "Resell",
    "Mercado online": "Online Marketplace",
    "Affiliate Portal": "Portal de Afiliados",
    "Parceiros": "Partners",
    "Universidade": "University",
    "Educação SaaS": "SaaS Education",
    "Ideias": "Ideas",
    "Mobile App New": "New Mobile App",
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
    "Painel da Agência": "Painel da Agência",
    "Prospecção": "Prospecção",
    "New": "Novo",
    "Subcontas": "Subcontas",
    "Instantâneos de conta": "Instantâneos de conta",
    "Revenda": "Revenda",
    "Mercado online": "Mercado online",
    "Affiliate Portal": "Portal de Afiliados",
    "Parceiros": "Parceiros",
    "Universidade": "Universidade",
    "Educação SaaS": "Educação SaaS",
    "Ideias": "Ideias",
    "Mobile App": "Aplicativo Móvel",
    "Connect WhatsApp": "Conectar WhatsApp",
    "Settings": "Configurações",
    "×": "×",
    "?": "?",
    "View Changelog": "Ver histórico de alterações",
    "Notifications": "Notificações",
    "Support": "Suporte",
    "k": "k",
    "k ": "k",
    "Learn More": "Saiba mais",
    "Use setting": "Usar configuração"
  }
};

// Função para substituir o texto de acordo com as traduções
function traduzirTexto() {
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
setTimeout(traduzirTexto, 4000);

function handlePathChange() {
    const newPath = window.location.pathname;

    console.log(`O path da URL foi alterado para: ${newPath}`);
    console.log('test');
}

window.addEventListener('popstate', handlePathChange);

handlePathChange();
