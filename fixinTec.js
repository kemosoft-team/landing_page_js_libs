// Nova URL da API
let API_URL = "https://n8n-01-webhook.kemosoft.com.br/webhook/fixin";

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

function validatePhone(phone) {
  const numericPhone = phone.replace(/\D/g, "");
  if (numericPhone.length !== 11) return false;

  const validDDDs = [
    /* Lista de DDDs válidos... */
  ];
  const firstTwoDigits = numericPhone.substring(0, 2);
  if (!validDDDs.includes(firstTwoDigits)) return false;

  if (numericPhone[2] !== "9") return false;

  const firstDigit = numericPhone[0];
  if (numericPhone.split("").every((digit) => digit === firstDigit))
    return false;

  return true;
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/* scripts */
function redirectToWhatsApp(phone, message) {
  const numericPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://api.whatsapp.com/send?phone=${numericPhone}&text=${encodedMessage}`;
  window.location.href = whatsappURL;
}

async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Erro ao obter IP:", error);
    return null;
  }
}

function validateContact() {
  const fullNameInput = document.querySelector('input[data-brz-label="Nome"]');
  const whatsappInput = document.querySelector(
    'input[data-brz-label="WhatsApp"]'
  );
  const emailInput = document.querySelector('input[data-brz-type="Email"]');

  // Captura o valor renderizado para "Tipo do Serviço"
  const tipoServicoInput = document.querySelector(
    "#select2-gnpLz98n616K_56b1a469c591730c47ec-container"
  );
  const tipoServico = tipoServicoInput
    ? tipoServicoInput.textContent.trim()
    : "";

  // Captura o valor renderizado para "Etapa da obra"
  const etapaObraInput = document.querySelector(
    "#select2-iKYUW2eh_Dkc_2fc0a4f7ff863333d32c-container"
  );
  const etapaObra = etapaObraInput ? etapaObraInput.textContent.trim() : "";

  const fullName = fullNameInput.value.trim();
  const whatsapp = whatsappInput.value.trim();
  const email = emailInput.value.trim();

  const validations = [
    { check: () => !fullName, message: "Por favor, insira seu nome completo." },
    {
      check: () => !whatsapp,
      message: "Por favor, insira seu número de WhatsApp.",
    },
    { check: () => !email, message: "Por favor, insira seu email." },
    {
      check: () => !tipoServico,
      message: "Por favor, selecione um tipo de serviço.",
    },
    {
      check: () => !etapaObra,
      message: "Por favor, selecione a etapa da obra.",
    },
    {
      check: () => !isValidFullName(fullName),
      message: "Por favor, insira um nome completo válido.",
    },
    {
      check: () => !validatePhone(whatsapp),
      message: "Número de WhatsApp inválido. Certifique-se e tente novamente!",
    },
    {
      check: () => !validateEmail(email),
      message: "Email inválido. Por favor, insira um email válido.",
    },
  ];

  for (const validation of validations) {
    if (validation.check()) {
      showToast(validation.message);
      return false;
    }
  }

  createContact(
    normalizeFullName(fullName),
    whatsapp,
    email,
    tipoServico,
    etapaObra
  );
}

async function createContact(
  fullName,
  whatsapp,
  email,
  tipoServico,
  etapaObra
) {
  // Obter parâmetros da URL
  const urlParams = getURLParams();

  const button = document.querySelector(".submit");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  const userIP = await getUserIP();

  axios
    .post(API_URL, {
      nome: fullName,
      telefone: whatsapp,
      email: email,
      tipoServico: tipoServico,
      etapaObra: etapaObra,
      client: urlParams,
      ip: userIP,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    })
    .then((response) => {
      const phone = "+5584981365810";
      const message =
        "Olá, vim pelo site e gostaria de falar com um especialista sobre Automações!";
      redirectToWhatsApp(phone, message);
    })
    .catch((error) => {
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      showToast("Ocorreu um erro. Tente novamente.");
      console.error("Erro ao criar contato:", error);
    });
}
