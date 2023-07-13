//API url
let apiUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let stepsUrls = 'https://credcesta.kemobuilder.site/gov/';

// obtem o cookie pelo nome 
function getCookie(name) {

  let cookie = {};

  document.cookie.split(';').forEach(function (el) {
    let [k, v] = el.split('=');
    cookie[k.trim()] = v;
  })

  return cookie[name];
}

function redirectToNextStep(n) {
  window.location.replace(`${stepsUrls + n}`);
}

//setar token
function handleSetToken(value) {
  // console.log("handleToken");
  document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=.kemobuilder.site; path=/;`;
}

//obtem o step atual pela url
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
        link.setAttribute('href', 'https://credcesta.kemobuilder.site/account');

        document.getElementById("info-return").innerHTML = `<p class="p-info-return">${response.data.message}</p>`;
        var botao = document.querySelector(".btn-lead-info");
        botao.click();

      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

//showToast
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}


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

//obtem os bancos
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


//registerCustomer
async function registerCustomer(name, birth, federalId, phone) {

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
    "phone": phone,
    "useTerms": true,
    "dataPrivacy": true,
    "dataSearchAllowed": true,
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
function validateForm() {

  const name = document.querySelector('[data-label="Nome"]').value;
  const phone = document.querySelector('[data-label="Whatsapp"]').value;
  const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
  const federalId = document.querySelector('[data-label="CPF"]').value;

  if (name == "" || phone == "" || birth == "" || federalId == "" ) {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomer(name, birth, federalId, phone);
}

getTokenStatus();

//Pegar Informações do  IP

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
