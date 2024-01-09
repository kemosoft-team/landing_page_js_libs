
//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let origin = window.location.href;

let name;
let phone;
let federalId;
let birth;
let enrollment;

let name_Representive;
let federalId_Representive;
let federalId_Representive_replaced;

let retiredOrPensioner;
let hasTakenLoan;
let benefitAmountRange;

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

//VALIDAR ENROLLMENT
function validarNumeroBeneficio(numeroBeneficio) {
    var regexBeneficio = /^[0-9]{10}$/;

    if (regexBeneficio.test(numeroBeneficio)) {
        var sequenciaRepetida = /(\d)\1{9}/;

        if (sequenciaRepetida.test(numeroBeneficio)) {
            return false;
        }

        return true;
    }

    return false;
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

//VALIDA DATA DE NASCIMENTO MAX
function isBirthValid(dateString) {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!datePattern.test(dateString)) {
        return false;
    }

    const [, , , year] = dateString.match(datePattern);

    const yearInt = parseInt(year, 10);

    const currentDate = new Date();
    const maxBirthYear = currentDate.getFullYear();

    if (maxBirthYear - yearInt > 76) {
        return false;
    }

    return true;
}

// ENVIAR DADOS PARA O LOCALSTORAGE
function saveDataToLocalStorage({
    name,
    phone,
    federalId,
    birth,
    enrollment,
    name_Representive,
    federalId_Representive,
    retiredOrPensioner,
    hasTakenLoan,
    benefitAmountRange,
    pipeline_slug,
}) {
    var dataQualification = {
        name,
        phone,
        federalId,
        birthDate: birth,
        enrollment,
        name_Representive,
        federalId_Representive,
        retiredOrPensioner,
        hasTakenLoan,
        benefitAmountRange,
        pipeline_slug,
    };

    var objDataQualification = JSON.stringify(dataQualification);

    localStorage.setItem("dataQualification", objDataQualification);
}

// VALIDAR PERGUNTAS INICIAIS
function validatorQuestions() {

    const firstChoice = document.querySelector('[data-brz-label="É aposentado ou pensionista do INSS?"]').value.toLowerCase();
    const secondChoice = document.querySelector('[data-brz-label="Já contratou empréstimo consignado?"]').value.toLowerCase();
    const thirdChoice = document.querySelector('[data-brz-label="Em qual dos valores se enquadra o seu benefício?"]').value;

    if (firstChoice === "" || secondChoice === "" || thirdChoice === "") {
        showToast("Por favor, responda todas as perguntas.");
        return false;
    }

    retiredOrPensioner = firstChoice === "sim"; // boolean
    hasTakenLoan = secondChoice === "sim"; // boolean
    benefitAmountRange = thirdChoice; // string

    // Adicione console.log para verificar os valores
    console.log("retiredOrPensioner:", retiredOrPensioner);
    console.log("hasTakenLoan:", hasTakenLoan);
    console.log("benefitAmountRange:", benefitAmountRange);

    // ABRA O POP-UP DE QUESTIONÁRIO REPRESENTANTE
    const representativeQuestions = document.getElementById("question_representative");
    const closeQuestions = document.getElementById("close_questions");
    closeQuestions.click();
    representativeQuestions.click();
}

//VALIDAR FORMULARIO BENEFICIARIO
function validateFormBenefit() {
    const nameElement = document.querySelector('[data-brz-label="Nome do Beneficiário"]').value;
    const phoneElement = document.querySelector('[data-brz-label="WhatsApp"]').value;
    const federalIdElement = document.querySelector('[data-brz-label="CPF do Beneficiário"]').value;
    const birthElement = document.querySelector('[data-brz-label="Data de Nascimento do Beneficiário"]').value;
    const enrollmentElement = document.querySelector('[data-brz-label="Número do Benefício/Matrícula (Opcional)"]').value;

    if (nameElement == "" || phoneElement == "" || federalIdElement == "" || birthElement == "") {
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
    if (enrollmentElement !== "" && enrollmentElement.length > 10) {
        showToast("O número do benefício não pode ter mais de 10 caracteres.");
        return false;
    }

    if (enrollmentElement !== "" && !validarNumeroBeneficio(enrollmentElement)) {
        showToast("O número do benefício informado é inválido!");
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
    if (!isBirthValid(birthElement)) {
        showToast(
            "Ops! Você deve ter no máximo 76 anos para prosseguir com a simulação."
        );
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
    enrollment = enrollmentElement;

    //ABRA O POP UP DE QUESTIONARIO
    const questions = document.getElementById("questions");
    questions.click();
}

//VALIDAR FORMULARIO REPRESENTANTE
function validateFormRepresentative() {
    const name_RepresentiveElement = document.querySelector('[data-brz-label="Nome do Representante"]').value;
    const federalId_RepresentiveElement = document.querySelector('[data-brz-label="CPF do Representante"]').value;

    if (name_RepresentiveElement == "" || federalId_RepresentiveElement == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }
    if (!validateCPF(federalId_RepresentiveElement)) {
        showToast("O CPF do Representante não é válido!");
        return false;
    }
    if (federalId == federalId_RepresentiveElement) {
        showToast(
            "Os CPFs do beneficiário e do representante devem ser diferentes!"
        );
        return false;
    }

    //SALVAR NAS VARIAVEIS GLOBAIS
    name_Representive = name_RepresentiveElement;
    federalId_Representive = federalId_RepresentiveElement;

    //MUDE O TEXTO
    submitRepresentative.innerHTML = "Carregando... Aguarde!";
    //EXECUTAR A CRIAÇÃO DE CONTATO
    criar_contato_inss();
}

// CRIAR CONTATO INSS
async function criar_contato_inss() {
    console.log("Função criar contato iniciada")

    // CONFIG
    const nextStep = "qualification";
    const pipeline_slug = "inss";

    /* REPLACE */
    const federalId_replaced = federalId.replace(/[^\d]/g, "");

    if (federalId_Representive) {
        federalId_Representive_replaced = federalId_Representive.replace(
            /[^\d]/g,
            ""
        );
    }
    /* axios.post("https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb", { */
    axios.post(API_URL + "/criar-contato", {
        name: name,
        phone: phone,
        federalId: federalId_replaced,
        birthDate: birth,
        enrollment: enrollment,
        representativeName: name_Representive,
        representativeFederalId: federalId_Representive_replaced,
        //questionario:
        retiredOrPensioner: retiredOrPensioner,
        hasTakenLoan: hasTakenLoan,
        benefitAmountRange: benefitAmountRange,
        pipelineSlug: pipeline_slug,
        origin: origin,
    })
        .then((response) => {
            saveDataToLocalStorage({
                name,
                phone,
                federalId: federalId_replaced,
                birth,
                enrollment,
                name_Representive,
                federalId_Representive: federalId_Representive_replaced,
                retiredOrPensioner: retiredOrPensioner,
                hasTakenLoan: hasTakenLoan,
                benefitAmountRange: benefitAmountRange,
                pipeline_slug,
            });

            window.location.href =
                nextStep + "?" + "pipeline_slug=" + pipeline_slug;
            console.log("Contato INSS criado");
        })
        .catch(function (error) {
            showToast(error.response.data.message);
            return false;
        });
}

//CRIAR CONTATO FGTS
async function criar_contato_fgts() {

    //OBTER INFORMAÇÕES DO LOCALSTORAGE
    var dataQualification = localStorage.getItem("dataQualification");
    var dataFromInss = JSON.parse(dataQualification);

    if (dataFromInss) {
        var name = dataFromInss.name;
        var phone = dataFromInss.phone;
        var federalId = dataFromInss.federalId;
        var birth = dataFromInss.birthDate;
    }

    //CONFIG
    const nextStep = "qualification"
    const pipeline_slug = "fgts"

    /* axios.post('https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb', { */
    axios.post(API_URL + '/criar-contato', {
        "name": name,
        "phone": phone,
        "federalId": federalId,
        "birthDate": birth,
        "pipelineSlug": pipeline_slug,
        "origin": origin,
    })
        .then((response) => {
            saveDataToLocalStorage({
                name,
                phone,
                federalId: federalId,
                birth,
                pipeline_slug,
            });
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

    //OBTER INFO DA URL
    var url = new URL(window.location.href);
    var pipelineSlug = url.searchParams.get("pipeline_slug");

    axios
        .get(`${API_URL}/${pipelineSlug}/proxima-etapa/${federalId}`, {})
        .then((response) => {
            let URL_redirect;
            var protocol = response.data.protocol;
            var qualificationMessage = response.data.qualificationMessage;
            var qualificationStatus = response.data.qualificationStatus;

            switch (qualificationStatus) {
                //SUCCESS
                case "exibir-oportunidade":
                    URL_redirect = `/success?message=${qualificationMessage}&protocolo=${protocol}`;
                    window.location.href = URL_redirect;
                    break;

                //NOQUALIFIED
                case "nao-qualificado":
                    URL_redirect = `/noqualified?message=${qualificationMessage}&protocolo=${protocol}`;
                    window.location.href = URL_redirect;
                    break;

                //NOOPPORTUNITY
                case "sem-oportunidade":
                    URL_redirect = `/nooppotunity?message=${qualificationMessage}&protocolo=${protocol}`;
                    window.location.href = URL_redirect;
                    break;

                //REQUIRESTREATMENT
                case "requer-tratamento":
                    URL_redirect = `/nooppotunity?message=${qualificationMessage}&protocolo=${protocol}`;
                    window.location.href = URL_redirect;
                    break;

                //ENROLLMENT
                case "acao-adicional":
                    URL_redirect = `/enrollment?message=${qualificationMessage}&protocolo=${protocol}`;
                    window.location.href = URL_redirect;
                    break;

                //INDISPONIVEL OU QUALQUER OUTRO STATUS NÃO LISTADO
                default:
                    URL_redirect = `/offline`;
                    window.location.href = URL_redirect;
                    break;
            }
        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
        });
}
