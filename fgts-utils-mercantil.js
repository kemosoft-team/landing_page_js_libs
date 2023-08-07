// Global Variables
let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let stepsUrl = 'https://mercantil.faz.vc/';

// DOM Elements
const button = document.querySelector('.brz-btn-submit');
const spinner = button.querySelector('.brz-form-spinner');
const span = button.querySelector('.brz-span.brz-text__editor');

// Function to get a cookie by name
function getCookie(name) {
  let cookie = {};
  document.cookie.split(';').forEach(function (el) {
    let [k, v] = el.split('=');
    cookie[k.trim()] = v;
  })
  return cookie[name];
}

// Function to set loading state
function setLoading() {
  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';
}

// Function to stop loading state
function stopLoading(textButton) {
  button.removeAttribute('disabled');
  spinner.classList.add('brz-invisible');
  span.textContent = textButton;
}

// Function to redirect to the next step
function redirectToNextStep(res) {
  const param = window.location.search || '';
  const nextStep = res.nextStep;

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

// Function to set the next step
function setNextStep() {
  axios.post(apiBaseUrl + 'getTokenStatus', {}, {
    headers: {
      'Authorization': `Bearer ${getCookie('tkn')}`
    }
  })
    .then(function (response) {
      window.location.href = stepsUrl + response.data.nextStep;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Function to set link signature
function setLinkSignature() {
  var encodedData = window.location.search.substring(1);
  const decodedValue = decodeURIComponent(encodedData);
  const link = document.querySelector('.brz-a');
  link.href = decodedValue;
}

// Function to set schedule
function setSchedule() {
  window.addEventListener('DOMContentLoaded', function () {
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

// Function to handle setting a token
function handleSetToken(value) {
  document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=mercantil.faz.vc; path=/;`;
}

// Function to get the current step from the URL
function getCurrentStep() {
  const path = window.location.pathname;
  const value = path.split('/')[1];
  return value;
}

// Function to show a toast message
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}

// Function to get token status and handle related actions
function getTokenStatus() {
  if (getCookie('tkn')) {
    axios.post(apiBaseUrl + 'getTokenStatus', {}, {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }
    })
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

// Function to capture affiliate data from URL parameters
function captureAffiliateData() {
  const urlParams = new URLSearchParams(window.location.search);

  let affiliateData = {
    affiliateCode: urlParams.get('af') || 'Vv5P88AWTr7qsU8v8',
    source: urlParams.get('source') || null,
    productId: urlParams.get('pid') || null,
    vendorId: urlParams.get('vid') || null,
    offerId: urlParams.get('oid') || 18,
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

// Function to set bank options
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

// Function to fetch bank data
async function getBanks() {
  axios.post(apiBaseUrl + 'getData', { "object": "banks" }, {
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

// Function to fetch address info by zipcode
async function getByZipCodeInfo(zipcode) {
  axios.post(apiBaseUrl + 'getZipcodeInfo', {
    zipcode: zipcode,
  },
    {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }
    })
    .then((response) => {
      setAddressInfo(response.data);
    })
    .catch(function (error) {
      showToast(error.response.data.message);
    });
}

// Function to set address information
function setAddressInfo(obj) {
  document.querySelector('[data-label="Rua"]').value = obj.address;
  document.querySelector('[data-label="Bairro"]').value = obj.district;
  document.querySelector('[data-label="Cidade"]').value = obj.city;
  document.querySelector('[data-label="UF"]').value = obj.state;
}

// Function to register customer address
async function registerCustomerAddress(zipcode, address, addressNumber, state, district, city) {
  setLoading();

  axios.post(apiBaseUrl + 'registerCustomerInfos', {
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
      }
    })
    .then((response) => {
      redirectToNextStep(response.data);
    })
    .catch(function (error) {
      stopLoading('Sim, quero antecipar meu FGTS!');
      showToast(error.response.data.message);
    });
}

// Function to register customer account
async function registerCustomerAccount(agency, bank, account, verifyDigit, accountType) {
  setLoading();

  axios.post(apiBaseUrl + 'registerCustomerInfos', {
    branchNo: agency,
    bankId: bank,
    acctNo: `${account}-${verifyDigit}`,
    acctType: accountType,
    currentStep: getCurrentStep()
  },
    {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }
    })
    .then((response) => {
      redirectToNextStep(response.data);
    })
    .catch(function (error) {
      stopLoading('Simular');
      showToast(error.response.data.message);
    });
}

// Function to register customer documents
async function registerCustomerDocs(docNumber, docType, issueState, motherName) {
  setLoading();

  axios.post(apiBaseUrl + 'registerCustomerInfos', {
    docNumber: docNumber,
    docType: docType,
    docState: issueState,
    mother: motherName,
    currentStep: getCurrentStep()
  },
    {
      headers: {
        'Authorization': `${getCookie('tkn')}`
      }
    })
    .then((response) => {
      redirectToNextStep(response.data);
    })
    .catch(function (error) {
      stopLoading('Sim, quero antecipar meu FGTS!');
      showToast(error.response.data.message);
    });
}

// Function to register customer information
async function registerCustomer(name, birth, federalId, phone) {
  const affiliate = captureAffiliateData();

  setLoading();

  axios.post(apiBaseUrl + '/registerCustomer', {
    "name": name,
    "birth": birth,
    "federalId": federalId,
    "phone": phone,
    "useTerms": true,
    "dataPrivacy": true,
    "dataSearchAllowed": true,
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
      stopLoading('ACEITAR E CONTINUAR');
      showToast(error.response.data.message);
    });
}

// Function to get the next step
function getNextStep() {
  const button = document.querySelector('.brz-btn-submit');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  axios.post(apiBaseUrl + 'getNextStep', {},
    {
      headers: {
        'Authorization': `${getCookie('tkn')}`
      }
    })
    .then((response) => {

      if (response.data.nextStep == 'noBalance' || response.data.nextStep == 'authorize' || response.data.nextStep == 'enable') {

        window.location.href = stepsUrl + response.data.nextStep;

      } else {

        var elementsWait = document.getElementsByClassName('wait');
        var elementsSuccess = document.getElementsByClassName('success');

        for (var i = 0; i < elementsWait.length; i++) {
          elementsWait[i].style.display = 'none';
          elementsSuccess[i].style.display = 'block';
        }

        button.removeAttribute('disabled');
        spinner.classList.add('brz-invisible');
        span.textContent = 'Dê o próximo passo, preencha seus dados';

        button.addEventListener('click', function () {
          window.location.href = stepsUrl + response.data.nextStep;
        });
      }

    })
    .catch(function (error) {
    });
}

// Function to process qualification
function processQualification() {
  let attempts = 0;

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  const sendRequest = () => {
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
        attempts = 2;
      })
      .catch(function (error) {
        attempts++;
        if (attempts < 2) {
          sendRequest();
        } else {
          window.location.href = stepsUrl + 'offline';
        }
      });
  };

  sendRequest();
}

// Function to validate address form
function validarFormAddress() {
  const zipcode = document.querySelector('[data-label="CEP"]').value;
  const address = document.querySelector('[data-label="Rua"]').value;
  const addressNumber = document.querySelector('[data-label="Número"]').value;
  const state = document.querySelector('[data-label="UF"]').value;
  const district = document.querySelector('[data-label="Bairro"]').value;
  const city = document.querySelector('[data-label="Cidade"]').value;

  if (zipcode == "" || address == "" || addressNumber == "" || state == "" || district == "" || city == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerAddress(zipcode, address, addressNumber, state, district, city);
}

// Function to validate documents form
function validarFormDocs() {
  const docType = document.querySelector('[data-label="Tipo de Documento"]').value;
  const docNumber = document.querySelector('[data-label="Número do Documento"]').value;
  const issueState = document.querySelector('[data-label="UF Expeditor"]').value;
  const motherName = document.querySelector('[data-label="Nome da sua Mãe"]').value;

  if (docType == "" || docNumber == "" || issueState == "" || motherName == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerDocs(docNumber, docType, issueState, motherName);
}

// Function to validate account form
function validarFormAccount() {
  const agency = document.querySelector('[data-label="Agência"]').value;
  const bank = document.querySelector('[data-label="Banco"]').value;
  const account = document.querySelector('[data-label="Conta"]').value;
  const verifyDigit = document.querySelector('[data-label="Dígito"]').value;
  const accountType = document.querySelector('[data-label="Tipo de conta"]').value;

  if (agency == "" || bank == "" || account == "" || verifyDigit == "" || accountType == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  const accountTypeCut = accountType.charAt(0).toString();
  registerCustomerAccount(agency, bank, account, verifyDigit, accountTypeCut);
}

// Function to validate the main form
function validateForm() {
  const name = document.querySelector('[data-label="Nome"]').value;
  const phone = document.querySelector('[data-label="Whatsapp"]').value;
  const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
  const federalId = document.querySelector('[data-label="CPF"]').value;

  if (name == "" || phone == "" || birth == "" || federalId == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomer(name, birth, federalId, phone);
}

// Check the current page and execute relevant functions
if (window.location.pathname == '/') {
  getTokenStatus();
  // Additional code for this specific page...
}
