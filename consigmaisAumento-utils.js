//API url
let API_URL = 'https://ms-crm-az.kemosoft.com.br/v1';
let step_URL = window.location.host;
let URL_redirect = "";
let origin = window.location.href;

//EXIBIR NO TOAST
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
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
function saveDataToLocalStorage({ name, phone, federalId, birth, enrollment, name_Representive, federalId_Representive, pipelineSlug }) {
    var dataQualification = {
        name,
        phone,
        federalId,
        birthDate: birth,
        enrollment,
        name_Representive,
        federalId_Representive,
        pipelineSlug,
    };

    var objDataQualification = JSON.stringify(dataQualification);

    localStorage.setItem('dataQualification', objDataQualification);
}


//CRIAR CONTATO INSS
async function criar_contato_inss(name, phone, federalId, birth, enrollment, name_Representive, federalId_Representive) {

    //CONFIG
    const nextStep = "qualification"
    const pipeline_slug = "inss"

    /* REPLACE */
    const federalId_replaced = federalId.replace(/[^\d]/g, "");
    const federalId_Representive_replaced = federalId_Representive.replace(/[^\d]/g, "");

    const button = document.querySelector('.btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';

   
    /*axios.post(API_URL + '/criar-contato', {*/
          axios.post('https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb', { 
        "name": name,
        "phone": phone,
        "federalId": federalId_replaced,
        "birthDate": birth,
        "enrollment": enrollment,
        "representativeName": name_Representive,
        "representativeFederalId": federalId_Representive_replaced,
        "pipelineSlug": pipeline_slug,
        "origin": origin,
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
                pipeline_slug,
            });
            window.location.href = nextStep + "?" + "pipeline_slug=" + pipeline_slug;
            console.log("Contato INSS criado")
        })
        .catch(function (error) {
            button.removeAttribute('disabled');
            spinner.classList.add('brz-invisible');
            span.textContent = 'Simular Agora!';
            showToast(error.response.data.message);
        });
}

//VALIDAR FORMULARIO
function validateForm() {

    const name = document.querySelector('[data-brz-label="Nome do Beneficiário"]').value;
    const phone = document.querySelector('[data-brz-label="WhatsApp"]').value;
    const federalId = document.querySelector('[data-brz-label="CPF do Beneficiário"]').value;
    const birth = document.querySelector('[data-brz-label="Data de Nascimento do Beneficiário"]').value;
    const enrollment = document.querySelector('[data-brz-label="Número do beneficio"]').value;
    const representativeSelect = document.querySelector('[data-brz-label="O Benefício possui representante legal ?"]').value;
    const name_Representive = document.querySelector('[data-brz-label="Nome do Representante"]').value;
    const federalId_Representive = document.querySelector('[data-brz-label="CPF do Representante"]').value;

    if (name == "" ||
        phone == "" ||
        federalId == "" ||
        birth == "" ||
        enrollment == "" ||
        representativeSelect == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }
    if (name.trim() === '' || !name.includes(' ') || !/[a-zA-ZÀ-ÿ]/.test(name.split(' ')[1])) {
        showToast("Por favor, digite seu nome completo");
        return false;
    }
    if (representativeSelect == 'Possui Representante' && name_Representive == "") {
        showToast("Por favor, preencha o Nome do Representante.");
        return false;
    }
    if (representativeSelect == 'Possui Representante' && federalId_Representive == "") {
        showToast("Por favor, preencha o CPF do Representante.");
        return false;
    }
    if (federalId == federalId_Representive) {
        showToast("Os CPFs do beneficiário e do representante devem ser diferentes!");
        return false;
    }
    if (!validateCPF(federalId)) {
        showToast("O CPF do Beneficiário não é válido!");
        return false;
    }

    if (representativeSelect == 'Possui Representante' && !validateCPF(federalId_Representive)) {
        showToast("O CPF do Representante não é válido!");
        return false;
    }

    if (enrollment.length > 10) {
        showToast("O número do benefício não pode ter mais de 10 caracteres."
        );
        return false;
    }
    if (!validarNumeroBeneficio(enrollment)) {
        showToast("O número do benefício informado é inválido!"
        );
        return false;
    }
    if (!isDateValid(birth)) {
        showToast("A data de nascimento informada não é válida!"
        );
        return false;
    }
    if (!isBirthValid(birth)) {
        showToast("Ops! Você deve ter no máximo 76 anos para prosseguir com a simulação."
        );
        return false;
    }
    if (!validatePhone(phone)) {
        showToast("O número do Whatsapp informado não é válido!"
        );
        return false;
    }

    criar_contato_inss(name, phone, federalId, birth, enrollment, name_Representive, federalId_Representive);
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

    /*     axios.post('https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb', { */
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

    /* CONSOLE */
    console.log("Informações de qualificação");
    console.log(pipelineSlug);
    console.log(federalId);



    axios
        .get(`${API_URL}/${pipelineSlug}/proxima-etapa/${federalId}`, {})
        .then((response) => {
            var protocol = response.data.qualificationId;
            var qualificationMessage = response.data.qualificationMessage;
            var qualificationStatus = response.data.qualificationStatus;

            console.log("=========")
            console.log(protocol)
            console.log(qualificationMessage)
            console.log(qualificationStatus)

            /* switch (qualificationStatus) {
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
            } */

        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
        });
};



