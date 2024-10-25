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
  const fullNameInput = document.querySelector('[data-brz-label="Nome"]').value;
  const whatsappInput = document.querySelector('[data-brz-label="WhatsApp"]').value;
  const emailInput = document.querySelector('[data-brz-type="Email"]').value;
  const tipoServico = document.querySelector('[data-brz-label="Tipo do Serviço"]').value;
  const etapaObra = document.querySelector('[data-brz-label="Etapa da obra"]').value;

  const fullName = fullNameInput
  const whatsapp = whatsappInput
  const email = emailInput

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
