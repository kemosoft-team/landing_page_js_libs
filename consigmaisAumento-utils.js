//API url
let API_URL = 'https://api.consigmais.com.br/lp/main/v2';
let step_URL = window.location.host + "/";


//Exibe mensagem no toast
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}




//OBTER PARAMETROS DO AFILIADO
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

//VALIDAR CPF
function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "");
  if (cpf.length !== 11) return false;
  let sum = 0,
    remainder;

  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
}

//VALIDAR ENROLLMENT
function validarNumeroBeneficio(numeroBeneficio) {
  var regexBeneficio = /^[0-9]{10}$/;

  if (regexBeneficio.test(numeroBeneficio)) {
    var sequenciaRepetida = /(\d)\1{9}/;

    if (sequenciaRepetida.test(numeroBeneficio)) {
      return false;
    }

    return true;
  }

  return false;
}

//VALIDAR DATA
function isDateValid(dateString) {
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!datePattern.test(dateString)) {
    return false;
  }

  const [, day, month, year] = dateString.match(datePattern);

  const dayInt = parseInt(day, 10);
  const monthInt = parseInt(month, 10);
  const yearInt = parseInt(year, 10);

  if (yearInt < 1900 || yearInt > 2099) {
    return false;
  }

  const date = new Date(yearInt, monthInt - 1, dayInt);
  if (
    date.getDate() === dayInt &&
    date.getMonth() === monthInt - 1 &&
    date.getFullYear() === yearInt
  ) {
    return true;
  }

  return false;
}

//VALIDA DATA DE NASCIMENTO MAX
function isBirthValid(dateString) {
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!datePattern.test(dateString)) {
    return false;
  }

  const [, , , year] = dateString.match(datePattern);

  const yearInt = parseInt(year, 10);

  const currentDate = new Date();
  const maxBirthYear = currentDate.getFullYear();

  if (maxBirthYear - yearInt > 76) {
    return false;
  }

  return true;
}

//registerCustomer
async function registerCustomer(name, phone, federalId, birth, enrollment, name_Representive, federalId_Representive) {

  const affiliate = captureAffiliateData();

  const button = document.querySelector('.btn-submit-fgts');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  axios.post(API_URL + '/registerCustomer', {
    "name": name,
    "phone": phone,
    "federalId": federalId,
    "birthDate": birth,
    "enrollment": enrollment,
    "name_Representive": name_Representive,
    "name_Representive": name_Representive,
    "federalId_Representive": federalId_Representive,

    "pipelineId": "string",
    "productId": "string",

    //"affiliateData": affiliate
  })
    .then((response) => {
      console.log("Deu bom!")
    })
    .catch(function (error) {
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'Simular Agora!';
      showToast(error.response.data.message);
    });
}

//valida form
function validateForm() {

  const name = document.querySelector('[data-brz-label="Nome do Beneficiário"]').value;
  const phone = document.querySelector('[data-brz-label="WhatsApp"]').value;
  const federalId = document.querySelector('[data-brz-label="CPF do Beneficiário"]').value;
  const birth = document.querySelector('[data-brz-label="Data de Nascimento do Beneficiário"]').value;
  const enrollment = document.querySelector('[data-brz-label="Matrícula"]').value;
  const representativeSelect = document.querySelector('[data-brz-label="O Benefício possui representante legal ?"]').value;
  const name_Representive = document.querySelector('[data-brz-label="Nome do Representante"]');
  const federalId_Representive = document.querySelector('[data-brz-label="CPF do Representante"]');

  if (name == "" ||
    phone == "" ||
    federalId == "" ||
    birth == "" ||
    enrollment == "" ||
    representativeSelect == "" ||
    name_Representive == "" ||
    federalId_Representive == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  } else if (representativeSelect == 'Possui Representante' && (federalId_Representive == "" || name_Representive == "")) {
    showToast("Por favor, preencha todos os campos.");
    return false;
  } else if (federalId == federalId_Representive) {
    showToast("Os CPFs do beneficiário e do representante devem ser diferentes!");
    return false;
  } else if (!validateCPF(federalId)) {
    showToast("O CPF informado não é válido!");
    return false;
  } else if (enrollment.length > 10) {
    showToast("O número do benefício não pode ter mais de 10 caracteres."
    );
    return false;
  } else if (!validarNumeroBeneficio(enrollment)) {
    showToast("O número do benefício informado é inválido!"
    );
    return false;
  } else if (!isDateValid(birth)) {
    showToast("A data de nascimento informada não é válida!"
    );
    return false;
  } else if (!isBirthValid(birth)) {
    showToast("Ops! Você deve ter no máximo 76 anos para prosseguir com a simulação."
    );
    return false;
  }

  registerCustomer(name, phone, federalId, birth, enrollment, name_Representive, federalId_Representive);
}
