var urlApi = ('https://api.sheetmonkey.io/form/toQEKxvQa6TUiyLJ6td4hM');

var federalId = document.querySelector('[data-label="Deixe seu CPF"]');
var phone = document.querySelector('[data-label="Deixe seu Whatsapp"]');

if (federalId) {
    federalId.setAttribute("inputmode", "numeric");
    phone.setAttribute("inputmode", "numeric");
    federalId.addEventListener("input", function() {
        var e = federalId.value;
        e = (e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        federalId.value = e;
    });
}

if (phone) {
    phone.addEventListener("input", function() {
        var e = phone.value;
        e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{2})(\d)/, "($1) $2")).replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3");
        phone.value = e;
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
