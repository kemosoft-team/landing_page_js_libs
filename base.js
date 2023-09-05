
let APIAPIbaseURL = 'https://api2.kemosoft.com.br/api:lp';
let generalStepUrl = 'https://infos.faz.vc/';

function redirectToNextStep(nextStep){
  console.log("redirectToNextStep");
  window.location.href = generalStepUrl+nextStep
}

//setar token
function handleSetToken(value){
  console.log("handleToken");
  document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=.kemobuilder.site;`;
}

// obtem o cookie pelo nome 
function getCookie(name) {

  let cookie = {};

  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    cookie[k.trim()] = v;
  })

  return cookie[name];
}

//showModal
function setModalText(){
  
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

//get Token Status
function getTokenStatus(){

  axios.post(APIbaseURL+'/lead-status', {}, {
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
// function captureAffiliateData(){

//   if (document.cookie) {

//       let affiliateData = {
//           affiliateCode: getCookie('af') || null,
//           source: getCookie('source') || null,
//           productId: getCookie('pid') || null,
//           vendorId: getCookie('vid') || null,
//           offerId: getCookie('oid') || null,
//           clickId : getCookie('cid') || null,
//           pixelId: getCookie('afx') || null,
//           gtmId: getCookie('afgtm') || null,
//           latDays: getCookie('latd') || null,
//           brandId : getCookie('bid') || null,
//           nextStep : getCookie('nxstp') || null,
//           token: getCookie('tkn') || null,
//           rawUri: window.location.search
//       };
  
//       return affiliateData;
//   }
// }

// Obtem infos do ip do cliente
function getIpInfo(){

  axios.get('https://ipinfo.io/json')
  .then(function (response) {
    return response;
  })
  .catch(function (error) {
      console.log(error);
  }); 

}

function setCookies(latDays){

  axios.get('https://ipinfo.io/json')
  .then(function (response) {
            
      const ip = response.data.ip;
      const hostname = response.data.hostname;
      const city = response.data.city;
      const region = response.data.region;
      const country = response.data.country;
      const loc = response.data.loc;
      const org = response.data.org;

      let ipinfo = {
        ip: ip || null,
        hostname: hostname || null,
        city: city || null,
        region: region || null,
        country: country || null,
        loc: loc || null,
        org: org || null,
    };
  
      const urlParams = new URLSearchParams(window.location.search);
  
        for (const [key, value] of urlParams.entries()) {
            ipinfo[key] = value;
        }
  
      var expirationDays = latDays || 7;
      var expirationDate = new Date();
      
      expirationDate.setTime(expirationDate.getTime() + (expirationDays * 24 * 60 * 60 * 1000));

      document.cookie = "client_origin="+encodeURIComponent(JSON.stringify(ipinfo))+"; expires=" + expirationDate.toUTCString() + "; path=/;";
  })
  .catch(function (error) {
      console.log(error);
  }); 
    }


async function getByZipCodeInfo(zipcode){

  axios.post(APIbaseURL+'/getZipcodeInfo', {
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

function getTokenUrl(){
  
}

function setAddressInfo(obj){

  document.querySelector('[data-label="Rua"]').value = obj.address;
  document.querySelector('[data-label="Bairro"]').value = obj.district;
  document.querySelector('[data-label="Cidade"]').value = obj.city;
  document.querySelector('[data-label="UF"]').value = obj.state;
}
/registerCustomer
async function registerCustomer(name, birth, federalId, phone, email){
  
  axios.post(APIbaseURL+'/offer-request-start', {
    "name": name,
    "birth": birth,
    "federalId": federalId,
    "phone": phone,
    "email": email,
    "useTerms":true,
    "dataPrivacy":true,
    "dataSearchAllowed":true,
  })
  .then((response) => {
    handleSetToken(response.data.token);
    redirectToNextStep(response.data.nextStep);
  })
  .catch(function (error) {
      showToast(error.response.data.message);
  }); 
  }

  /registerCustomerAccount
  async function registerCustomerAddress(zipcode, address, addressNumber, state, district, city) {

    axios.post(APIbaseURL+'/offer-request-infos', {
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

/registerCustomerAccount
async function registerCustomerAccount(agency, bank, account, verifyDigit, accountType) {

  axios.post(APIbaseURL+'/offer-request-infos', {
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

  axios.post(APIbaseURL+'/offer-request-infos', {
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

function validarForm(){ 

  const name = document.querySelector('[data-label="Nome"]').value;
  const phone = document.querySelector('[data-label="Celular"]').value;
  const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
  const email = document.querySelector('[data-label="Email"]').value;
  const federalId = document.querySelector('[data-label="CPF"]').value;

  if (name == "" || phone == "" || birth == "" || federalId =="") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomer(name, birth, federalId, phone, email);
}

function redirectTo(link, path){
  const url = path + link;
  window.location.href = url;
}


 //get status pelo token
 if (getCookie('tkn') != null) { getTokenStatus() };
 //verifica se tem cookie, caso positivo prepara o affiliateData senao pega da url e prepara o affiliateData
 setCookies();







