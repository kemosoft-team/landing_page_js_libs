let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let stepsUrl = 'https://infos.faz.vc/';

function redirectToNextStep(n){
    console.log("redirectToNextStep");
    window.location.href = stepsUrl+n
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

  
async function getByZipCodeInfo(zipcode){

    axios.post(apiBaseUrl+'/getZipcodeInfo', {
      zipcode: zipcode,
    },
    {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }})
    .then((response) => {
      console.log(response);
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

    axios.post(apiBaseUrl+'/offer-request-infos', {
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
      redirectToNextStep(response.data.nextStep);
    })
    .catch(function (error) {
        showToast(error.response.data.message);
    }); 

    }

//registerCustomerAccount
async function registerCustomerAccount(agency, bank, account, verifyDigit, accountType) {

  axios.post(apiBaseUrl+'/offer-request-infos', {
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
    console.log(response);
    redirectToNextStep(response.data.nextStep);
  })
  .catch(function (error) {
      showToast(error.response.data.message);
  }); 

  }


  // registerCustomerAccount
async function registerCustomerDocs(docNumber, docType, issueState, motherName) {

  axios.post(apiBaseUrl+'/offer-request-infos', {
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
    console.log(response);
    redirectToNextStep(response.data.nextStep);
  })
  .catch(function (error) {
      showToast(error.response.data.message);
  }); 

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


