//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let API_KEY = "381e75ed-12ce-4673-930a-e0815c0545dc";

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


function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () {
        x.className = x.className.replace("show", `${text}`);
    }, 3000);
}

//MOSTRAR LOADER
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
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

function callback(urlCallBack) {
    console.log(urlCallBack);

    axios.post(`https://api.retool.com/v1/workflows/e166680b-6824-49f8-9801-fdb55e7588d2/startTrigger?workflowApiKey=retool_wk_18c231a430cc43159f83b873c786b9c9`, {
        "callbackUrl": urlCallBack
    })
        .then((response) => {
            window.location.href = "https://wa.me/554840429340";
        })
        .catch(function (error) {
            console.log(error, "Erro no post n8n");
        });
}

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
        pipelineSlug: storedDataQualification.pipelineSlug || "",
        federalId: storedDataQualification.federalId || "",
        leadId: storedDataQualification.leadId || "",
        opportunity: storedDataQualification.opportunity || ""
    };
}

function bankRedirect(banco) {
    switch (banco) {
        case "Eccor Open FGTS":
            URL_redirect = `/signature?tp=wpp`;
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

function requalify(enrollment) {

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
// CRIAR CONTATO INSS
function criar_contato_inss() {
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

    axios.post(API_URL + "/criar-contato", {
        name: name,
        phone: phone,
        federalId: federalId_replaced,
        birthDate: birth,
        representativeName: name_Representive,
        representativeFederalId: federalId_Representive_replaced,
        enrollment: enrollment,
        retiredOrPensioner: retiredOrPensioner,
        hasTakenLoan: hasTakenLoan,
        benefitAmountRange: benefitAmountRange,
        pipelineSlug: pipeline_slug,
        origin: origin,
        referrer: referrer,
    }, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then((response) => {
            window.location.href = nextStep + "?" + "pipeline_slug=" + pipeline_slug + "&" + "federalId=" + federalId_replaced;
        })
        .catch(function (error) {
            showToast(error.response.data.message);
        });
}
//QUALIFICAÇÃO
function qualification() {
    var attempt = 0;

    function obterParametroDaURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
    let pipelineSlug = obterParametroDaURL('pipeline_slug');
    let federalId = obterParametroDaURL('federalId');

    if (pipelineSlug && federalId) {
        const dataQualification = {
            pipelineSlug: pipelineSlug,
            federalId: federalId
        };

        const dataQualificationJSON = JSON.stringify(dataQualification);
        localStorage.setItem('dataQualification', dataQualificationJSON);
    } else {
        const dataQualificationLocalStorage = localStorage.getItem('dataQualification');
        if (dataQualificationLocalStorage) {
            const storedDataQualification = JSON.parse(dataQualificationLocalStorage);
            pipelineSlug = storedDataQualification.pipelineSlug;
            federalId = storedDataQualification.federalId;
        } else {
            console.log('Nenhum valor armazenado no localStorage para qualificação');
        }
    }


    const sendRequest = () => {
        axios
            .get(`${API_URL}/proxima-etapa/${pipelineSlug}/${federalId}`, {
                headers: {
                    'api-key': API_KEY
                }
            })
            .then((response) => {
                let URL_redirect;
                const contexto = response.data.contexto;
                const situacao = response.data.situacao;
                const perfil = response.data.perfil;
                const leadId = response.data.id;
                const pedirInfos = response.data.pedirInfos;
                const oportunidades = response.data.oportunidades;
                const banco = response.data.oportunidades.banco;

                setItemStorage({
                    pipelineSlug: pipelineSlug,
                    federalId: federalId,
                    leadId: leadId,
                    opportunity: oportunidades
                });


                switch (contexto) {
                    //NOOPPORTUNITY
                    case "sem-oportunidade":
                        if (!controlNoOpportunity) {
                            controlNoOpportunity = true;
                            setTimeout(function () {
                                sendRequest();
                            }, 3000);
                        } else {
                            URL_redirect = `/noopportunity`;
                            window.location.href = URL_redirect;
                        }
                        break;
                    //NOQUALIFIED
                    case "nao-qualificado":
                        URL_redirect = `/noqualified`;
                        window.location.href = URL_redirect;
                        break;

                    //AGUARDANDO QUALIFICAÇÃO 
                    case "aguardando-qualificacao":
                        let segundos = 20;

                        const timeoutElement = document.getElementById("timeout");
                        timeoutElement.style.display = "block";
                        timeoutElement.style.fontFamily = "'Poppins', sans-serif !important";
                        timeoutElement.style.fontSize = "25px";
                        timeoutElement.style.textAlign = "center";
                        timeoutElement.style.fontWeight = "700";


                        const timer = setInterval(function () {
                            console.log("Tempo restante: " + segundos + " segundos");
                            timeoutElement.innerText = segundos;
                            segundos--;
                            if (segundos < 0) {
                                clearInterval(timer);
                                sendRequest();
                            }
                        }, 1000);

                        break;

                    //ENROLLMENT INSS
                    case "resolver-situacao":
                        switch (situacao) {
                            //INFORMAR MATRICULA
                            case "informar-matricula":
                                URL_redirect = `/benefit`;
                                window.location.href = URL_redirect;
                                break;
                            //INFORMAR MATRICULA NOVAMENTE
                            case "informar-matricula-valida":
                                URL_redirect = `/benefit?tp=valida`;
                                window.location.href = URL_redirect;
                                break;
                            //SOLICITAR IN100
                            case "solicitar-in100":
                                URL_redirect = `/requirestreatment`;
                                window.location.href = URL_redirect;
                                break;
                            //TEM OPORTUNIDADE
                            case "escolher-simulacao":
                                if (pedirInfos.length > 0) {
                                    URL_redirect = `/opportunity`;
                                    window.location.href = URL_redirect;
                                } else {
                                    URL_redirect = `/success`;
                                    window.location.href = URL_redirect;
                                }
                                break;
                            //ASSINATURA PENDENTE
                            case "assinatura-pendente":
                                bankRedirect(banco)
                                break
                        }

                        break


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
function nextStepInfos(federal) {

    function obterParametroDaURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
    const urlCallBack = obterParametroDaURL('callbackUrl');

    let federalIdRequest;

    if (!federal) {
        const { federalId } = getItemStorage();
        federalIdRequest = federalId;
    } else {
        federalIdRequest = federal;
    }

    axios
        .get(`${API_URL}/proxima-etapa/inss/${federalIdRequest}`, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            /* PEDIR INFO */
            const pedirInfos = response.data.pedirInfos;
            console.log(pedirInfos)

            if (pedirInfos.includes("documento")) {
                URL_redirect = `/documento?federalId=${federalIdRequest}&callbackUrl=${urlCallBack}`;
                window.location.href = URL_redirect;

            } else if (pedirInfos.includes("endereco")) {
                URL_redirect = `/endereco?federalId=${federalIdRequest}&callbackUrl=${urlCallBack}`;
                window.location.href = URL_redirect;

            } else if (pedirInfos.includes("conta")) {
                URL_redirect = `/conta?federalId=${federalIdRequest}&callbackUrl=${urlCallBack}`;
                window.location.href = URL_redirect;
            } else {
                if (urlCallBack) {
                    callback(urlCallBack)
                } else {
                    qualification()
                }
            }

        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
        });
}
//REGISTRAR FORMULÁRIOS
function registrarBenefit(enrollment) {

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

    const button = document.querySelector(".brz-btn-submit.submit_benefit");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios
        .post(API_URL + "/registrar-dados-empregaticios", {
            federalId: federal,
            enrollment: enrollment,
        }, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            requalify(enrollment)
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "CONFIRMAR E CONTINUAR";
            console.log(error.response.data.message);
            showToast("Parece que houve um problema! Por Favor, tente novamente!")
        });
}
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

//VALIDAR FORMULÁRIOS
function validateFormInss() {
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
    retiredOrPensioner = firstChoice === "sim";
    hasTakenLoan = secondChoice === "sim";

    //ABRA O POP UP DE INFO BENEFIT
    const benefit = document.getElementById("benefit");
    benefit.click();
}
function validateBenefit() {
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

    registrarBenefit(enrollment);
}
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


