let API_URL = "https://ms-crm-az.kemosoft.com.br";
let API_KEY = "#"

/* FUNÇÕES DE EXIBIÇÃO */
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () {
        x.className = x.className.replace("show", `${text}`);
    }, 3000);
}


function validar_contato() {
    const nameElement = document.querySelector('[data-brz-label="Nome Completo"]').value;
    const federalIdElement = document.querySelector('[data-brz-label="CPF"]').value;
    const phoneElement = document.querySelector('[data-brz-label="WhatsApp"]').value;
    const enrollmentElement = document.querySelector('[data-brz-label="Matricula (Opcional)"]').value;

    if (
        nameElement == "" ||
        phoneElement == "" ||
        federalIdElement == "" ||
        enrollmentElement == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }
    if (!nameElement.trim() || !/[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(nameElement)) {
        showToast("Por favor, digite seu nome completo");
        return false;
    }
    if (!validateCPF(federalIdElement)) {
        showToast("O CPF não é válido!");
        return false;
    }
    if (!validatePhone(phoneElement)) {
        showToast("O número do Whatsapp informado não é válido!");
        return false;
    }

    criar_contato_fgts(nameElement, federalIdElement, phoneElement, enrollmentElement);
}
//CRIAR CONTATO FGTS
async function criar_contato(name, federalId, phone, enrollment) {
    //CONFIG
    const pipeline_slug = "suzano-sp"

    /* REPLACE */
    const federalId_replaced = federalId.replace(/[^\d]/g, "");
    const name_replaced = name.replace(/\s+/g, ' ');

    const button = document.querySelector(".brz-btn-submit.btnSubmit");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios.post(API_URL + '/v2/criar-contato', {
        nome: name_replaced,
        telefone: phone,
        cpf: federalId_replaced,
        matricula: enrollment,
        funil: pipeline_slug,
        urlOrigem: origin,
        urlReferencia: referrer,
    }, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then(async (response) => {
            window.location.href = "www.google.com"
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "ACEITAR E CONTINUAR";
            showToast(error.response.data.message);
        });
}
