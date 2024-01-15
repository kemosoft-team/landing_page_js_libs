
var forms = document.querySelector(".brz-form");
forms.removeAttribute("action");


//VARIAVEIS DE CONTROLE
var isBuy = false;
var isService = false;

var form = document.querySelector("#form");

//ABRIR O FORMULARIO DE COMPRA
var btnBuy = document.querySelectorAll("#btnBuy");
btnBuy.forEach(function (btn) {
  btn.addEventListener("click", function () {
    isBuy = true;
    form.click();
    console.log("formulario de compra: " + isBuy);
  });
});

//ABRIR O FORMULARIO DE ATENDIMENTO
var btnService = document.querySelectorAll("#btnService");
btnService.forEach(function (btn) {
  btn.addEventListener("click", function () {
    form.click();
    isService = true;
    console.log("formulario de atendimento: " + isService);
  });
});

var closeForm = document.querySelector("#closeForm");
closeForm.addEventListener("click", function () {
  isBuy = false;
  isService = false;
  console.log("compra: " + isBuy);
  console.log("Atendimento: " + isService);
});

//SCRIPT PRINCIPAIS
//EXIBIR NO TOAST
function showToast(text) {
  console.log("Snackbar!!!");
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () {
    x.className = x.className.replace("show", `${text}`);
  }, 3000);
}

function validateForm() {
  const name = document.querySelector('[data-brz-label="Nome"]').value;
  const phone = document.querySelector('[data-brz-label="WhatsApp"]').value;
  const email = document.querySelector('[data-brz-label="Email"]').value;

  if (name == "" || phone == "" || email == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  } else {
    postKommo(name, phone, email);
    console.log("Executar função postKommo");
  }
}

var btnSubmit = document.querySelectorAll(".brz-btn-submit");
btnSubmit.forEach(function (button) {
  button.addEventListener("click", function () {
    validateForm();
  });
});

function postKommo(name, phone, email) {
  const API_URL = "https://n8n.kemosoft.com.br/webhook/new-lead";
  /* const API_URL = "https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb"; */

  const button = document.querySelector(".brz-btn-submit");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  axios
    .post(
      API_URL,
      {
        record: {
          name: name,
          email: email,
          phone: phone,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      if (isBuy == true) {
        const redirectUrl = `https://checkout.summersales.com.br/?nm=${name}&ph=${phone}&ml=${email}`;
        window.location.href = redirectUrl;
      } else if (isService == true) {
        const redirectUrl = `https://api.whatsapp.com/send?phone=558496954147&text=Ol%C3%A1,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20Summer%20Sales!`;
        window.location.href = redirectUrl;
      }
    })
    .catch(function (error) {
      showToast(error.response.data.message);
    });
}

