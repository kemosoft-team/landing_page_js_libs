//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let origin = window.location.href;
let referrer = document.referrer;

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

/* VARIAVEIS DE CONTROLE */
let controlNoOpportunity = false;

/* VARIAVEIS DE TENTATIVA */
var attemptBenefit = 0;
console.log(attemptBenefit)




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

//VALIDAR ENROLLMENT
function validateMod11Digit(code, numDig, limMult, x10) {
    if (!numDig) numDig = 1;

    let dado = code.substring(0, code.length - numDig);

    let mult, soma, i, n, dig;

    if (!x10) x10 = 1; // Correção aqui
    for (n = 1; n <= numDig; n++) {
        soma = 0;
        mult = 2;
        for (i = dado.length - 1; i >= 0; i--) {
            soma += (mult * parseInt(dado.charAt(i)));
            if (++mult > limMult) mult = 2;
        }
        if (x10) {
            dig = ((soma * 10) % 11) % 10;
        } else {
            dig = soma % 11;
            if (dig == 10) dig = "X";
        }
        dado += (dig);
    }

    return (dado === code);
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

    var representativeFalseButton = document.getElementById(
        "representative_false"
    );

    if (maxBirthYear - yearInt < 18) {
        representativeFalseButton.style.display = "none";
    } else {
        representativeFalseButton.style.display = "block";
    }

    return true;
}

// ENVIAR DADOS PARA O LOCALSTORAGE
function saveDataToLocalStorage({
    name,
    phone,
    federalId,
    birth,
    name_Representive,
    federalId_Representive,
    enrollment,
    retiredOrPensioner,
    hasTakenLoan,
    benefitAmountRange,
    pipeline_slug,
    origin,
    referrer,
}) {
    var dataQualification = {
        name,
        phone,
        federalId,
        birthDate: birth,
        name_Representive,
        federalId_Representive,
        enrollment,
        retiredOrPensioner,
        hasTakenLoan,
        benefitAmountRange,
        pipeline_slug,
        origin,
        referrer,
    };

    var objDataQualification = JSON.stringify(dataQualification);

    localStorage.setItem("dataQualification", objDataQualification);
}

//VALIDAR NÚMERO DO BENEFÍCIO
function validatorStepBenefit() {
    const benefit = document.querySelector(
        '[data-brz-label="Número do Benefício/Matrícula"]'
    ).value;
    if (benefit == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    } else if (benefit.length != 10) {
        showToast("O número do benefício deve conter 10 caracteres.");
        return false;
    } else if (!validarNumeroBeneficio(benefit)) {
        showToast("O número do benefício informado é inválido! Revise a informação!");
        return false;
    } else if (!validateMod11Digit(benefit, 1, 9, true)) {
        showToast("O número do benefício informado é inválido!! Revise a informação!");
        return false;
    }

    //SALVAR NAS VARIAVEIS GLOBAIS
    enrollment = benefit;

    updateBenefit();
}

//VALIDAR NÚMERO DO BENEFÍCIO
function validatorPopUpBenefit() {
    const benefit = document.querySelector('[data-brz-label="Número do Benefício/Matrícula (Opcional)"]').value;

    if (benefit != "" && benefit.length != 10) {
        showToast("O número do benefício deve conter 10 caracteres.");
        return false;
    } else if (benefit != "" && !validarNumeroBeneficio(benefit)) {
        showToast("O número do benefício informado é inválido! Revise a informação!");
        return false;
    } else if (benefit != "" && !validateMod11Digit(benefit, 1, 9, true)) {
        showToast("O número do benefício informado é inválido!! Revise a informação!");
        return false;
    }

    //SALVAR NAS VARIAVEIS GLOBAIS
    enrollment = benefit;

    //ABRI POP UP QUESTIONARIOS
    const close_benefit = document.getElementById("close_benefit");
    const representativeQuestions = document.getElementById("question_representative");
    close_benefit.click();
    representativeQuestions.click();
}

// VALIDAR PERGUNTAS INICIAIS
/* function validatorQuestions() {
    const firstChoice = document
        .querySelector('[data-brz-label="É aposentado ou pensionista do INSS?"]')
        .value.toLowerCase();
    const secondChoice = document
        .querySelector('[data-brz-label="Já contratou empréstimo consignado?"]')
        .value.toLowerCase();
    const thirdChoice = document.querySelector(
        '[data-brz-label="Em qual dos valores se enquadra o seu benefício?"]'
    ).value;

    if (firstChoice === "" || secondChoice === "" || thirdChoice === "") {
        showToast("Por favor, responda todas as perguntas.");
        return false;
    }

    retiredOrPensioner = firstChoice === "sim"; // boolean
    hasTakenLoan = secondChoice === "sim"; // boolean
    benefitAmountRange = thirdChoice; // string

    // ABRA O POP-UP DE QUESTIONÁRIO REPRESENTANTE
    const representativeQuestions = document.getElementById(
        "question_representative"
    );
    const closeQuestions = document.getElementById("close_questions");
    closeQuestions.click();
    representativeQuestions.click();
} */

//VALIDAR FORMULARIO BENEFICIARIO
function validateFormBenefit() {
    const nameElement = document.querySelector(
        '[data-brz-label="Nome do Beneficiário"]'
    ).value;
    const phoneElement = document.querySelector(
        '[data-brz-label="WhatsApp"]'
    ).value;
    const federalIdElement = document.querySelector(
        '[data-brz-label="CPF do Beneficiário"]'
    ).value;
    const birthElement = document.querySelector(
        '[data-brz-label="Data de Nascimento do Beneficiário"]'
    ).value;
    const firstChoice = document
        .querySelector('[data-brz-label="É aposentado ou pensionista do INSS?"]')
        .value.toLowerCase();
    const secondChoice = document
        .querySelector('[data-brz-label="Já contratou empréstimo consignado?"]')
        .value.toLowerCase();

    if (
        nameElement == "" ||
        phoneElement == "" ||
        federalIdElement == "" ||
        birthElement == "" ||
        firstChoice == "" ||
        secondChoice == ""
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
    retiredOrPensioner = firstChoice === "sim"; // boolean
    hasTakenLoan = secondChoice === "sim"; // boolean

    //ABRA O POP UP DE INFO BENEFIT
    const benefit = document.getElementById("benefit");
    benefit.click();
}

//VALIDAR FORMULARIO REPRESENTANTE
function validateFormRepresentative() {
    const name_RepresentiveElement = document.querySelector(
        '[data-brz-label="Nome do Representante"]'
    ).value;
    const federalId_RepresentiveElement = document.querySelector(
        '[data-brz-label="CPF do Representante"]'
    ).value;

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
    axios
        .post(API_URL + "/criar-contato", {
            name: name,
            phone: phone,
            federalId: federalId_replaced,
            birthDate: birth,
            representativeName: name_Representive,
            representativeFederalId: federalId_Representive_replaced,
            enrollment: enrollment,
            //questionario:
            retiredOrPensioner: retiredOrPensioner,
            hasTakenLoan: hasTakenLoan,
            benefitAmountRange: benefitAmountRange,
            pipelineSlug: pipeline_slug,
            origin: origin,
            referrer: referrer,
        })
        .then((response) => {
            saveDataToLocalStorage({
                name,
                phone,
                federalId: federalId_replaced,
                birth,
                name_Representive,
                federalId_Representive: federalId_Representive_replaced,
                enrollment,
                retiredOrPensioner: retiredOrPensioner,
                hasTakenLoan: hasTakenLoan,
                benefitAmountRange: benefitAmountRange,
                pipeline_slug,
                origin,
                referrer,
            });

            window.location.href = nextStep + "?" + "pipeline_slug=" + pipeline_slug;
        })
        .catch(function (error) {
            showToast(error.response.data.message);
            return false;
        });
}

// UPDATE BENEFIT
async function updateBenefit() {
    //OBTER INFORMAÇÕES DO LOCALSTORAGE
    var dataQualification = localStorage.getItem("dataQualification");
    var dataFromInss = JSON.parse(dataQualification);

    if (dataFromInss) {
        name = dataFromInss.name;
        phone = dataFromInss.phone;
        federalId = dataFromInss.federalId;
        birth = dataFromInss.birthDate;
    }

    // CONFIG
    const nextStep = "qualification";
    const pipeline_slug = "inss";

    /* axios.post("https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb", { */
    axios
        .post(API_URL + "/criar-contato", {
            name: name,
            phone: phone,
            federalId: federalId,
            birthDate: birth,
            enrollment: enrollment,
            pipelineSlug: pipeline_slug,
        })
        .then((response) => {
            saveDataToLocalStorage({
                name,
                phone,
                federalId,
                birth,
                enrollment,
            });

            window.location.href = nextStep + "?" + "pipeline_slug=" + pipeline_slug;
        })
        .catch(function (error) {
            showToast(error.response.data.message);
        });
}

//CRIAR CONTATO FGTS
async function criar_contato_fgts() {
    //OBTER INFORMAÇÕES DO LOCALSTORAGE
    var dataQualification = localStorage.getItem("dataQualification");
    var dataFromInss = JSON.parse(dataQualification);

    if (dataFromInss) {
        name = dataFromInss.name;
        phone = dataFromInss.phone;
        federalId = dataFromInss.federalId;
        birth = dataFromInss.birthDate;
        origin = dataFromInss.origin;
    }

    //CONFIG
    const nextStep = "qualification";
    const pipeline_slug = "fgts";

    /* axios.post('https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb', { */
    axios
        .post(API_URL + "/criar-contato", {
            name: name,
            phone: phone,
            federalId: federalId,
            birthDate: birth,
            pipelineSlug: pipeline_slug,
            origin: origin,
        })
        .then((response) => {
            saveDataToLocalStorage({
                name,
                phone,
                federalId: federalId,
                birth,
                pipeline_slug,
                origin,
            });
            window.location.href = nextStep + "?" + "pipeline_slug=" + pipeline_slug;
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
    var attempt = 0;

    const sendRequest = () => {
        axios
            .get(`${API_URL}/${pipelineSlug}/proxima-etapa/${federalId}`, {})
            .then((response) => {
                let URL_redirect;
                var protocolo = response.data.protocolo;
                var mensagem = response.data.mensagem;
                var situacao = response.data.situacao;

                switch (situacao) {
                    //OPPORTUNITY
                    case "exibir-oportunidade":
                        URL_redirect = `/opportunity?message=${mensagem}&protocolo=${protocolo}`;
                        window.location.href = URL_redirect;
                        break;

                    //NOOPPORTUNITY
                    case "sem-oportunidade":
                        if (!controlNoOpportunity) {
                            controlNoOpportunity = true;
                            setTimeout(function () {
                                sendRequest();
                            }, 3000);
                        } else {
                            URL_redirect = `/noopportunity?message=${mensagem}&protocolo=${protocolo}`;
                            window.location.href = URL_redirect;
                        }
                        break;

                    //NOQUALIFIED
                    case "nao-qualificado":
                        URL_redirect = `/noqualified?message=${mensagem}&protocolo=${protocolo}`;
                        window.location.href = URL_redirect;
                        break;

                    //REQUIRESTREATMENT
                    case "requer-tratamento":
                        URL_redirect = `/requirestreatment?message=${mensagem}&protocolo=${protocolo}`;
                        window.location.href = URL_redirect;
                        break;

                    //ENROLLMENT INSS
                    case "acao-adicional":
                        attemptBenefit++;
                        console.log(attemptBenefit)
                        if (attemptBenefit > 2) {
                            URL_redirect = `/qualifywhatsapp`;
                            window.location.href = URL_redirect;
                        } else {
                            URL_redirect = `/benefit`;
                            window.location.href = URL_redirect;
                        }
                        break;

                    //INDISPONIVEL OU QUALQUER OUTRO STATUS NÃO LISTADO
                    default:
                        console.log("indisponivel ou não listado");
                        attempt++;
                        if (attempt < 3) {
                            sendRequest();
                        } else {
                            URL_redirect = `/offline`;
                            window.location.href = URL_redirect;
                        }
                        break;
                }
            })
            .catch(function (error) {
                console.log(error, "Não foi possível obter a qualificação");
                attempt++;
                if (attempt < 3) {
                    sendRequest();
                } else {
                    URL_redirect = `/offline`;
                    window.location.href = URL_redirect;
                }
            });
    };
    sendRequest();
}
