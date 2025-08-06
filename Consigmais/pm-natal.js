// URL da API
let API_URL = "https://ms-crm-az.kemosoft.com.br";
let API_KEY = "381e75ed-12ce-4673-930a-e0815c0545dc";

function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

/* validações */
function isValidFullName(name) {
  const nameParts = name.split(" ");
  return nameParts.length >= 2 && nameParts.every((part) => part.length > 0);
}

function normalizeFullName(name) {
  return name.replace(/\s+/g, " ").trim();
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

async function getClientIPHeader() {
  const res = await fetch("https://api.ipify.org?format=json");
  const { ip } = await res.json();
  return ip;
}

async function requalifyMode(leadId) {
  const endpoint = `/v1/lead/${leadId}/requalify`;
  const payload = {
    mode: "all-banks",
  };

  try {
    const response = await axios.post(API_URL + endpoint, payload, {
      headers: {
        "api-key": API_KEY,
        "x-source": "lp",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao qualificar:",
      error?.response?.data || error.message
    );
    await logError(
      endpoint,
      payload,
      error?.response?.data?.message || error?.message || "Erro desconhecido",
      "prefeitura-de-natal"
    );
  }
}

/* scripts */
function redirectToWhatsApp(phone, message) {
  const numericPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://api.whatsapp.com/send?phone=${numericPhone}&text=${encodedMessage}`;
  window.location.href = whatsappURL;
}

async function getNextStep(cpf) {
  const endpoint = `/v1/proxima-etapa/prefeitura-de-natal/${cpf}`;

  try {
    const response = await axios.get(API_URL + endpoint, {
      headers: {
        "api-key": API_KEY,
        accept: "application/json",
        "x-source": "lp",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao obter próxima etapa:",
      error?.response?.data || error.message
    );
    await logError(
      endpoint,
      { cpf },
      error?.response?.data?.message || error?.message || "Erro desconhecido",
      "prefeitura-de-natal"
    );
    return null;
  }
}

async function validateContact() {
  const fullName = document.querySelector(
    '[data-brz-label="Nome completo"]'
  ).value;
  const whatsapp = document.querySelector('[data-brz-label="WhatsApp"]').value;
  const federalId = document.querySelector('[data-brz-label="CPF"]').value;
  const enrollment = document.querySelector(
    '[data-brz-label="Matricula (opcional)"]'
  ).value;
  const margin = document.querySelector(
    '[data-brz-label="Margem (opcional)"]'
  ).value;

  if (fullName == "" || whatsapp == "" || federalId == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  } else if (
    !fullName.trim() ||
    !/[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(fullName)
  ) {
    showToast("Por favor, digite seu nome completo");
    return false;
  } else if (!validateCPF(federalId)) {
    showToast("O CPF não é válido!");
    return false;
  } else if (!validatePhone(whatsapp)) {
    showToast("O número do Whatsapp informado não é válido!");
    return false;
  } else {
    await criar_contato(fullName, whatsapp, federalId, enrollment, margin);
  }
}

async function criar_contato(
  fullName,
  whatsapp,
  federalId,
  enrollment,
  margin
) {
  // CONFIG
  const pipeline_slug = "prefeitura-de-natal";

  // REPLACE
  const federalId_replaced = federalId.replace(/[^\d]/g, "");
  const name_replaced = fullName.replace(/\s+/g, " ");

  const button = document.querySelector(".submit-form");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");
  const icon = document.querySelector("svg.brz-icon-svg");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  icon.style.display = "none";
  span.textContent = "";

  const endpoint = "/v2/criar-contato";
  const payload = {
    nome: name_replaced,
    telefone: whatsapp,
    cpf: federalId_replaced,
    matricula: enrollment || null,
    margemDisponivelRcc: margin ? Number(String(margin).replace(/[R$\s.]/g, "").replace(",", ".")): null,
    funil: pipeline_slug,
    urlOrigem: window.location.href,
    urlReferencia: document.referrer,
    naoQualificar: false,
  };

  try {
    const response = await axios.post(API_URL + endpoint, payload, {
      headers: {
        "api-key": API_KEY,
        "x-source": "lp",
        "X-Client-IP": await getClientIPHeader(),
      },
    });

    let phone = "+558482001436";
    let message = "Olá! Gostaria de ver minha simulação!";
    redirectToWhatsApp(phone, message);
  } catch (error) {
    button.removeAttribute("disabled");
    spinner.classList.add("brz-invisible");
    icon.style.display = "";
    showToast(
      error?.response?.data?.message || "Ocorreu um erro. Tente novamente."
    );
    console.error("Erro ao criar contato:", error);

    await logError(
      endpoint,
      payload,
      error?.message || "Erro desconhecido",
      pipeline_slug
    );
  }
}

async function logError(endpoint, payload, error_message, slug) {
  try {
    await axios.post(
      "https://n8n-01-webhook.kemosoft.com.br/webhook/log_error",
      {
        endpoint,
        payload,
        error_message,
        slug,
      }
    );
  } catch (e) {
    console.warn("Erro ao registrar o log de erro:", e);
  }
}
