
if (typeof apiBaseUrl == 'undefined') {
    let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/';
    let stepsUrl = window.location.origin+'/';
  }
  
  //inicia spin loading no button
  function setLoading(){
    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
  }
  
  //para spin loading no button
  function stopLoading(textButton){
  button.removeAttribute('disabled');
  spinner.classList.add('brz-invisible');
  span.textContent = textButton;
  }
  
  function redirectToNextStep(res) {
  
    const nextStep = res.nextStep;
    const param = window.location.search || '';
  
    switch (nextStep) {
      case 'signature':
        window.location.href = stepsUrl + nextStep + param + '&' + encodeURIComponent(JSON.stringify(res.formalizatioLink));
        break;
      case 'scheduled':
        window.location.href = stepsUrl + nextStep + param + '&' + encodeURIComponent(JSON.stringify(res.scheduledTo));
        break;
      default:
        window.location.href = stepsUrl + nextStep + param;
        break;
    }
  }
  
  //setar token
  function handleSetToken(value){
      // console.log("handleToken");
      document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=master.faz.vc; path=/;`;
    }
  
  //obtem o step atual pela url
  function getCurrentStep(){
      const path = window.location.pathname;
      const value = path.split('/')[1];
      return value;
  }
  
  //showToast
  function showToast(text) {
      var x = document.getElementById("snackbar");
      x.className = "show";
      document.getElementById("snackbar").innerHTML = text;
      setTimeout(function(){ x.className = x.className.replace("show", `${text}`); }, 3000);
    }
    
    //get Token Status info-return
    function getTokenStatus(){
  
      if(getCookie('tkn')){
    
      axios.post(apiBaseUrl+'getTokenStatus', {}, {
        headers: {
          'Authorization': `Bearer ${getCookie('tkn')}`
        }})
        .then(function (response) {
          
          const param = window.location.search || '';

          const link = document.querySelector('a.btn-continue');
          link.setAttribute('href', stepsUrl + response.data.nextStep + param);
  
           document.getElementById("info-return").innerHTML = `<p class="p-info-return">${response.data.message}</p>`;
           var botao = document.querySelector(".btn-lead-info");
           botao.click();
  
        })
        .catch(function (error) {
            console.log(error);
        }); 
      }
    }
  
  //obtem os parametros do afiliado oriondos dos cookies
  function captureAffiliateData(){
  
        const urlParams = new URLSearchParams(window.location.search);
  
        let affiliateData = {
          affiliateCode: urlParams.get('af') || null,
          source: urlParams.get('source') || null,
          productId: urlParams.get('pid') || null,
          vendorId: urlParams.get('vid') || null,
          offerId: urlParams.get('oid') || null,
          clickId : urlParams.get('cid') || null,
          pixelId: urlParams.get('afx') || null,
          gtmId: urlParams.get('afgtm') || null,
          latDays: urlParams.get('latd') || null,
          brandId : urlParams.get('bid') || null,
          nextStep : urlParams.get('nxstp') || null,
          token: urlParams.get('tkn') || null,
          rawUri: window.location.search
      };
        return affiliateData;
  }
  
  
  /registerCustomer
  async function registerCustomer(name, birth, federalId, phone, email){
  
      const affiliate = captureAffiliateData();
  
      const button = document.querySelector('.btn-submit-fgts');
      const spinner = button.querySelector('.brz-form-spinner');
      const span = button.querySelector('.brz-span.brz-text__editor');
  
      button.setAttribute('disabled', true);
      spinner.classList.remove('brz-invisible');
      span.textContent = '';
    
      axios.post(apiBaseUrl+'/registerCustomer', {
        "name": name,
        "birth": birth,
        "federalId": federalId,
        "phone": phone,
        "email": email,
        "useTerms":true,
        "dataPrivacy":true,
        "dataSearchAllowed":true,
        "affiliateData": affiliate
      })
      .then((response) => {
        handleSetToken(response.data.token);
        if (response.data.forceNewOfferLead) {
          window.location.replace(`${stepsUrl}ongoing`);
        } else {
          redirectToNextStep(response.data);
        }
      })
      .catch(function (error) {
          button.removeAttribute('disabled');
          spinner.classList.add('brz-invisible');
          span.textContent = 'ACEITAR E CONTINUAR';
          showToast(error.response.data.message);
      }); 
  }
  
  //validar form
  function validateForm(){ 
  
      const name = document.querySelector('[data-label="Nome"]').value;
      const phone = document.querySelector('[data-label="Whatsapp"]').value;
      const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
      const email = document.querySelector('[data-label="Email (Opcional)"]').value;
      const federalId = document.querySelector('[data-label="CPF"]').value;
    
      if (name == "" || phone == "" || birth == "" || federalId =="") {
        showToast("Por favor, preencha todos os campos.");
        return false;
      }
    
      registerCustomer(name, birth, federalId, phone, email);
    }
  
      // Termos formulários
      if(window.location.pathname == '/fgts'){
        getTokenStatus();
        //Adiciona termos e condições abaixo do formulário
        let novaDiv = document.createElement('div');
            novaDiv.classList.add('brz-rich-text');
            
        let novoParagrafo = document.createElement('p');
            novoParagrafo.classList.add('brz-css-bmkpa');
            novoParagrafo.setAttribute('data-generated-css', 'brz-css-gtmtp');
            novoParagrafo.style.fontSize = '11px';
            novoParagrafo.style.textAlign = 'justify';
            novoParagrafo.style.wordWrap = 'break-word';
            novoParagrafo.innerHTML = '<span class="terms" style="opacity: 1;">Ao continuar no botão abaixo você estará assegurando o tratamento responsável de suas informações, em conformidade com a LGPD vigente, e também: 1. Concordando com os <a href="https://api.consigmais.com.br/terms/" style="color: #646464" target="_blank">Termos de Uso</a> e de <a style="color: #646464" href="https://api.consigmais.com.br/privacy/" target="_blank">Privacidade</a> 2. Aceitando ser contatado por Whatsapp/SMS acerca desta minha consulta e solicitação, bem como autorizo ter meu CPF consultado junto às instituições bancárias e governamentais para assegurar a correta simulação / contratação deste produto.</span>';
            novaDiv.appendChild(novoParagrafo);
  
        let divPai = document.querySelector('.brz-forms2__item-button');
            divPai.insertAdjacentElement('beforebegin', novaDiv);
        
        //Setar videos 
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            if (screenWidth > 767) { 
              const desktopContent = '<div><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><figure style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%; margin-block-end: 0; margin-block-start: 0; margin-inline-start: 0; margin-inline-end: 0;" ><iframe src="https://api.vadoo.tv/iframe_test?id=qlbmxwIzmkuf6UWl1aJVHRMmTmvG7kQy" scrolling="no" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute; overflow:hidden; border-radius: 5px;" allowfullscreen="1" allow="autoplay"></iframe></figure></div></div>'; 
              document.getElementById('video-content').innerHTML = desktopContent;
            } else {
              const mobileContent = '<div><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 177.78%;"><figure style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 177.78%; margin-block-end: 0; margin-block-start: 0; margin-inline-start: 0; margin-inline-end: 0;" ><iframe src="https://api.vadoo.tv/iframe_test?id=Isk5HRNYtWRHfmrQi7ptXjHNLlNJA1oL" scrolling="no" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute; overflow:hidden; border-radius: 5px;" allowfullscreen="1" allow="autoplay"></iframe></figure></div></div>'; 
              document.getElementById('video-content').innerHTML = mobileContent;
            }
      }