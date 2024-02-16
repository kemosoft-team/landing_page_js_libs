/* FUNÇÕES DE VALIDAÇÃO */

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

function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
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

const ufSiglas = [
    "AC", "AL", "AP", "AM", "BA",
    "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB",
    "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP",
    "SE", "TO"
];

function validateUF(sigla) {
    if (ufSiglas.includes(sigla.toUpperCase())) {
        return true;
    } else {
        return false;
    }
}

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


/* FUNÇÕES DE EXIBIÇÃO */

function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () {
        x.className = x.className.replace("show", `${text}`);
    }, 3000);
}

function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

/* FUNÇÕES DE ARMAZENAMENTO LOCAL */
function setItemStorage({
    pipelineSlug,
    federalId,
    leadId,
    opportunity
}) {
    var dataQualification = {
        pipelineSlug,
        federalId,
        leadId,
        opportunity
    };
    var objDataQualification = JSON.stringify(dataQualification);
    localStorage.setItem("dataQualification", objDataQualification);
}

function getItemStorage() {
    const dataQualificationLocalStorage = localStorage.getItem('dataQualification');
    const storedDataQualification = JSON.parse(dataQualificationLocalStorage);

    return {
        pipelineSlug: storedDataQualification.pipelineSlug,
        federalId: storedDataQualification.federalId,
        leadId: storedDataQualification.leadId,
        opportunity: storedDataQualification.opportunity
    };
}

/* REDIRECIONAMENTO E INTEGRAÇÕES EXTERNAS */

function bankRedirect(banco) {
    switch (banco) {
        case "Eccor Open FGTS":
            URL_redirect = `/signature?tp=sms`;
            window.location.href = URL_redirect;
            break
        case "facta":
            URL_redirect = `/signature?tp=link`;
            window.location.href = URL_redirect;
            break
        case "Banco BMG S.A.":
            URL_redirect = `/signature?tp=sms`;
            window.location.href = URL_redirect;
            break
        default:
            console.log("Banco não reconhecido.");
    }
}

function getCEP(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            // Preenchendo os campos
            document.querySelector('[data-brz-label="Rua"]').value = data.logradouro || '';
            document.querySelector('[data-brz-label="Número"]').focus();
            document.querySelector('[data-brz-label="Bairro"]').value = data.bairro || '';
            document.querySelector('[data-brz-label="Cidade"]').value = data.localidade || '';
            document.querySelector('[data-brz-label="UF"]').value = data.uf || '';
        })
        .catch(error => console.error('Erro ao obter endereço:', error));
}

function redirectToSignature() {
    const { pipelineSlug, federalId, leadId, opportunity } = getItemStorage();

    const oportunidadeConfirmar = opportunity.find(function (oportunidade) {
        return oportunidade.acao === 'confirmar';
    });

    if (oportunidadeConfirmar) {
        const banco = oportunidadeConfirmar.banco;
        bankRedirect(banco);
    } else {
        console.log("Nenhuma oportunidade com ação 'confirmar' encontrada no localStorage.");
    }
}

function redirectLink() {
    const { pipelineSlug, federalId, leadId, opportunity } = getItemStorage();

    const oportunidadesConfirmar = opportunity.filter(function (oportunidade) {
        return oportunidade.acao === 'confirmar';
    });

    if (oportunidadesConfirmar.length > 0) {
        const oportunidadeMaiorValor = oportunidadesConfirmar.reduce(function (max, oportunidade) {
            return oportunidade.valor > max.valor ? oportunidade : max;
        }, oportunidadesConfirmar[0]);


        const linkAssinatura = oportunidadeMaiorValor.linkAssinatura;

        window.open(linkAssinatura, "_blank");
    } else {
        showToast("Nenhum link de assinatura encontrado para oportunidades com ação 'confirmar'.");
    }
}

/* DADOS BANCÁRIOS */
function setBanks(bankList) {
    const selects = document.querySelectorAll('[data-brz-label="Banco"]');

    selects.forEach(select => {
        select.innerHTML = "";

        bankList.forEach(bank => {
            const option = document.createElement('option');
            option.text = bank.name;
            option.value = bank.bank_no;
            select.add(option);
        });
    });
}

function getBanks() {
    const url = 'https://api.retool.com/v1/workflows/811018a0-7cba-4b6c-bfb0-b540dda2a054/startTrigger?workflowApiKey=retool_wk_73e053bdf16f4f86a7275ed00aa38bd8';

    axios.get(url)
        .then(response => {
            setBanks(response.data.banks);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

/* GESTÃO DE OPORTUNIDADES E QUALIFICAÇÃO */
function requalify() {

    const { pipelineSlug, federalId, leadId } = getItemStorage();

    axios
        .post(API_URL + `/card/${leadId}/requalify`, {}, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            let URL_redirect = `/qualification?pipeline_slug=${pipelineSlug}&federalId=${federalId}`
            window.location.href = URL_redirect;
        })
        .catch(function (error) {
            showToast(error.response.data.message);
        });
}

function requalifyEnrollment(enrollment) {

    const { pipelineSlug, federalId, leadId } = getItemStorage();

    axios
        .post(API_URL + `/card/${leadId}/requalify`, {
            enrollment: enrollment,
        }, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            let URL_redirect = `/qualification?pipeline_slug=${pipelineSlug}&federalId=${federalId}`
            window.location.href = URL_redirect;
        })
        .catch(function (error) {
            showToast(error.response.data.message);
        });
}

/* REGISTRO E MANIPULAÇÃO DE DADOS */

function registrarEndereco(zipcode, address, addressNumber, district, city, state) {

    function obterParametroDaURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
    const urlFederalId = obterParametroDaURL('federalId');

    let federal;

    if (urlFederalId) {
        federal = urlFederalId;
    } else {
        const { federalId } = getItemStorage();
        federal = federalId;
    }

    //REPLACE CEP
    const zipcodeReplaced = zipcode.replace(/\D/g, '');


    const button = document.querySelector(".brz-btn-submit.submit_endereco");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";


    axios
        .post(`${API_URL}/registrar-endereco`, {
            "federalId": federal,
            "address": address,
            "addressNumber": addressNumber,
            "district": district,
            "city": city,
            "state": state,
            "zipcode": zipcodeReplaced
        }, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            nextStepInfos(federal);
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "CONFIRMAR E CONTINUAR";
            console.log(error.response.data.message);
            showToast("Parece que houve um problema! Por Favor, tente novamente!")
        });
}

function registrarDocumento(type, number, issueDate, agencyState, motherName) {


    function obterParametroDaURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
    const urlFederalId = obterParametroDaURL('federalId');

    let federal;

    if (urlFederalId) {
        federal = urlFederalId;
    } else {
        const { federalId } = getItemStorage();
        federal = federalId;
    }

    const button = document.querySelector(".brz-btn-submit.submit_documento");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios
        .post(`${API_URL}/registrar-documento`, {
            "federalId": federal,
            "type": type,
            "number": number,
            "issueDate": issueDate,
            "agencyState": agencyState,
            "mother": motherName
        }, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            nextStepInfos(federal)
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "CONFIRMAR E CONTINUAR";
            console.log(error.response.data.message);
            showToast("Parece que houve um problema! Por Favor, tente novamente!")
        });
}

function registrarConta(bankNo, branch, acctNo, acctType) {

    function obterParametroDaURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
    const urlFederalId = obterParametroDaURL('federalId');

    let federal;

    if (urlFederalId) {
        federal = urlFederalId;
    } else {
        const { federalId } = getItemStorage();
        federal = federalId;
    }

    const button = document.querySelector(".brz-btn-submit.submit_conta");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios
        .post(`${API_URL}/registrar-conta`, {
            "federalId": federal,
            "bankNo": bankNo,
            "branch": branch,
            "acctNo": acctNo,
            "acctType": acctType
        }, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            nextStepInfos(federal)
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "CONFIRMAR E CONTINUAR";
            console.log(error.response.data.message);
            showToast("Parece que houve um problema! Por Favor, tente novamente!")
        });
}

function validateEndereco() {
    const zipcode = document.querySelector('[data-brz-label="CEP"]').value;
    const address = document.querySelector('[data-brz-label="Rua"]').value;
    const addressNumber = document.querySelector('[data-brz-label="Número"]').value;
    const district = document.querySelector('[data-brz-label="Bairro"]').value;
    const city = document.querySelector('[data-brz-label="Cidade"]').value;
    const state = document.querySelector('[data-brz-label="UF"]').value;

    if (
        zipcode == "" ||
        address == "" ||
        addressNumber == "" ||
        state == "" ||
        district == "" ||
        city == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    } else if (!validateUF(state)) {
        showToast("Por favor, informe um estado válido.");
        return false;
    } else {
        registrarEndereco(zipcode, address, addressNumber, district, city, state);
    }

}

function validateDocumento() {
    const type = document.querySelector('[data-brz-label="Tipo de Documento"]').value;
    const number = document.querySelector('[data-brz-label="Número do Documento"]').value;
    const issueDate = document.querySelector('[data-brz-label="Data de Emissão"]').value;
    const agencyState = document.querySelector('[data-brz-label="UF Expeditor"]').value;
    const motherName = document.querySelector('[data-brz-label="Nome da sua Mãe"]').value;

    if (
        type == "" ||
        number == "" ||
        issueDate == "" ||
        agencyState == "" ||
        motherName == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    } else if (!isDateValid(issueDate)) {
        showToast("A data de emissão informada não é válida!");
        return false;
    } else if (!validateUF(agencyState)) {
        showToast("Por favor, informe um estado válido.");
        return false;
    } else {
        registrarDocumento(type, number, issueDate, agencyState, motherName);
    }
}

function validateConta() {
    const selectedBankElement = document.querySelector('[data-brz-label="Banco"]');
    const bankNo = selectedBankElement.value;
    let acctType = document.querySelector('[data-brz-label="Tipo de conta"]').value;
    const branch = document.querySelector('[data-brz-label="Agência"]').value;
    const account = document.querySelector('[data-brz-label="Conta"]').value;
    const verifyDigit = document.querySelector('[data-brz-label="Dígito"]').value;

    // Adicionando a verificação para o tipo de conta
    if (acctType.toLowerCase() === 'conta corrente') {
        acctType = 'C';
    } else if (acctType.toLowerCase() === 'poupança') {
        acctType = 'P';
    }

    if (
        bankNo == "" ||
        acctType == "" ||
        branch == "" ||
        account == "" ||
        verifyDigit == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    } else {
        registrarConta(bankNo, branch, account + verifyDigit, acctType);
    }
}