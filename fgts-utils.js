let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let stepsUrl = 'https://infos.faz.vc/';

function redirectToNextStep(n){
    // console.log(n);
    window.location.href = stepsUrl+n
}

//setar token
function handleSetToken(value){
    // console.log("handleToken");
    document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=.faz.vc; path=/;`;
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
  
  //get Token Status
  function getTokenStatus(){
  
    axios.post(apiBaseUrl+'/lead-status', {}, {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }})
      .then(function (response) {
         response;
      })
      .catch(function (error) {
          console.log(error);
      }); 
  }

function setBanks(bankList){
    bankList.reverse();
    const selects = document.querySelectorAll('select[data-label="Banco"]');
    
    selects.forEach(select => {
      bankList.forEach(bank => {
        const option = document.createElement('option');
        option.text = bank.name;
        option.value = bank.bankNo;
        select.insertBefore(option, select.firstChild);
      });
    });
}

//obtem os bancos
async function getBanks(){
    axios.post('https://api.consigmais.com.br/lp/main/v2/getData', {"object":"banks"}, {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }})
      .then(function (response) {
         setBanks(response.data);
      })
      .catch(function (error) {
          console.log(error);
      }); 
  }


//obtem os parametros do afiliado oriondos dos cookies
function captureAffiliateData(){

  // if (document.cookie) {

  //     let affiliateData = {
  //         affiliateCode: getCookie('af') || null,
  //         source: getCookie('source') || null,
  //         productId: getCookie('pid') || null,
  //         vendorId: getCookie('vid') || null,
  //         offerId: getCookie('oid') || null,
  //         clickId : getCookie('cid') || null,
  //         pixelId: getCookie('afx') || null,
  //         gtmId: getCookie('afgtm') || null,
  //         latDays: getCookie('latd') || null,
  //         brandId : getCookie('bid') || null,
  //         nextStep : getCookie('nxstp') || null,
  //         token: getCookie('tkn') || null,
  //         rawUri: window.location.search
  //     };
  
  //     return affiliateData;
  // }

      const urlParams = new URLSearchParams(window.location.search);

      const affiliateData = {};
      
      for (const [key, value] of urlParams) {
        affiliateData[key] = value;
      }

      return affiliateData;
}


//registerCustomer
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
      redirectToNextStep(response.data.nextStep);
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
    const email = document.querySelector('[data-label="Email"]').value;
    const federalId = document.querySelector('[data-label="CPF"]').value;
  
    if (name == "" || phone == "" || birth == "" || federalId =="") {
      showToast("Por favor, preencha todos os campos.");
      return false;
    }
  
    registerCustomer(name, birth, federalId, phone, email);
  }

  




