//API url
let apiUrl = 'https://api.consigmais.com.br/lp/main/v2';
let stepsUrl = 'https://consigmaisinss.brizy.site/';

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

  axios.post(apiUrl + '/getTokenStatus', {}, {
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

//Redireciona para subpágina
function redirectToNextStep(res) {

  const param = window.location.search || '';
  const nextStep = res.nextStep;

  switch (nextStep) {
    case 'notAvailable':
      window.location.href = stepsUrl + nextStep + param + '&' + 'firstName=' + encodeURIComponent(JSON.stringify(res.firstName)) + '&' + 'motive=' + encodeURIComponent(JSON.stringify(res.motive));
      break;
    default:
      window.location.href = stepsUrl + nextStep + param;
      break;
  }
}


//Seta cookie
function handleSetToken(value) {
  document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=consigmaisinss.brizy.site; path=/;`;
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
  const selects = document.querySelectorAll('select[data-brz-label="Banco"]');

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

    affiliateCode: urlParams.get('af') || 'Vv5P88AWTr7qsU8v8',
    source: urlParams.get('source') || null,
    productId: urlParams.get('pid') || null,
    vendorId: urlParams.get('vid') || null,
    offerId: '65',
    clickId: urlParams.get('cid') || null,
    pixelId: urlParams.get('afx') || null,
    gtmId: urlParams.get('afgtm') || null,
    gaId: urlParams.get('gaId') || null,
    rawUri: window.location.search
  };
  return affiliateData;
}


//registerCustomer
async function registerCustomer(name, birth, federalId, phone, representativeFederalId) {

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
    "representativeFederalId": representativeFederalId,
    "phone": phone,
    "email": "",
    "useTerms": true,
    "dataPrivacy": true,
    "dataSearchAllowed": true,
    "affiliateData": affiliate
  })
    .then((response) => {
      handleSetToken(response.data.token);
      console.log(response.data.token)
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
async function getByZipCodeInfo(zipcode) {

  axios.post(apiUrl + '/getZipcodeInfo', {
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

//Preenche os campos de endereço do form
function setAddressInfo(obj) {
  document.querySelector('[data-brz-label="Rua"]').value = obj.address;
  document.querySelector('[data-brz-label="Bairro"]').value = obj.district;
  document.querySelector('[data-brz-label="Cidade"]').value = obj.city;
  document.querySelector('[data-brz-label="UF"]').value = obj.state;
}


//registerCustomerAccount
async function registerCustomerAddress(zipcode, address, addressNumber, state, district, city) {

  const button = document.querySelector('.brz-btn-submit');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  axios.post(apiUrl + '/registerCustomerInfos', {
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
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'Continuar';
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

  axios.post(apiUrl + '/registerCustomerInfos', {
    branchNo: agency.replace(/[^\w\s]/gi, ''),
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

  axios.post(apiUrl + '/registerCustomerInfos', {
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
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'Continuar';
      showToast(error.response.data.message);
    });

}

// registerCustomerBenefit
async function registerCustomerBenefit(enrollment) {

  const button = document.querySelector('.brz-btn-submit');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  axios.post(apiUrl + '/registerCustomerInfos', {
    enrollment: enrollment,
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
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'Continuar';
      showToast(error.response.data.message);
    });

}

// registerCustomerRepresentative
async function registerCustomerRepresent(representativeName, representativeBirth) {

  const button = document.querySelector('.brz-btn-submit');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  axios.post(apiUrl + '/registerCustomerInfos', {
    'representativeName': representativeName,
    'representativeBirth': representativeBirth,
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
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'Continuar';
      showToast(error.response.data.message);
    });

}

function getNextStep() {

  const attempts = localStorage.getItem('attempts') || 0;

  const button = document.querySelector('.brz-btn-submit');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  axios.post(apiUrl + '/getNextStep', {},
    {
      headers: {
        'Authorization': `${getCookie('tkn')}`
      }
    })
    .then((response) => {

      if ((attempts == 2) && (response.data.nextStep == 'keepcalm')) {
        window.location.href = stepsUrl + 'offline';
      } else {


        if (response.data.nextStep == 'noBalance' || response.data.nextStep == 'authorize' || response.data.nextStep == 'enable') {

          if (response.data.nextStep == 'authorize') {
            const authorizeLimit = localStorage.getItem('authorizeLimit') || 0;
            localStorage.setItem('authorizeLimit', parseInt(authorizeLimit) + 1);
          }
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

      }

    })
    .catch(function (error) {
    });

}

//validarFormAddress
function validarFormAddress() {

  const zipcode = document.querySelector('[data-brz-label="CEP"]').value;
  const address = document.querySelector('[data-brz-label="Rua"]').value;
  const addressNumber = document.querySelector('[data-brz-label="Número"]').value;
  const state = document.querySelector('[data-brz-label="UF"]').value;
  const district = document.querySelector('[data-brz-label="Bairro"]').value;
  const city = document.querySelector('[data-brz-label="Cidade"]').value;


  if (zipcode == "" || address == "" || addressNumber == "" || state == "" || district == "" || city == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerAddress(zipcode, address, addressNumber, state, district, city);

}

//validarFormDocs
function validarFormDocs() {

  const docType = document.querySelector('[data-brz-label="Tipo de Documento"]').value;
  const docNumber = document.querySelector('[data-brz-label="Número do Documento"]').value;
  const issueState = document.querySelector('[data-brz-label="UF Expeditor"]').value;
  const motherName = document.querySelector('[data-brz-label="Nome da mãe do beneficiário "]').value;


  if (docType == "" || docNumber == "" || issueState == "" || motherName == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerDocs(docNumber, docType, issueState, motherName);
}

//validarFormDocs
function validarFormBenefit() {

  const enrollment = document.querySelector('[data-brz-label="Número de benefício"]').value;

  if (enrollment == "") {
    showToast("Por favor, preencha o campo.");
    return false;
  }
  registerCustomerBenefit(enrollment);
}

//validarFormRepresentanteLegal
function validarFormRepresentative() {

  const representativeName = document.querySelector('[data-brz-label="Nome"]').value;
  const representativeBirth = document.querySelector('[data-brz-label="Data de Nascimento"]').value;

  if (representativeName == "" || representativeBirth == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerRepresent(representativeName, representativeBirth);
}

function validarFormAccount() {

  const agency = document.querySelector('[data-brz-label="Agência"]').value;
  var bank = '';
  const account = document.querySelector('[data-brz-label="Conta"]').value;
  const verifyDigit = document.querySelector('[data-brz-label="Dígito"]').value;
  const accountType = document.querySelector('[data-brz-label="Tipo de conta"]').value;

  if (document.querySelectorAll('div.brz-forms2__item')[1].style.display == "block") {
    bank = document.querySelector('[data-brz-label="Nome Banco"]').value;
  } else {
    bank = document.querySelector('[data-brz-label="Banco"]').value;
  }

  if (agency == "" || bank == "" || account == "" || verifyDigit == "" || accountType == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  const accountTypeCut = accountType.charAt(0).toString();
  registerCustomerAccount(agency, bank, account, verifyDigit, accountTypeCut);
}

//valida form
function validateForm() {

  const name = document.querySelector('[data-brz-label="Nome do Beneficiário"]').value;
  const phone = document.querySelector('[data-brz-label="Whatsapp"]').value;
  const birth = document.querySelector('[data-brz-label="Data de Nascimento do Beneficiário"]').value;
  const federalId = document.querySelector('[data-brz-label="CPF do Beneficiário"]').value;
  const federalIdRepresentElement = document.querySelector('[data-brz-label="CPF do representante"]');
  const representativeFederalId = federalIdRepresentElement ? federalIdRepresentElement.value : '';
  const representativeSelect = document.querySelector('[data-brz-label="É representante legal de alguém?"]').value;

  if (name == "" || phone == "" || birth == "" || federalId == "" || representativeSelect == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  if (representativeSelect == 'Sou representante' && representativeFederalId == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomer(name, birth, federalId, phone, representativeFederalId);
}

getTokenStatus();
