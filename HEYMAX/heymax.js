let base_URL = "https://api.sheetmonkey.io/form/xqotGSzd3yZio9HFudvvCk";
let base_URL_API = "https://app.heymax.io/partner-api";
let api_key = config.api_key;

//EXIBIR NO TOAST
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () {
    x.className = x.className.replace("show", `${text}`);
  }, 3000);
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

function validatorForm_popup() {
  const identifier = "popup";
  const name = document.querySelector('[data-brz-label="Nome"]').value;
  const whatsapp = document.querySelector(
    '[data-brz-label="WhatsApp"]'
  ).value;

  if (name == "" || whatsapp == "") {
    showToast("Por favor, preencha todos os campos!");
    return false;
  }
  if (!validatePhone(whatsapp)) {
    showToast("Insira um Whatsapp válido!");
    return false;
  }

  criarContato(name, whatsapp, identifier);
}

function validatorForm_form() {
  const identifier = "form";
  const name = document.querySelector('[data-brz-label="Nome:"]').value;
  const whatsapp = document.querySelector(
    '[data-brz-label="WhatsApp:"]'
  ).value;

  if (name == "" || whatsapp == "") {
    showToast(
      "Por favor, preencha o campo com o seu nome que deseja ser chamado!"
    );
    return false;
  } else if (!validatePhone(whatsapp)) {
    showToast("Insira um Whatsapp válido!");
    return false;
  } else {
    criarContato(name, whatsapp);
  }
}

function criarContato(name, whatsapp, identifier) {
  axios
    .get(`${base_URL}`, {
      name: name,
      phone: whatsapp,
    })
    .then(() => {
      switch (identifier) {
        case "popup":
          window.location.href = "www.google.com";
          break;
        case "form":
          window.location.href = "www.instagram.com";
          break;
      }
    })
    .catch(function (error) {
      console.log(error, "Não foi possível criar o contato");
    });
}





