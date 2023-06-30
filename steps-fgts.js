 //** STEPS FGTS */
let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let stepsUrl = window.location.origin+'/';

 // obtem o cookie pelo nome 
function getCookie(name) {

    let cookie = {};
  
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
  
    return cookie[name];
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
  
  function setLinkSignature() {
  var encodedData = window.location.search.substring(1);
  const decodedValue = decodeURIComponent(encodedData);
  const link = document.querySelector('.brz-a');
  link.href = decodedValue;
  }
  
  function setSchedule(){
  
  window.addEventListener('DOMContentLoaded', function() {
      
      var encodedData = window.location.search.substring(1);
      const decodedValue = decodeURIComponent(encodedData);
  
      var scheduleElement = document.getElementById('schedule');
      var currentText = scheduleElement.textContent;
      var modifiedText = currentText.replace('xx/xx/xxxx', decodedValue);
  
      scheduleElement.textContent = modifiedText;
      scheduleElement.style.fontFamily = 'Montserrat';
      scheduleElement.style.fontSize = '20px';
      scheduleElement.style.color = '#706666';
      scheduleElement.style.fontWeight = '700';
      scheduleElement.style.marginTop = '32px';
      scheduleElement.style.marginBottom = '22px';
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
        option.value = bank.id;
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
  
  
  async function getByZipCodeInfo(zipcode){
  
    axios.post(apiBaseUrl+'getZipcodeInfo', {
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
    
    axios.post(apiBaseUrl+'registerCustomerInfos', {
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
  
  axios.post(apiBaseUrl+'registerCustomerInfos', {
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
      console.log(error);
      if(error.data.nextStep){
        redirectToNextStep(error.response.data);
      }else{
        button.removeAttribute('disabled');
        spinner.classList.add('brz-invisible');
        span.textContent = 'Simular';
        showToast(error.response.data.message);
      }
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
  
  axios.post(apiBaseUrl+'registerCustomerInfos', {
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
  
  function getNextStep(){

    const attempts = localStorage.getItem('attempts') || 0;
  
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

      if((attempts == 2) && (response.data.nextStep == 'keepcalm')){
          window.location.href = stepsUrl + 'offline';
      }else{

  
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

      }
  
      })
      .catch(function (error) {
      });
  
  }
  
  //qualfica o lead
  function processQualification() {
    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');
  
    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
  
    const sendRequest = () => {
      const attempts = localStorage.getItem('attempts') || 0;
  
      axios.post(apiBaseUrl + '/registerCustomerInfos', {
          enable: true,
          authorize: true,
          currentStep: getCurrentStep()
        }, {
          headers: {
            'Authorization': `${getCookie('tkn')}`
          }
        })
        .then((response) => {
          getNextStep();
          localStorage.setItem('attempts', 2);
        })
        .catch(function (error) {
          if (attempts < 2) {
            localStorage.setItem('attempts', parseInt(attempts) + 1);
            sendRequest();
          } else {
            window.location.href = stepsUrl + 'offline';
          }
        });
    };
  
    sendRequest();
  }
  
  //validarFormDocs
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

