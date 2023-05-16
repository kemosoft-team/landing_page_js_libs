let apiBaseUrl = 'https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb';
let stepsUrl = 'https://infos.faz.vc/';
const oid = '?oid=11';


function redirectToNextStep(n) {
  window.location.replace(`${stepsUrl + oid}`);
}


//registerCustomer
async function registerCustomer(name, federalId, phone, birth) {


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
    "dataSearchAllowed": true
  })
    .then((response) => {
      redirectToNextStep(response.data.nextStep);
      

    })
    .catch(function (error) {
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'ACEITAR E CONTINUAR';
      showToast(error.response.data.message);
    });
}

// validateForm
function validateForm() {
  const name = document.querySelector('[data-label="Nome"]').value;
  const federalId = document.querySelector('[data-label="CPF"]').value;
  const phone = document.querySelector('[data-label="Whatsapp"]').value;
  const birth = document.querySelector('[data-label="Data de Nascimento"]').value;

  if (name == "" || federalId == "" || phone == "" || birth == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomer(name, federalId, phone, birth);
}

const buttonSubmit = document.querySelector(".brz-btn-submit");
buttonSubmit.addEventListener("click", validateForm);


//showToast
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}











