var urlApi = ('https://api.sheetmonkey.io/form/toQEKxvQa6TUiyLJ6td4hM');

var federalId = document.querySelector('[data-label="Deixe seu CPF"]');
var phone = document.querySelector('[data-label="Deixe seu Whatsapp"]');

if (federalId) {
  federalId.addEventListener("input", function () {
    var cpf = federalId.value;
    cpf = cpf.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    cpf = cpf.slice(0, 11); // Limita o valor do CPF a 11 dígitos
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); // Aplica a máscara de CPF
    federalId.value = cpf;
  });
}

if (phone) {
  phone.addEventListener("input", function () {
    var phoneNumber = phone.value;
    phoneNumber = phoneNumber.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    phoneNumber = phoneNumber.slice(0, 11); // Limita o valor do WhatsApp a 11 dígitos
    phoneNumber = phoneNumber.replace(/(\d{2})(\d{1,5})(\d{4})/, "($1) $2-$3"); // Aplica a máscara de WhatsApp
    phone.value = phoneNumber;
  });
}


// secondyRegisterCustomer
async function secondyRegisterCustomer(name, phone, federalId) {

    currentUrl = document.url;

    const buttonSecondy = document.querySelector('.brz-btn-secondy-submit');
    const spinner = buttonSecondy.querySelector('.brz-form-spinner');
    const span = buttonSecondy.querySelector('.brz-span.brz-text__editor');

    buttonSecondy.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';

    axios.post(urlApi, {
        name: name,
        phone: phone,
        CPF:  federalId,
        site: currentUrl
    })
        .then((response) => {
            location.reload();
        })
        .catch(function (error) {
            buttonSecondy.removeAttribute('disabled');
            spinner.classList.add('brz-invisible');
            span.textContent = 'CONTINUAR';
            showToast(error.response.data.message);
        });
}

// validateSecondyForm
function validateSecondyForm() {
    const name = document.querySelector('[data-label="Deixe seu Nome"]').value;
    const phone = document.querySelector('[data-label="Deixe seu Whatsapp"]').value;
    const federalId = document.querySelector('[data-label="Deixe seu CPF"]').value;

     if (name == "" || phone == ""|| federalId == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

    secondyRegisterCustomer(name, phone, federalId, email);
}

const buttonSecondy = document.querySelector(".brz-btn-secondy-submit");
buttonSecondy.addEventListener("click", function () {
    validateSecondyForm();
});
