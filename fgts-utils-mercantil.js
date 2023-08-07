let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let stepsUrl = window.location.origin + '/';


//inicia spin loading no button
function setLoading() {
  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';
}

//para spin loading no button
function stopLoading(textButton) {
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
function handleSetToken(value) {
  // console.log("handleToken");
  document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=mercantil.faz.vc; path=/;`;
}

//obtem o step atual pela url
function getCurrentStep() {
  const path = window.location.pathname;
  const value = path.split('/')[1];
  return value;
}

//showToast
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}

//get Token Status info-return
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

//obtem os parametros do afiliado oriondos dos cookies
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


//registerCustomerTELAPRINCIPAL
async function registerCustomerMain(nameMain, birthMain, federalIdMain, phoneMain) {

  const affiliate = captureAffiliateData();

  const button = document.querySelector('.btn-submit-fgts');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  axios.post(apiBaseUrl + '/registerCustomer', {
    "name": nameMain,
    "birth": birthMain,
    "federalId": federalIdMain,
    "phone": phoneMain,
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
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'ACEITAR E CONTINUAR';
      showToast(error.response.data.message);
    });
}

//registerCustomerFORMULARIOSBUTTON
async function registerCustomer(name, birth, federalId, phone) {

  const affiliate = captureAffiliateData();

  const button = document.querySelector('.btn-submit-fgts');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

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
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'ACEITAR E CONTINUAR';
      showToast(error.response.data.message);
    });
}

//validar form
function validateFormMain() {
  const nameMain = document.querySelector('[data-label="Nome:"]').value;
  const phoneMain = document.querySelector('[data-label="Whatsapp:"]').value;
  const birthMain = document.querySelector('[data-label="Data de Nascimento:"]').value;
  const federalIdMain = document.querySelector('[data-label="CPF:"]').value;

  if (nameMain === "" || phoneMain === "" || birthMain === "" || federalIdMain === "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomerMain(nameMain, birthMain, federalIdMain, phoneMain);
}



//validar form
function validateForm() {
  const name = document.querySelector('[data-label="Nome"]').value;
  const phone = document.querySelector('[data-label="Whatsapp"]').value;
  const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
  const federalId = document.querySelector('[data-label="CPF"]').value;

  if (name === "" || phone === "" || birth === "" || federalId === "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomer(name, birth, federalId, phone);
}



