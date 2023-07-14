//API url
let apiUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let stepsUrl = 'https://credcesta.kemobuilder.site/';

//Obtem o cookie pelo nome 
function getCookie(name) {

  let cookie = {};

  document.cookie.split(';').forEach(function (el) {
    let [k, v] = el.split('=');
    cookie[k.trim()] = v;
  })

  return cookie[name];
}

//Obtem e redireciona para nextstep atraves de consulta com token
function setNextStep() {

  axios.post(apiUrl+'getTokenStatus', {}, {
    headers: {
      'Authorization': `Bearer ${getCookie('tkn')}`
    }})
    .then(function (response) {
      window.location.href = stepsUrl+response.data.nextStep;
    })
    .catch(function (error) {
        console.log(error);
    }); 
}

//Redireciona para subpágina
function redirectToNextStep(res) {
const nextStep = res.nextStep;

switch (nextStep) {
  case 'signature':
    window.location.href = stepsUrl + nextStep + param + '&' + encodeURIComponent(JSON.stringify(res.formalizatioLink));
    break;
  case 'scheduled':
    window.location.href = stepsUrl + nextStep + param + '&' + encodeURIComponent(JSON.stringify(res.scheduledTo));
    break;
  default:
   window.location.href = stepsUrl + nextStep; 
   console.log(stepsUrl + nextStep);
    break;
}
}

//Seta cookie
function handleSetToken(value) {
  document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=.kemobuilder.site; path=/;`;
}

//Obtem o step atual pela url
function getCurrentStep() {
  const path = window.location.pathname;
  const value = path.split('/')[1];
  return value;
}

//get Token Status info-return
function getTokenStatus() {

  if (getCookie('tkn')) {

    axios.post(apiUrl + '/getTokenStatus', {}, {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }
    })
      .then(function (response) {

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

//Exibe mensagem no toast
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}

//Popula o select de bancos
function setBanks(bankList) {
  bankList.reverse();
  const selects = document.querySelectorAll('select[data-label="Banco"]');

  selects.forEach(select => {
    bankList.forEach(bank => {
      const option = document.createElement('option');
      option.text = bank.name;
      option.value = bank.id;
      select.insertBefore(option, select.firstChild);
    });
  });
}

//Obtem os bancos
async function getBanks() {
  axios.post('https://api.consigmais.com.br/lp/main/v2/getData', { "object": "banks" }, {
    headers: {
      'Authorization': `Bearer ${getCookie('tkn')}`
    }
  })
    .then(function (response) {
      setBanks(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}


//Obtem os parametros do afiliado oriondos dos cookies
function captureAffiliateData() {

  const urlParams = new URLSearchParams(window.location.search);

  let affiliateData = {

    affiliateCode: urlParams.get('af') || null,
    source: urlParams.get('source') || null,
    productId: urlParams.get('pid') || null,
    vendorId: urlParams.get('vid') || null,
    offerId: urlParams.get('oid') || null,
    clickId: urlParams.get('cid') || null,
    pixelId: urlParams.get('afx') || null,
    gtmId: urlParams.get('afgtm') || null,
    latDays: urlParams.get('latd') || null,
    brandId: urlParams.get('bid') || null,
    nextStep: urlParams.get('nxstp') || null,
    token: urlParams.get('tkn') || null,
    rawUri: window.location.search
  };
  return affiliateData;
}


//registerCustomer
async function registerCustomer(name, birth, federalId, phone, federalIdRepresent) {

  const affiliate = captureAffiliateData();

  const button = document.querySelector('.btn-submit-fgts');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  axios.post(apiUrl + '/registerCustomer', {
    "name": name,
    "birth": birth,
    "federalId": federalId,
    "federalIdRepresent": federalIdRepresent,
    "phone": phone,
    "email":"", 
    "useTerms": true,
    "dataPrivacy": true,
    "dataSearchAllowed": true,
    "affiliateData": affiliate
  })
    .then((response) => {
      handleSetToken(response.data.token);
      redirectToNextStep(response.data);
    })
    .catch(function (error) {
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'ACEITAR E CONTINUAR';
      showToast(error.response.data.message);
    });
}


//Obtem as informamações de endereço com base no CEP
async function getByZipCodeInfo(zipcode){
  
  axios.post(apiUrl+'getZipcodeInfo', {
    zipcode: zipcode,
  },
  {
    headers: {
      'Authorization': `Bearer ${getCookie('tkn')}`
    }})
  .then((response) => {
    setAddressInfo(response.data);
  })
  .catch(function (error) {
      showToast(error.response.data.message);
  }); 

}

//Preenche os campos de endereço do form
function setAddressInfo(obj){
  document.querySelector('[data-label="Rua"]').value = obj.address;
  document.querySelector('[data-label="Bairro"]').value = obj.district;
  document.querySelector('[data-label="Cidade"]').value = obj.city;
  document.querySelector('[data-label="UF"]').value = obj.state;
}

  
  //registerCustomerAccount
  async function registerCustomerAddress(zipcode, address, addressNumber, state, district, city) {
  
    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');
  
    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
    
    axios.post(apiUrl+'registerCustomerInfos', {
      zipcode: zipcode,
      address: address, 
      addressNumber: addressNumber, 
      state: state, 
      district: district, 
      city: city,
      currentStep: getCurrentStep()
    },
    {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }})
    .then((response) => {
      redirectToNextStep(response.data);
    })
    .catch(function (error) {
        button.removeAttribute('disabled');
        spinner.classList.add('brz-invisible');
        span.textContent = 'Sim, quero antecipar meu FGTS!';
        showToast(error.response.data.message);
    }); 
  
    }
  
  //registerCustomerAccount
  async function registerCustomerAccount(agency, bank, account, verifyDigit, accountType) {
  
  const button = document.querySelector('.brz-btn-submit');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');
  
  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';
  
  axios.post(apiUrl+'registerCustomerInfos', {
    branchNo: agency.replace(/[^\w\s]/gi, ''),
    bankId: bank,
    acctNo: `${account}-${verifyDigit}`,
    acctType: accountType,
    currentStep: getCurrentStep()
  },
  {
    headers: {
      'Authorization': `Bearer ${getCookie('tkn')}`
    }})
  .then((response) => {
    redirectToNextStep(response.data);
  })
  .catch(function (error) {
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'Simular';
      showToast(error.response.data.message);
  }); 
  
  }
  // registerCustomerAccount
  async function registerCustomerDocs(docNumber, docType, issueState, motherName) {
  
  const button = document.querySelector('.brz-btn-submit');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');
  
  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';
  
  axios.post(apiUrl+'registerCustomerInfos', {
    docNumber: docNumber,
    docType: docType,
    docState: issueState,
    mother: motherName,
    currentStep: getCurrentStep()
  },
  {
    headers: {
      'Authorization': `${getCookie('tkn')}`
    }})
  .then((response) => {
    redirectToNextStep(response.data);
  })
  .catch(function (error) {
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'Sim, quero antecipar meu FGTS!';
      showToast(error.response.data.message);
  }); 
  
  }

    // registerCustomerBenefit
    async function registerCustomerBenefit(nb) {
  
      const button = document.querySelector('.brz-btn-submit');
      const spinner = button.querySelector('.brz-form-spinner');
      const span = button.querySelector('.brz-span.brz-text__editor');
      
      button.setAttribute('disabled', true);
      spinner.classList.remove('brz-invisible');
      span.textContent = '';
      
      axios.post(apiUrl+'registerCustomerInfos', {
        'nb': nb,
        currentStep: getCurrentStep()
      },
      {
        headers: {
          'Authorization': `${getCookie('tkn')}`
        }})
      .then((response) => {
        redirectToNextStep(response.data);
      })
      .catch(function (error) {
          button.removeAttribute('disabled');
          spinner.classList.add('brz-invisible');
          span.textContent = 'Sim, quero antecipar meu FGTS!';
          showToast(error.response.data.message);
      }); 
      
      }
  
    // registerCustomerRepresentative
    async function registerCustomerRepresent(nameRepresent, birthRepresent) {
  
      const button = document.querySelector('.brz-btn-submit');
      const spinner = button.querySelector('.brz-form-spinner');
      const span = button.querySelector('.brz-span.brz-text__editor');
      
      button.setAttribute('disabled', true);
      spinner.classList.remove('brz-invisible');
      span.textContent = '';
      
      axios.post(apiUrl+'registerCustomerInfos', {
        'nameRepresent': nameRepresent,
        'birthRepresent': birthRepresent,
         currentStep: getCurrentStep()
      },
      {
        headers: {
          'Authorization': `${getCookie('tkn')}`
        }})
      .then((response) => {
        redirectToNextStep(response.data);
      })
      .catch(function (error) {
          button.removeAttribute('disabled');
          spinner.classList.add('brz-invisible');
          span.textContent = 'Sim, quero antecipar meu FGTS!';
          showToast(error.response.data.message);
      }); 
      
      }
  
  function getNextStep(){

    const attempts = localStorage.getItem('attempts') || 0;
  
    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');
  
    axios.post(apiUrl+'getNextStep', {}, 
    {
      headers: {
        'Authorization': `${getCookie('tkn')}`
      }
    })
    .then((response) => {

      if((attempts == 2) && (response.data.nextStep == 'keepcalm')){
          window.location.href = stepsUrl + 'offline';
      }else{

  
      if(response.data.nextStep == 'noBalance' || response.data.nextStep == 'authorize' || response.data.nextStep == 'enable'){

          if(response.data.nextStep == 'authorize'){
            const authorizeLimit = localStorage.getItem('authorizeLimit') || 0;
            localStorage.setItem('authorizeLimit', parseInt(authorizeLimit) + 1);
          }
          window.location.href = stepsUrl+response.data.nextStep;
  
      }else{
  
        var elementsWait = document.getElementsByClassName('wait');
        var elementsSuccess = document.getElementsByClassName('success');
  
        for (var i = 0; i < elementsWait.length; i++) {
          elementsWait[i].style.display = 'none';
          elementsSuccess[i].style.display = 'block';
        }
  
        button.removeAttribute('disabled');
        spinner.classList.add('brz-invisible');
        span.textContent = 'Dê o próximo passo, preencha seus dados';
        
        button.addEventListener('click', function() {
              window.location.href = stepsUrl+response.data.nextStep;
        });
      }

      }
  
      })
      .catch(function (error) {
      });
  
  }

//validarFormAddress
function validarFormAddress(){ 
  
  const zipcode = document.querySelector('[data-label="CEP"]').value;
  const address = document.querySelector('[data-label="Rua"]').value;
  const addressNumber = document.querySelector('[data-label="Número"]').value;
  const state = document.querySelector('[data-label="UF"]').value;
  const district = document.querySelector('[data-label="Bairro"]').value;
  const city = document.querySelector('[data-label="Cidade"]').value;

  
  if (zipcode == "" || address == "" || addressNumber == "" || state =="" || district =="" || city =="") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerAddress(zipcode, address, addressNumber, state, district, city);
  
}

//validarFormDocs
function validarFormDocs(){ 

  const docType = document.querySelector('[data-label="Tipo de Documento"]').value;
  const docNumber = document.querySelector('[data-label="Número do Documento"]').value;
  const issueState = document.querySelector('[data-label="UF Expeditor"]').value;
  const motherName = document.querySelector('[data-label="Nome da sua Mãe"]').value;

  
  if (docType == "" || docNumber == "" || issueState == "" || motherName =="") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerDocs(docNumber, docType, issueState, motherName);
}

//validarFormDocs
function validarFormBenefit(){ 

  const nb = document.querySelector('[data-label="Número de benefício"]').value;
  
  if (nb == "") {
    showToast("Por favor, preencha o campo.");
    return false;
  }
  registerCustomerBenefit(nb);
}

//validarFormRepresentanteLegal
function validarFormRepresentative(){ 

  const nameRepresent= document.querySelector('[data-label="Nome"]').value;
  const birthRepresent = document.querySelector('[data-label="Data de Nascimento"]').value;
  
  if (nameRepresent == "" || birthRepresent == "" ) {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerRepresentative(nameRepresent, birthRepresent);
}

function validarFormAccount(){ 

  const agency = document.querySelector('[data-label="Agência"]').value;
  var bank = '';
  const account = document.querySelector('[data-label="Conta"]').value;
  const verifyDigit = document.querySelector('[data-label="Dígito"]').value;
  const accountType = document.querySelector('[data-label="Tipo de conta"]').value;

    if(document.querySelectorAll('div.brz-forms2__item')[1].style.display == "block"){
      bank = document.querySelector('[data-label="Nome Banco"]').value;
    }else{
      bank = document.querySelector('[data-label="Banco"]').value;
    }

  if (agency == "" || bank == "" || account == "" || verifyDigit =="" || accountType =="") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  const  accountTypeCut = accountType.charAt(0).toString();
  registerCustomerAccount(agency, bank, account, verifyDigit, accountTypeCut);
}

//valida form
function validateForm() {

  const name = document.querySelector('[data-label="Nome"]').value;
  const phone = document.querySelector('[data-label="Whatsapp"]').value;
  const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
  const federalId = document.querySelector('[data-label="CPF"]').value;
  const federalIdRepresent = document.querySelector('[data-label=" CPF do representante legal (opcional)"]').value;

  if (name == "" || phone == "" || birth == "" || federalId == "" ) {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomer(name, birth, federalId, phone, federalIdRepresent);
}

getTokenStatus();

window.onload = function () {
  var stateItems = document.querySelectorAll('#stateItems');
  var selectedCity = document.getElementById('selected-city');
  var state = document.querySelectorAll('#state');

  var convenio = [
    {
      convenio: "BA",
      limiteSaqueMaximo: "98x",
      limiteCompra: "12x",
      taxaJuros: "4,72%",
      margemCartaoBeneficio: "30%"
    },
    {
      convenio: "MS",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "5,50%",
      margemCartaoBeneficio: "5%"
    },
    {
      convenio: "AM",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "3,80%",
      margemCartaoBeneficio: "20%"
    },
    {
      convenio: "MA",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "5,50%",
      margemCartaoBeneficio: "20%"
    },
    {
      convenio: "PE",
      limiteSaqueMaximo: "48x",
      limiteCompra: "12x",
      taxaJuros: "4,04%",
      margemCartaoBeneficio: "8%"
    },
    {
      convenio: "PI",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "4,68%",
      margemCartaoBeneficio: "10%"
    },
    {
      convenio: "MG",
      limiteSaqueMaximo: "72x",
      limiteCompra: "12x",
      taxaJuros: "4,99%",
      margemCartaoBeneficio: "10%"
    },
    {
      convenio: "PR",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "4,30%",
      margemCartaoBeneficio: "10%"
    },
    {
      convenio: "RJ",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "5,50%",
      margemCartaoBeneficio: "20%"
    },
    {
      convenio: "SC",
      limiteSaqueMaximo: "96x",
      limiteCompra: "36x",
      taxaJuros: "4,72%",
      margemCartaoBeneficio: "10%"
    },
    {
      convenio: "SP",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "4,60%",
      margemCartaoBeneficio: "10%"
    }
  ];


  function showConvenio(city) {
    var informacoesConvenio = convenio.find(function (info) {
      return info.convenio === city;
    });

    if (informacoesConvenio) {
      var limiteSaqueMaximoElement = document.getElementById("limiteSaqueMaximo");
      var limiteCompraElement = document.getElementById("limiteCompra");
      var taxaJurosElement = document.getElementById("taxaJuros");
      var margemCartaoBeneficioElement = document.getElementById("margemCartaoBeneficio");

      limiteSaqueMaximoElement.textContent = informacoesConvenio.limiteSaqueMaximo;
      limiteCompraElement.textContent = informacoesConvenio.limiteCompra;
      taxaJurosElement.textContent = informacoesConvenio.taxaJuros;
      margemCartaoBeneficioElement.textContent = informacoesConvenio.margemCartaoBeneficio;
    } else {
      var insucessPopUp = document.getElementById('insucess');
      insucessPopUp.click();
    }
  }
  fetch('https://ipapi.co/json/')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var code = data.region_code;
      var stateName = data.region;
      selectedCity.textContent = code;
      state.forEach(function (item) {
        item.textContent = stateName;
      });

      showConvenio(code);
    })
    .catch(function (error) {
      console.log('Ocorreu um erro ao obter a localização do IP:', error);
    });



  stateItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var cityName = item.textContent;
      selectedCity.textContent = cityName;
      state.forEach(function (item) {
        item.textContent = cityName;
      });
      showConvenio(cityName);
    });
  });
};


