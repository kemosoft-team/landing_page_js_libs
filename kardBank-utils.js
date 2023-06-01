//API url
let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let stepsUrl = 'https://kardbank.kemobuilder.site/';

// obtem o cookie pelo nome 
function getCookie(name) {

  let cookie = {};

  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    cookie[k.trim()] = v;
  })

  return cookie[name];
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


var federalId = document.querySelector('[data-label="CPF"]'),
    phone = document.querySelector('[data-label="Whatsapp"]'),
    birth = document.querySelector('[data-label="Data de Nascimento"]');
if(federalId){
federalId.setAttribute("inputmode", "numeric"), phone.setAttribute("inputmode", "numeric"), federalId.addEventListener("input", (function() {
    var e = federalId.value;
    e = (e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d{1,2})$/, "$1-$2"), federalId.value = e
}));
}
if(phone){phone.addEventListener("input", (function() {
    var e = phone.value;
    e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{2})(\d)/, "($1) $2")).replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3"), phone.value = e
}));
}
if(birth){birth.addEventListener("input", (function() {
    var e = birth.value;
    e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 8)).replace(/(\d{2})(\d)/, "$1/$2")).replace(/(\d{2})(\d)/, "$1/$2"), birth.value = e
}));
}


function redirectToNextStep(res) {

  const nextStep = res.nextStep;

  switch (nextStep) {
    case 'signature':
      window.location.href = stepsUrl + nextStep + '?' + encodeURIComponent(JSON.stringify(res.formalizatioLink));
      break;
    case 'scheduled':
      window.location.href = stepsUrl + nextStep + '?' + encodeURIComponent(JSON.stringify(res.scheduledTo));
      break;
    default:
      window.location.href = stepsUrl + nextStep;
      break;
  }
}

function setNextStep() {

    axios.post(apiBaseUrl+'getTokenStatus', {}, {
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

  //getCurrentStep
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

//setBanks
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
      
    axios.post(apiBaseUrl+'getData', {"object":"banks"}, {
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



//registerCustomerAccount
async function registerCustomerAccount(agency, bank, account, verifyDigit, accountType) {

  const button = document.querySelector('.brz-btn-submit');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  axios.post(apiBaseUrl+'registerCustomerInfos', {
    branchNo: agency,
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

  function getNextStep(){

    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    axios.post(apiBaseUrl+'getNextStep', {}, 
    {
      headers: {
        'Authorization': `${getCookie('tkn')}`
      }
    })
    .then((response) => {

      if(response.data.nextStep == 'noBalance' || response.data.nextStep == 'authorize' || response.data.nextStep == 'enable'){

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

      })
      .catch(function (error) {
      });
  
  }

  function validarFormAccount(){ 

    const agency = document.querySelector('[data-label="Agência"]').value;
    const bank = document.querySelector('[data-label="Banco"]').value;
    const account = document.querySelector('[data-label="Conta"]').value;
    const verifyDigit = document.querySelector('[data-label="Dígito"]').value;
    const accountType = document.querySelector('[data-label="Tipo de conta"]').value;

    if (agency == "" || bank == "" || account == "" || verifyDigit =="" || accountType =="") {
      showToast("Por favor, preencha todos os campos.");
      return false;
    }

    const  accountTypeCut = accountType.charAt(0).toString();
    registerCustomerAccount(agency, bank, account, verifyDigit, accountTypeCut);
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

