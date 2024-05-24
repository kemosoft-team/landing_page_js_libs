/* ROOT */
base_URL = "";

/* CONFIGURAÇÕES */

/* ABRIR E FECHAR MODAL */
document.querySelectorAll(".btn-open-formFGTS").forEach(function (button) {
    button.addEventListener("click", function () {
        var modal = document.querySelector(".background-modal");
        var formulario = document.querySelector(".initial-form");
        modal.style.display = "flex";
        formulario.style.display = "block";
    });
});

document.querySelectorAll(".close-modal").forEach(function (button) {
    button.addEventListener("click", function () {
        var modal = document.querySelector(".background-modal");
        modal.style.display = "none";
    });
});

document.querySelectorAll(".button-back").forEach(function (button) {
    button.addEventListener("click", function () {
        showPreviousQuestion(1);
    });
});

document.querySelectorAll(".button-back-two").forEach(function (button) {
    button.addEventListener("click", function () {
        showPreviousQuestion(2);
    });
});

/* MASCARAS */
var phoneMask = document.querySelector("#phone");
var federalIdMask = document.querySelector("#federalId");
var birthMask = document.querySelector("#birth");

if (phoneMask) {
    phoneMask.setAttribute("inputmode", "numeric");
    phoneMask.addEventListener("input", function () {
        var value = this.value.replace(/\D/g, '');
        value = value.substring(0, 11);
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{1})(\d{4})(\d{4})$/, '$1 $2-$3');
        this.value = value;
    });
}

if (federalIdMask) {
    federalIdMask.setAttribute("inputmode", "numeric");
    federalIdMask.addEventListener("input", function () {
        var value = this.value.replace(/\D/g, '');
        value = value.substring(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = value;
    });
}

if (birthMask) {
    birthMask.addEventListener("input", function () {
        var e = birthMask.value;
        (e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 8)).replace(
            /(\d{2})(\d)/,
            "$1/$2"
        )).replace(/(\d{2})(\d)/, "$1/$2")),
            (birthMask.value = e);
    });
}

/* SVG */
function displayValidationSVG(svgElement, isValid) {
    if (isValid) {
        svgElement.innerHTML = `<svg width="20" height="20" fill="#0fc144" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25Zm-1.781 14.643L6.44 12.694l1.115-1.003 2.625 2.916 6.225-7.414 1.15.963-7.337 8.737Z"></path></svg>`;
    } else {
        svgElement.innerHTML = `<svg width="20" height="20" fill="#ff0000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25ZM16.06 15 15 16.06l-3-3-3 3L7.94 15l3-3-3-3L9 7.94l3 3 3-3L16.06 9l-3 3 3 3Z"></path></svg>`;
    }
    svgElement.style.display = "inline-block";
}

/* Validação de Nome */
function validateFullName(input) {
    const fullNameError = document.getElementById("fullNameError");
    const validationDiv = input.nextElementSibling;
    const fullName = input.value.trim();
    const fullNameRegex = /^[a-zA-ZáÁéÉíÍóÓúÚâÂêÊîÎôÔûÛãÃõÕçÇ ]+$/;

    if (!fullNameRegex.test(fullName)) {
        displayValidationSVG(validationDiv, false);
        fullNameError.textContent =
            "Digite um nome válido (apenas letras e espaços).";
        return false;
    }

    const parts = fullName.split(" ");
    if (parts.length < 2 || parts.some((part) => part.length < 2)) {
        displayValidationSVG(validationDiv, false);
        fullNameError.textContent = "Digite seu nome completo.";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    fullNameError.textContent = "";
    return true;
}

/* Validação de CPF */
function validateCPF(input) {
    const federalIdError = document.getElementById("federalIdError");
    const validationDiv = input.nextElementSibling;
    const federalId = input.value.replace(/\D/g, "");

    if (federalId.length !== 11) {
        displayValidationSVG(validationDiv, false);
        federalIdError.textContent = "Digite um CPF válido com 11 dígitos.";
        return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(federalId.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(federalId.substring(9, 10))) {
        displayValidationSVG(validationDiv, false);
        federalIdError.textContent = "Digite um CPF válido.";
        return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(federalId.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(federalId.substring(10, 11))) {
        displayValidationSVG(validationDiv, false);
        federalIdError.textContent = "Digite um CPF válido.";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    federalIdError.textContent = "";
    return true;
}

/* Validação de Telefone */
function validatePhone(input) {
    const phoneError = document.getElementById("phoneError");
    const validationDiv = input.nextElementSibling;
    const phone = input.value.replace(/\D/g, "");

    if (phone.length < 11) {
        displayValidationSVG(validationDiv, false);
        phoneError.textContent = "Digite um número de telefone válido com DDD.";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    phoneError.textContent = "";
    return true;
}

/* Validação de Data de Nascimento */
function validateBirth(input) {
    const birthError = document.getElementById("birthError");
    const validationDiv = input.nextElementSibling;
    const birth = input.value;
    const birthRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!birthRegex.test(birth)) {
        displayValidationSVG(validationDiv, false);
        birthError.textContent = "Digite uma data de nascimento válida (DD/MM/AAAA).";
        return false;
    }

    const [day, month, year] = birth.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        displayValidationSVG(validationDiv, false);
        birthError.textContent = "Digite uma data de nascimento válida (DD/MM/AAAA).";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    birthError.textContent = "";
    return true;
}

/* Validação de Email */
function validateEmail(input) {
    const emailError = document.getElementById("emailError");
    const validationDiv = input.nextElementSibling;
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        displayValidationSVG(validationDiv, false);
        emailError.textContent = "Digite um email válido.";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    emailError.textContent = "";
    return true;
}

/* Validação do Formulário */
function validateForm() {
    const fullName = document.getElementById("fullName");
    const federalId = document.getElementById("federalId");
    const phone = document.getElementById("phone");
    const birth = document.getElementById("birth");
    const email = document.getElementById("email");

    const isFullNameValid = validateFullName(fullName);
    const isFederalIdValid = validateCPF(federalId);
    const isPhoneValid = validatePhone(phone);
    const isBirthValid = validateBirth(birth);
    const isEmailValid = validateEmail(email);

    if (isFullNameValid && isFederalIdValid && isPhoneValid && isBirthValid && isEmailValid) {
        //adicionar criar-contato
        showNextQuestion(1);
    } else {
        console.log("Formulário contém erros.");
    }
}

/* Mostrar próxima pergunta */
function showNextQuestion(step) {
    document.querySelector(".initial-form").style.display = "none";
    document.querySelector(".questions-form-1").style.display = "none";
    document.querySelector(".questions-form-2").style.display = "none";

    if (step === 1) {
        document.querySelector(".questions-form-1").style.display = "block";
    } else if (step === 2) {
        document.querySelector(".questions-form-2").style.display = "block";
    }
}

/* Mostrar pergunta anterior */
function showPreviousQuestion(step) {
    document.querySelector(".initial-form").style.display = "none";
    document.querySelector(".questions-form-1").style.display = "none";
    document.querySelector(".questions-form-2").style.display = "none";

    if (step === 1) {
        document.querySelector(".initial-form").style.display = "block";
    } else if (step === 2) {
        document.querySelector(".questions-form-1").style.display = "block";
    }
}

/* Selecionar opção e mostrar botão de submissão */
function selectOption(button) {
    document.querySelectorAll(".questions-form-2 .btn-questions").forEach(function (btn) {
        btn.classList.remove("selected");
    });
    button.classList.add("selected");
    document.querySelector(".questions-form-2 .button-submit").style.display = "block";
}

/* Redirecionar usuário após responder a segunda pergunta */
function redirectUser() {
    const journeyId = configureForm.journeyId;
    window.location.href = `https://www.parceiros.faz.vc/?id=${journeyId}`;
}

/* Configuração dinâmica do formulário */
function configureForm(apikey, colors, journeyId) {
    base_URL = "baseurl";
    configureForm.apikey = apikey;
    configureForm.journeyId = journeyId;

    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --button-bg: ${colors.buttonBg};
            --button-color: ${colors.buttonColor};
            --button-bg-brightness: ${colors.buttonBgBrightness};
        }
    `;
    document.head.appendChild(style);
}