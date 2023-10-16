/* SHOWTOAST */
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () {
        x.className = x.className.replace("show", `${text}`);
    }, 3000);
}

/* Remove texto label option-radio */
var optionRadio = document.querySelector('.option-radio');
var labelElement = optionRadio.querySelector('label');
// Remova o texto do elemento <label>
labelElement.textContent = '';

/* VALIDAÇÕES */

/* VALIDA TELEFONE */
function validatePhoneNumber(phoneNumber) {
    // Remove todos os caracteres não numéricos
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Verifica se o número tem pelo menos 11 dígitos
    if (numericPhoneNumber.length !== 11) {
        return false; // O número não é válido (não possui 11 dígitos)
    }

    // Verifica se os dois primeiros dígitos correspondem a um DDD válido no Brasil
    const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];

    const firstTwoDigits = numericPhoneNumber.substring(0, 2);
    if (!validDDDs.includes(firstTwoDigits)) {
        return false; // Os dois primeiros dígitos não correspondem a um DDD válido
    }

    // Verifica se o terceiro caractere é "9"
    if (numericPhoneNumber[2] !== '9') {
        return false; // O terceiro caractere não é "9"
    }

    // Verifica se o número não é uma sequência de números iguais
    const firstDigit = numericPhoneNumber[0];
    if (numericPhoneNumber.split('').every(digit => digit === firstDigit)) {
        return false; // O número é uma sequência de números iguais (ex: 99999999999)
    }

    return true; // O número é válido
}

/* VALIDA CPF */
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    let sum = 0, remainder;

    for (let i = 0; i < 9; i++)
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++)
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
}

/* VALIDA DATA DE NASCIMENTO MAX */
function isBirthValid(dateString) {
    // Verifica se a data está no formato "DD/MM/AAAA"
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!datePattern.test(dateString)) {
        return false;
    }

    // Divide a data em dia, mês e ano
    const [, , , year] = dateString.match(datePattern);

    // Converte o ano para um número inteiro
    const yearInt = parseInt(year, 10);

    // Verifica se a pessoa tem menos than 77 anos
    const currentDate = new Date();
    const maxBirthYear = currentDate.getFullYear();

    if ((maxBirthYear - yearInt) > 76) {
        return false; // A pessoa tem more than 76 anos
    }

    return true;
}

/* VALIDA DATA */
function isDateValid(dateString) {
    // Verifica se a data está no formato "DD/MM/AAAA"
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!datePattern.test(dateString)) {
        return false;
    }

    // Divide a data em dia, mês e ano
    const [, day, month, year] = dateString.match(datePattern);

    // Converte para números inteiros
    const dayInt = parseInt(day, 10);
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    // Verifica se o ano está no intervalo razoável (por exemplo, entre 1900 e 2099)
    if (yearInt < 1900 || yearInt > 2099) {
        return false;
    }

    // Usa o construtor de Data para verificar a validade da data
    const date = new Date(yearInt, monthInt - 1, dayInt); // O mês é base 0 (janeiro é 0)
    if (
        date.getDate() === dayInt &&
        date.getMonth() === monthInt - 1 &&
        date.getFullYear() === yearInt
    ) {
        return true;
    }

    return false;
}

/* MÁSCARAS */

/* CPF */
function maskFederalId(input, e) {
    let cpf = input.value.replace(/\D/g, '');
    if (e.keyCode === 8 || e.keyCode === 46) return;
    if (cpf.length > 11) cpf = cpf.slice(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = cpf;
}

/* WHATSAPP */
function maskPhone(input) {
    let telefone = input.value.replace(/\D/g, '');

    if (telefone.length > 11) telefone = telefone.slice(0, 11);

    if (telefone.length > 2) {
        telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    }
    if (telefone.length > 8) {
        telefone = `${telefone.slice(0, 9)}-${telefone.slice(9)}`;
    }

    input.value = telefone;
}

/* DATA DE NASCIMENTO */
function maskBirth(input) {
    let dataNascimento = input.value.replace(/\D/g, '');
    if (dataNascimento.length > 8) dataNascimento = dataNascimento.slice(0, 8);
    dataNascimento = dataNascimento.replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
    input.value = dataNascimento;
}

/* VARIÁVEIS */
var federalId = document.querySelector('[data-q="federal_id"]');
var phone = document.querySelector('[data-q="phone"]');
var birth = document.querySelector('[data-q="birth"]');
var emailFederalId = document.querySelector('[data-q="email_federalId"]');

/* AÇÕES */
birth.addEventListener('input', function () {
    maskBirth(birth);
});

federalId.addEventListener('input', function (e) {
    maskFederalId(federalId, e);
});

federalId.addEventListener('keydown', function (event) {
    if (!(event.key.match(/[0-9]/) || event.key === "Backspace" || event.key === "Delete" || event.key === "Tab")) {
        event.preventDefault();
    }
});

phone.addEventListener('input', function () {
    maskPhone(phone);
});

/* ATRIBUIR CPF AO EMAIL */
federalId.addEventListener('input', function () {
    var inputFederalId = federalId.value;
    emailFederalId.dispatchEvent(new Event('input'));
    emailFederalId.value = inputFederalId + '@email.com';
    emailFederalId.dispatchEvent(new Event('input'));
});

/* VALIDAR FORMULÁRIO LP */
function validateForm() {
    const federalId = document.querySelector('[data-q="federal_id"]').value;
    const phone = document.querySelector('[data-q="phone"]').value;
    const birth = document.querySelector('[data-q="birth"]').value;
    const emailFederalId = document.querySelector('[data-q="email_federalId"]').value;

    // Valida campos vazios
    if (federalId === "" || phone === "" || birth === "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    } else if (!isDateValid(birth)) {
        showToast("A data de nascimento informada não é válida!");
        return false;
    } else if (!validateCPF(federalId)) {
        showToast("O CPF informado não é válido!");
        return false;
    } else if (!isBirthValid(birth)) {
        showToast("Ops! Você deve ter no máximo 76 anos para prosseguir com a simulação.");
        return false;
    } else if (!validatePhoneNumber(phone)) {
        showToast("O número do Whatsapp informado não é válido!");
        return false;
    } else {
        // Salva federalId
        localStorage.setItem('beneficiaryFederalId', federalId);

        // Marca o radio oculto e aciona o botão de submissão
        // const checkbox = document.querySelector('input[data-q="checked"]');
        // if (checkbox) {
        //     checkbox.click();
        // }

        return true;
    }
}

var buttonElement = document.querySelector('.button-element')

buttonElement.addEventListener('click', function clickHandler(event) {
    // Realize a validação
    console.log('teste');
    var isValid = validateForm();
    if (!isValid) {
        event.preventDefault(); // Impede o envio do formulário se a validação falhar
    }
});
