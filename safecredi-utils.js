//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br";
let API_KEY = "";

function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () {
    x.className = x.className.replace("show", `${text}`);
  }, 3000);
}

function isValidFullName(name) {
  const nameParts = name.split(" ");
  if (nameParts.length < 2) return false;

  return nameParts.every((part) => part.length > 0);
}

function normalizeFullName(name) {
  return name.replace(/\s+/g, " ").trim();
}

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

function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "");
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
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

function redirectToWhatsApp(phone, message) {
  const numericPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://api.whatsapp.com/send?phone=${numericPhone}&text=${encodedMessage}`;

  window.location.href = whatsappURL;
}

function setItemStorage(fullName, federalId) {
  var dataQualification = {
    federalId,
    fullName,
  };
  var objDataQualification = JSON.stringify(dataQualification);
  localStorage.setItem("dataQualification", objDataQualification);
}

function getItemStorage() {
  const dataQualificationLocalStorage =
    localStorage.getItem("dataQualification");
  const storedDataQualification = JSON.parse(dataQualificationLocalStorage);

  return {
    fullName: storedDataQualification.fullName,
    federalId: storedDataQualification.federalId,
  };
}

function validateContact() {
  const fullNameInput = document.querySelector(
    'input[data-brz-label="Nome completo"]'
  );
  const federalIdInput = document.querySelector('input[data-brz-label="CPF"]');
  const birthInput = document.querySelector(
    'input[data-brz-label="Data de Nascimento"]'
  );
  const whatsappInput = document.querySelector(
    'input[data-brz-label="WhatsApp"]'
  );

  const fullName = fullNameInput.value.trim();
  const federalId = federalIdInput.value.trim();
  const birth = birthInput.value.trim();
  const whatsapp = whatsappInput.value.trim();

  const validations = [
    {
      check: () => !fullName || !isValidFullName(fullName),
      message: "Por favor, insira seu nome completo.",
    },
    {
      check: () => !validateCPF(federalId),
      message: "CPF inválido. Verifique e tente novamente.",
    },
    {
      check: () => !isDateValid(birth),
      message: "Data de nascimento inválida.",
    },
    {
      check: () => !validatePhone(whatsapp),
      message: "Número de WhatsApp inválido. Certifique-se e tente novamente!",
    },
  ];

  for (const validation of validations) {
    if (validation.check()) {
      showToast(validation.message);
      return false; 
    }
  }

  createContact(normalizeFullName(fullName), federalId, birth, whatsapp);
}

async function createContact(fullName, federalId, birth, whatsapp) {
  const federalId_replaced = federalId.replace(/[^\d]/g, "");
  const pipeline_slug = "fgts";

  const button = document.querySelector(".submit_contact");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  axios
    .post(
      API_URL + "/v2/criar-contato",
      {
        nome: fullName,
        telefone: whatsapp,
        dataNascimento: birth,
        cpf: federalId_replaced,
        funil: pipeline_slug,
        urlOrigem: window.location.href,
        urlReferencia: document.referrer,
      },
      {
        headers: {
          "api-key": API_KEY,
        },
      }
    )
    .then((response) => {
      setItemStorage(fullName, federalId);

      const phone = "+558440421006";
      const message = "Olá! Gostaria de concluir a minha simulação!";
      redirectToWhatsApp(phone, message);
    })
    .catch(function (error) {
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      span.textContent = "ACEITAR E CONTINUAR";
      showToast(error.response.data.message);
    });
}
