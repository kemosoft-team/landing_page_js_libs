
//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let step_URL = window.location.host;
let URL_redirect = "";
let origin = window.location.href;

let name;
let phone;
let federalId;
let birth;
let enrollment;
let name_Representive;
let federalId_Representive;
let federalId_Representive_replaced;

//EXIBIR NO TOAST
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () {
    x.className = x.className.replace("show", `${text}`);
  }, 3000);
}

/* VALIDAR WHATSAPP */
function validatePhone(phone) {
  const numericPhone = phone.replace(/\D/g, "");

  if (numericPhone.length !== 11) {
    return false;
  }

  const validDDDs = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "21",
    "22",
    "24",
    "27",
    "28",
    "31",
    "32",
    "33",
    "34",
    "35",
    "37",
    "38",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "51",
    "53",
    "54",
    "55",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "71",
    "73",
    "74",
    "75",
    "77",
    "79",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
  ];

  const firstTwoDigits = numericPhone.substring(0, 2);
  if (!validDDDs.includes(firstTwoDigits)) {
    return false;
  }

  if (numericPhone[2] !== "9") {
    return false;
  }

  const firstDigit = numericPhone[0];
  if (numericPhone.split("").every((digit) => digit === firstDigit)) {
    return false;
  }

  return true;
}

/* VALIDAR CPF */
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

// ENVIAR DADOS PARA O LOCALSTORAGE
function saveDataToLocalStorage({
  name,
  phone,
  federalId,
  birth,
  enrollment,
  name_Representive,
  federalId_Representive,
  pipelineSlug,
}) {
  var dataQualification = {
    name,
    phone,
    federalId,
    birthDate: birth,
    enrollment,
    name_Representive,
    federalId_Representive,
    pipelineSlug,
  };

  var objDataQualification = JSON.stringify(dataQualification);

  localStorage.setItem("dataQualification", objDataQualification);
}

//VALIDAR FORMULARIO
function validateFormBenefit() {
  if (name == "" || phone == "" || federalId == "" || birth == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  if (
    name.trim() === "" ||
    !name.includes(" ") ||
    !/[a-zA-ZÀ-ÿ]/.test(name.split(" ")[1])
  ) {
    showToast("Por favor, digite seu nome completo");
    return false;
  }
  if (enrollment !== "" && enrollment.length > 10) {
    showToast("O número do benefício não pode ter mais de 10 caracteres.");
    return false;
  }

  if (enrollment !== "" && !validarNumeroBeneficio(enrollment)) {
    showToast("O número do benefício informado é inválido!");
    return false;
  }

  if (!validateCPF(federalId)) {
    showToast("O CPF do Beneficiário não é válido!");
    return false;
  }
  if (!isDateValid(birth)) {
    showToast("A data de nascimento informada não é válida!");
    return false;
  }
  if (!isBirthValid(birth)) {
    showToast(
      "Ops! Você deve ter no máximo 76 anos para prosseguir com a simulação."
    );
    return false;
  }
  if (!validatePhone(phone)) {
    showToast("O número do Whatsapp informado não é válido!");
    return false;
  }

  return true;
}

function validateFormRepresentative() {
  if (name_Representive == "" || federalId_Representive == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  if (!validateCPF(federalId_Representive)) {
    showToast("O CPF do Representante não é válido!");
    return false;
  }
  if (federalId == federalId_Representive) {
    showToast(
      "Os CPFs do beneficiário e do representante devem ser diferentes!"
    );
    return false;
  }
  return true;
}

// Função para criar o elemento de spinner
function criarSpinner() {
  var spinner = document.createElement("i");
  spinner.className = "fa fa-spinner fa-spin";
  return spinner;
}

// FORMULARIO INICIAL
var submitFormBtn = document.getElementById("submit_form_initial");
var questionBtn = document.getElementById("question_representative");

submitFormBtn.addEventListener("click", function () {
  name = document.querySelector(
    '[data-brz-label="Nome do Beneficiário"]'
  ).value;
  phone = document.querySelector('[data-brz-label="WhatsApp"]').value;
  federalId = document.querySelector(
    '[data-brz-label="CPF do Beneficiário"]'
  ).value;
  birth = document.querySelector(
    '[data-brz-label="Data de Nascimento do Beneficiário"]'
  ).value;
  enrollment = document.querySelector(
    '[data-brz-label="Número do Benefício/Matrícula (Opcional)"]'
  ).value;

  if (validateFormBenefit()) {
    questionBtn.click();
  }
});

var formRepresentative = document.getElementById("form_representative");
var representative_true = document.getElementById("representative_true");
var representative_false = document.getElementById("representative_false");

//BOTÃO POSSUI REPRESENTANTE
representative_true.addEventListener("click", function () {
  document.getElementById("close_popUp").click();
  formRepresentative.click();
});

var submitRepresentative = document.getElementById(
  "submit_form_representative"
);

// FORMULARIO REPRESENTANTE
submitRepresentative.addEventListener("click", function () {
  name_Representive = document.querySelector(
    '[data-brz-label="Nome do Representante"]'
  ).value;
  federalId_Representive = document.querySelector(
    '[data-brz-label="CPF do Representante"]'
  ).value;

  if (validateFormRepresentative()) {
    submitRepresentative.innerHTML = "";
    submitRepresentative.appendChild(criarSpinner());

    if (!criar_contato_inss()) {
      representative_false.innerHTML = "NÃO possui Representante";
    }
  }
});

//BOTÃO NÃO POSSUI REPRESENTANTE
representative_false.addEventListener("click", function () {
  representative_false.innerHTML = "";
  representative_false.appendChild(criarSpinner());

  if (!criar_contato_inss()) {
    representative_false.innerHTML = "NÃO possui Representante";
  }
});

// CRIAR CONTATO INSS
async function criar_contato_inss() {
  console.log("Função criar contato iniciada")
  // CONFIG
  const nextStep = "qualification";
  const pipeline_slug = "inss";

  /* REPLACE */
  const federalId_replaced = federalId.replace(/[^\d]/g, "");

  if (federalId_Representive) {
    federalId_Representive_replaced = federalId_Representive.replace(
      /[^\d]/g,
      ""
    );
  }

   const button = document.querySelector('#submit_form_initial');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
  
  /* axios
      .post(API_URL + "/criar-contato", { */
  axios
    .post("https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb", {
      name: name,
      phone: phone,
      federalId: federalId_replaced,
      birthDate: birth,
      enrollment: enrollment,
      representativeName: name_Representive,
      representativeFederalId: federalId_Representive_replaced,
      pipelineSlug: pipeline_slug,
      origin: origin,
    })
    .then((response) => {
      saveDataToLocalStorage({
        name,
        phone,
        federalId: federalId_replaced,
        birth,
        enrollment,
        name_Representive,
        federalId_Representive: federalId_Representive_replaced,
        pipeline_slug,
      });
      window.location.href =
        nextStep + "?" + "pipeline_slug=" + pipeline_slug;
      console.log("Contato INSS criado");
    })
    .catch(function (error) {
      showToast(error.response.data.message);
      return false;
    });
}

//QUALIFICAÇÃO
function qualification() {
  //OBTER INFO DO LOCALSTORAGE
  var DataInfoQualification = localStorage.getItem("dataQualification");
  var infoQualification = JSON.parse(DataInfoQualification);

  let federalId = infoQualification.federalId;

  //OBTER INFO DA URL
  var url = new URL(window.location.href);
  var pipelineSlug = url.searchParams.get("pipeline_slug");

  axios
    .get(`${API_URL}/${pipelineSlug}/proxima-etapa/${federalId}`, {})
    .then((response) => {
      var protocol = response.data.qualificationId;
      var qualificationMessage = response.data.qualificationMessage;
      var qualificationStatus = response.data.qualificationStatus;

      switch (qualificationStatus) {
        //SUCCESS
        case "qualificado":
          URL_redirect = `${step_URL}/success?message=${qualificationMessage}&protocolo=${protocol}`;
          window.location.href = URL_redirect;
          break;

        //SUCCESS
        case "nao-identificado":
          URL_redirect = `${step_URL}/success?message=${qualificationMessage}&protocolo=${protocol}`;
          window.location.href = URL_redirect;
          break;

        //NOQUALIFIED
        case "nao-qualificado":
          URL_redirect = `${step_URL}/noqualified?message=${qualificationMessage}&protocolo=${protocol}`;
          window.location.href = URL_redirect;
          break;

        default:
          URL_redirect = `${step_URL}/offline?message=${qualificationMessage}&protocolo=${protocol}`;
          window.location.href = URL_redirect;

          break;
      }
    })
    .catch(function (error) {
      console.log(error, "Não foi possível obter a qualificação");
    });
}

