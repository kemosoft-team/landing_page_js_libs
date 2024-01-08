//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let step_URL = window.location.host;
let URL_redirect = "";
let origin = window.location.href;
let name;
let phone;
let federalId;
let birth;
let workWithSignedWorkCard;
let withdrawalEnabled;

//EXIBIR NO TOAST
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () {
        x.className = x.className.replace("show", `${text}`);
    }, 3000);
}

/* VALIDAR WHATSAPP */
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

/* VALIDAR CPF */
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11) return false;
    let sum = 0,
        remainder;

    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
}

//VALIDAR DATA
function isDateValid(dateString) {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!datePattern.test(dateString)) {
        return false;
    }

    const [, day, month, year] = dateString.match(datePattern);

    const dayInt = parseInt(day, 10);
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    if (yearInt < 1900 || yearInt > 2099) {
        return false;
    }

    const date = new Date(yearInt, monthInt - 1, dayInt);
    if (
        date.getDate() === dayInt &&
        date.getMonth() === monthInt - 1 &&
        date.getFullYear() === yearInt
    ) {
        return true;
    }

    return false;
}

// ENVIAR DADOS PARA O LOCALSTORAGE
function saveDataToLocalStorage(
    name,
    phone,
    federalId,
    birthDate,
    pipelineSlug,
    workWithSignedWorkCard,
    withdrawalEnabled,
    origin
) {
    var dataQualification = {
        name,
        phone,
        federalId,
        birthDate,
        pipelineSlug,
        workWithSignedWorkCard,
        withdrawalEnabled,
        origin
    };

    var objDataQualification = JSON.stringify(dataQualification);

    localStorage.setItem("dataQualification", objDataQualification);
}

// VALIDAR PERGUNTAS INICIAIS
function validatorQuestions() {
    const firstChoice = document
        .querySelector('[data-brz-label="Já Trabalhou de Carteira Assinada?"]')
        .value.toLowerCase();
    const secondChoice = document
        .querySelector('[data-brz-label="Tem o Saque Habilitado?"]')
        .value.toLowerCase();

    if (firstChoice === "" || secondChoice === "") {
        showToast("Por favor, responda todas as perguntas.");
        return false;
    }

    workWithSignedWorkCard = firstChoice;
    withdrawalEnabled = secondChoice;

    criar_contato_fgts();
}

//VALIDAR FORMULARIO BENEFICIARIO
function validateFormBenefit() {
    const nameElement = document.querySelector(
        '[data-brz-label="Nome Completo"]'
    ).value;
    const phoneElement = document.querySelector(
        '[data-brz-label="WhatsApp"]'
    ).value;
    const federalIdElement = document.querySelector(
        '[data-brz-label="CPF"]'
    ).value;
    const birthElement = document.querySelector(
        '[data-brz-label="Data de Nascimento"]'
    ).value;

    if (
        nameElement == "" ||
        phoneElement == "" ||
        federalIdElement == "" ||
        birthElement == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }
    if (
        nameElement.trim() === "" ||
        !nameElement.includes(" ") ||
        !/[a-zA-ZÀ-ÿ]/.test(nameElement.split(" ")[1])
    ) {
        showToast("Por favor, digite seu nome completo");
        return false;
    }
    if (!validateCPF(federalIdElement)) {
        showToast("O CPF do Beneficiário não é válido!");
        return false;
    }
    if (!isDateValid(birthElement)) {
        showToast("A data de nascimento informada não é válida!");
        return false;
    }
    if (!validatePhone(phoneElement)) {
        showToast("O número do Whatsapp informado não é válido!");
        return false;
    }

    //SALVAR NAS VARIAVEIS GLOBAIS
    name = nameElement;
    phone = phoneElement;
    federalId = federalIdElement;
    birth = birthElement;

    //ABRA O POP UP DE QUESTIONARIO
    const questions = document.getElementById("questions");
    questions.click();
}

//CRIAR CONTATO FGTS
async function criar_contato_fgts() {

    //CONFIG
    const nextStep = "qualification"
    const pipeline_slug = "fgts"

    /* axios.post(API_URL + '/criar-contato', { */
    axios.post('https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb', {
        "name": name,
        "phone": phone,
        "federalId": federalId,
        "birthDate": birth,
        "pipelineSlug": pipeline_slug,
        "workWithSignedWorkCard": workWithSignedWorkCard,
        "withdrawalEnabled": withdrawalEnabled,
        "origin": origin,
    })
        .then((response) => {
            saveDataToLocalStorage(
                name,
                phone,
                federalId,
                birth,
                pipeline_slug,
                workWithSignedWorkCard,
                withdrawalEnabled,
                origin
            );
            window.location.href = nextStep + "?" + "pipeline_slug=" + pipeline_slug;
            console.log("Contato FGTS criado")
        })
        .catch(function (error) {
            showToast(error.response.data.message);
        });
}

//QUALIFICAÇÃO
function qualification() {
    //OBTER INFO DO LOCALSTORAGE
    var DataInfoQualification = localStorage.getItem("dataQualification");
    var infoQualification = JSON.parse(DataInfoQualification);

    let federalId = infoQualification.federalId;

    axios
        .get(`${API_URL}/fgts/proxima-etapa/${federalId}`, {})
        .then((response) => {
            var protocol = response.data.qualificationId;
            var qualificationMessage = response.data.qualificationMessage;
            var qualificationStatus = response.data.qualificationStatus;

            switch (qualificationStatus) {
                //SUCCESS
                case "qualificado":
                    URL_redirect = `${step_URL}/success?message=${qualificationMessage}&protocolo=${protocol}`;
                    window.location.href = URL_redirect;
                    break;

                //SUCCESS
                case "nao-identificado":
                    URL_redirect = `${step_URL}/success?message=${qualificationMessage}&protocolo=${protocol}`;
                    window.location.href = URL_redirect;
                    break;

                //NOQUALIFIED
                case "nao-qualificado":
                    URL_redirect = `${step_URL}/noqualified?message=${qualificationMessage}&protocolo=${protocol}`;
                    window.location.href = URL_redirect;
                    break;

                default:
                    URL_redirect = `${step_URL}/offline?message=${qualificationMessage}&protocolo=${protocol}`;
                    window.location.href = URL_redirect;

                    break;
            }
        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
        });
}
