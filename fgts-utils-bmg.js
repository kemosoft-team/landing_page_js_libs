let apiBaseUrl = "https://api.consigmais.com.br/lp/main/v2";
let stepsUrl = window.location.origin+'/';

// obtem o cookie pelo nome
function getCookie(name) {
  let cookie = {};

  document.cookie.split(";").forEach(function (el) {
    let [k, v] = el.split("=");
    cookie[k.trim()] = v;
  });

  return cookie[name];
}

//inicia spin loading no button
function setLoading() {
  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";
}

//para spin loading no button
function stopLoading(textButton) {
  button.removeAttribute("disabled");
  spinner.classList.add("brz-invisible");
  span.textContent = textButton;
}

function redirectToNextStep(res) {
  const param = window.location.search || "";
  const nextStep = res.nextStep;

  switch (nextStep) {
    case "signature":
      window.location.href =
        stepsUrl +
        nextStep +
        param +
        "&" +
        encodeURIComponent(JSON.stringify(res.formalizatioLink));
      break;
    case "scheduled":
      window.location.href =
        stepsUrl +
        nextStep +
        "?" +
        param +
        "&scheduledTo=" +
        encodeURIComponent(JSON.stringify(res.scheduledTo));

      break;
    default:
      window.location.href = stepsUrl + nextStep + param;
      break;
  }
}

function setNextStep() {
  axios
    .post(
      apiBaseUrl + "/getTokenStatus",
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("tkn")}`,
        },
      }
    )
    .then(function (response) {
      window.location.href = stepsUrl + response.data.nextStep;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function setLinkSignature() {
  var encodedData = window.location.search.substring(1);
  const decodedValue = decodeURIComponent(encodedData);
  const link = document.querySelector(".brz-a");
  link.href = decodedValue;
}

function setSchedule() {
  window.addEventListener("DOMContentLoaded", function () {
    var currentURL = window.location.href;

    var datePattern = /(\d{4}-\d{2}-\d{2})/;

    var match = currentURL.match(datePattern);

    if (match && match[1]) {
      var dateParts = match[1].split("-");

      var formattedDate =
        dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];

      var scheduleElement = document.getElementById("schedule");
      var currentText = scheduleElement.textContent;
      var modifiedText = currentText.replace("xx/xx/xxxx", formattedDate);

      scheduleElement.textContent = modifiedText;
      scheduleElement.style.fontFamily = "Montserrat";
      scheduleElement.style.fontSize = "20px";
      scheduleElement.style.color = "#706666";
      scheduleElement.style.fontWeight = "700";
      scheduleElement.style.marginTop = "32px";
      scheduleElement.style.marginBottom = "22px";
    }
  });
}

//setar token
function handleSetToken(value) {
  // console.log("handleToken");
  document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=eccor-fgts.faz.vc; path=/;`;
}

//obtem o step atual pela url
function getCurrentStep() {
  const path = window.location.pathname;
  const value = path.split("/")[1];
  return value;
}

//showToast
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () {
    x.className = x.className.replace("show", `${text}`);
  }, 3000);
}

//removerAtributos
function removeAttributeStorage() {
  localStorage.removeItem("attemptsAuth");
  localStorage.removeItem("attemptsCatch");
  localStorage.removeItem("attempts");
}

//get Token Status info-return
function getTokenStatus() {
  if (getCookie("tkn")) {
    axios
      .post(
        apiBaseUrl + "/getTokenStatus",
        {},
        {
          headers: {
            Authorization: `Bearer ${getCookie("tkn")}`,
          },
        }
      )
      .then(function (response) {
        const param = window.location.search || "";

        const link = document.querySelector("a.btn-continue");
        link.setAttribute(
          "href",
          stepsUrl +
            response.data.nextStep +
            param +
            "?scheduledTo=" +
            response.data.scheduledTo
        );

        link.addEventListener("click", removeAttributeStorage());

        document.getElementById(
          "info-return"
        ).innerHTML = `<p class="p-info-return">${response.data.message}</p>`;

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
    affiliateCode: urlParams.get("af") || "Vv5P88AWTr7qsU8v8",
    source: urlParams.get("source") || null,
    productId: urlParams.get("pid") || null,
    vendorId: urlParams.get("vid") || null,
    offerId: "18",
    clickId: urlParams.get("cid") || null,
    pixelId: urlParams.get("afx") || null,
    gtmId: urlParams.get("afgtm") || null,
    latDays: urlParams.get("latd") || null,
    brandId: urlParams.get("bid") || null,
    nextStep: urlParams.get("nxstp") || null,
    token: urlParams.get("tkn") || null,
    rawUri: window.location.search,
  };
  return affiliateData;
}

//setBanks
function setBanks(bankList) {
  bankList.reverse();
  const selects = document.querySelectorAll('select[data-brz-label="Banco"]');

  selects.forEach((select) => {
    bankList.forEach((bank) => {
      const option = document.createElement("option");
      option.text = bank.name;
      option.value = bank.id;
      select.insertBefore(option, select.firstChild);
    });
  });
}

//obtem os bancos
async function getBanks() {
  axios
    .post(
      apiBaseUrl + "/getData",
      { object: "banks" },
      {
        headers: {
          Authorization: `Bearer ${getCookie("tkn")}`,
        },
      }
    )
    .then(function (response) {
      setBanks(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function getByZipCodeInfo(zipcode) {
  axios
    .post(
      apiBaseUrl + "/getZipcodeInfo",
      {
        zipcode: zipcode,
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie("tkn")}`,
        },
      }
    )
    .then((response) => {
      setAddressInfo(response.data);
    })
    .catch(function (error) {
      showToast(error.response.data.message);
    });
}

function setAddressInfo(obj) {
  document.querySelector('[data-brz-label="Rua"]').value = obj.address;
  document.querySelector('[data-brz-label="Bairro"]').value = obj.district;
  document.querySelector('[data-brz-label="Cidade"]').value = obj.city;
  document.querySelector('[data-brz-label="UF"]').value = obj.state;
}

//registerCustomerAccount
async function registerCustomerAddress(
  zipcode,
  address,
  addressNumber,
  state,
  district,
  city
) {
  const button = document.querySelector(".brz-btn-submit");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  axios
    .post(
      apiBaseUrl + "/registerCustomerInfos",
      {
        zipcode: zipcode,
        address: address,
        addressNumber: addressNumber,
        state: state,
        district: district,
        city: city,
        currentStep: getCurrentStep(),
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie("tkn")}`,
        },
      }
    )
    .then((response) => {
      redirectToNextStep(response.data);
    })
    .catch(function (error) {
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      span.textContent = "Sim, quero antecipar meu FGTS!";
      showToast(error.response.data.message);
    });
}

//registerCustomerAccount
async function registerCustomerAccount(
  agency,
  bank,
  account,
  verifyDigit,
  accountType
) {
  const button = document.querySelector(".brz-btn-submit");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  axios
    .post(
      apiBaseUrl + "/registerCustomerInfos",
      {
        branchNo: agency,
        bankId: bank,
        acctNo: `${account}-${verifyDigit}`,
        acctType: accountType,
        currentStep: getCurrentStep(),
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie("tkn")}`,
        },
      }
    )
    .then((response) => {
      redirectToNextStep(response.data);
    })
    .catch(function (error) {
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      span.textContent = "Continuar";
      showToast(error.response.data.message);
    });
}

// registerCustomerAccount
async function registerCustomerDocs(
  docNumber,
  docType,
  issueState,
  motherName
) {
  const button = document.querySelector(".brz-btn-submit");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  axios
    .post(
      apiBaseUrl + "/registerCustomerInfos",
      {
        docNumber: docNumber,
        docType: docType,
        docState: issueState,
        mother: motherName,
        currentStep: getCurrentStep(),
      },
      {
        headers: {
          Authorization: `${getCookie("tkn")}`,
        },
      }
    )
    .then((response) => {
      redirectToNextStep(response.data);
    })
    .catch(function (error) {
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      span.textContent = "Sim, quero antecipar meu FGTS!";
      showToast(error.response.data.message);
    });
}

//registerCustomer
async function registerCustomer(name, birth, federalId, phone, email) {
  removeAttributeStorage();
  const affiliate = captureAffiliateData();

  const button = document.querySelector(".btn-submit-fgts");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  axios
    .post(apiBaseUrl + "/registerCustomer", {
      name: name,
      birth: birth,
      federalId: federalId,
      phone: phone,
      email: email,
      useTerms: true,
      dataPrivacy: true,
      dataSearchAllowed: true,
      affiliateData: affiliate,
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
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      span.textContent = "ACEITAR E CONTINUAR";
      showToast(error.response.data.message);
    });
}

function getNextStep(path) {
  const button = document.querySelector(".brz-btn-submit");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  if (path == "noBalance" || path == "authorize" || path == "enable") {
    window.location.href = stepsUrl + path;
  } else {
    var elementsWait = document.getElementsByClassName("wait");
    var elementsSuccess = document.getElementsByClassName("success");

    for (var i = 0; i < elementsWait.length; i++) {
      elementsWait[i].style.display = "none";
      elementsSuccess[i].style.display = "block";
    }

    button.removeAttribute("disabled");
    spinner.classList.add("brz-invisible");
    span.textContent = "Dê o próximo passo, preencha seus dados";

    button.addEventListener("click", function () {
      window.location.href = stepsUrl + path;
    });
  }
}

// Qualifica o lead
function processQualification() {
  let attempts = localStorage.getItem("attempts") || 0;
  let attemptsAuth = localStorage.getItem("attemptsAuth") || 0;
  let attemptsCatch = localStorage.getItem("attemptsCatch") || 0;

  let minimize = localStorage.getItem("minimize") || false;

  const button = document.querySelector(".brz-btn-submit");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  const sendRequest = () => {
    axios
      .post(
        apiBaseUrl + "/registerCustomerInfos",
        {
          enable: true,
          authorize: true,
          currentStep: getCurrentStep(),
        },
        {
          headers: {
            Authorization: `${getCookie("tkn")}`,
          },
        }
      )
      .then((response) => {
        var switchNextStep = response.data.nextStep;
        console.log(switchNextStep);

        switch (switchNextStep) {
          case "enable":
            console.log("case enable");
            getNextStep(response.data.nextStep);
            attempts++;

            localStorage.setItem("attempts", attempts);
            break;
          case "authorize":
            console.log("case authorize");
            getNextStep(response.data.nextStep);
            attemptsAuth++;

            localStorage.setItem("attemptsAuth", attemptsAuth);
            break;
          case "keepcalm":
            console.log("case keepcalm");

            attemptsCatch++;
            if (attemptsCatch < 2) {
              sendRequest();
            } else {
              window.location.href = stepsUrl + "offline";
            }

            localStorage.setItem("attemptsCatch", attemptsCatch);
            break;
          default:
            console.log("default");
            getNextStep(response.data.nextStep);
            attempts++;
            attemptsAuth++;

            localStorage.setItem("attempts", attempts);
            localStorage.setItem("attemptsAuth", attemptsAuth);
            break;
        }
      })
      .catch(function (error) {
        attemptsCatch++;
        if (attemptsCatch < 2) {
          sendRequest();
        } else {
          window.location.href = stepsUrl + "offline";
        }
      });
  };

  sendRequest();

  // Salve os valores finais no localStorage
  localStorage.setItem("attempts", attempts);
  localStorage.setItem("attemptsAuth", attemptsAuth);
  localStorage.setItem("minimize", minimize);
  localStorage.setItem("attemptsCatch", attemptsCatch);
}

//validarFormDocs
function validarFormAddress() {
  const zipcode = document.querySelector('[data-brz-label="CEP"]').value;
  const address = document.querySelector('[data-brz-label="Rua"]').value;
  const addressNumber = document.querySelector(
    '[data-brz-label="Número"]'
  ).value;
  const state = document.querySelector('[data-brz-label="UF"]').value;
  const district = document.querySelector('[data-brz-label="Bairro"]').value;
  const city = document.querySelector('[data-brz-label="Cidade"]').value;

  if (
    zipcode == "" ||
    address == "" ||
    addressNumber == "" ||
    state == "" ||
    district == "" ||
    city == ""
  ) {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerAddress(
    zipcode,
    address,
    addressNumber,
    state,
    district,
    city
  );
}

//validarFormDocs
function validarFormDocs() {
  const docType = document.querySelector(
    '[data-brz-label="Tipo de Documento"]'
  ).value;
  const docNumber = document.querySelector(
    '[data-brz-label="Número do Documento"]'
  ).value;
  const issueState = document.querySelector(
    '[data-brz-label="UF Expeditor"]'
  ).value;
  const motherName = document.querySelector(
    '[data-brz-label="Nome da sua Mãe"]'
  ).value;

  if (
    docType == "" ||
    docNumber == "" ||
    issueState == "" ||
    motherName == ""
  ) {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  registerCustomerDocs(docNumber, docType, issueState, motherName);
}

function validarFormAccount() {
  const agency = document.querySelector('[data-brz-label="Agência"]').value;
  const bank = document.querySelector('[data-brz-label="Banco"]').value;
  const account = document.querySelector('[data-brz-label="Conta"]').value;
  const verifyDigit = document.querySelector(
    '[data-brz-label="Dígito"]'
  ).value;
  const accountType = document.querySelector(
    '[data-brz-label="Tipo de conta"]'
  ).value;

  if (
    agency == "" ||
    bank == "" ||
    account == "" ||
    verifyDigit == "" ||
    accountType == ""
  ) {
     showToast("Por favor, preencha todos os campos.");
    return false;
  }

  const accountTypeCut = accountType.charAt(0).toString();
  registerCustomerAccount(agency, bank, account, verifyDigit, accountTypeCut);
}

//validar form
function validateForm() {
  const name = document.querySelector('[data-brz-label="Nome"]').value;
  const phone = document.querySelector('[data-brz-label="Whatsapp"]').value;
  const email = document.querySelector('[data-brz-label="Email (Opcional)"]').value;
  const birth = document.querySelector(
    '[data-brz-label="Data de Nascimento"]'
  ).value;
  const federalId = document.querySelector('[data-brz-label="CPF"]').value;

  if (
    name == "" ||
    phone == "" ||
    birth == "" ||
    federalId == ""
  ) {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomer(name, birth, federalId, phone, email);
}

getTokenStatus();
