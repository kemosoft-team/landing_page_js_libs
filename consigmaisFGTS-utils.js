//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let step_URL = window.location.host;
let URL_redirect = "";
let origin = window.location.href;
let referrer = document.referrer;
let name;
let phone;
let federalId;
let birth;
let workWithSignedWorkCard;
let withdrawalEnabled;

let controlNoOpportunity = false;

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


function saveDataToLocalStorage({
    name,
    phone,
    federalId,
    birthDate,
    pipelineSlug,
    workWithSignedWorkCard,
    withdrawalEnabled,
    origin }) {
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

function setBanks(bankList) {
    const selects = document.querySelectorAll('[data-brz-label="Banco"]');

    selects.forEach(select => {
        // Limpar opções existentes no select antes de adicionar novas
        select.innerHTML = "";

        bankList.forEach(bank => {
            const option = document.createElement('option');
            option.text = bank.name;
            option.value = bank.bank_no;
            select.add(option);
        });
    });
}

function bankRedirect(banco) {
    switch (banco) {
        case "eccor":
            URL_redirect = `/signature?tp=wpp`;
            window.location.href = URL_redirect;
            break
        case "facta":
            URL_redirect = `/signature?tp=link`;
            window.location.href = URL_redirect;
            break
        case "bmg":
            URL_redirect = `/signature?tp=sms`;
            window.location.href = URL_redirect;
            break
        default:
            console.log("Banco não reconhecido.");
    }
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

//CRIAR CONTATO FGTS
async function criar_contato_fgts() {

    //CONFIG
    const nextStep = "qualification"
    const pipeline_slug = "fgts"
    const autorizedBanks = ["bmg"];

    const federalId_replaced = federalId.replace(/[^\d]/g, "");

    axios.post(API_URL + '/criar-contato', {
        name: name,
        phone: phone,
        birthDate: birth,
        federalId: federalId_replaced,
        autorizedBanks: autorizedBanks,
        pipelineSlug: pipeline_slug,
        origin: origin,
        referrer: referrer,
        workWithSignedWorkCard: workWithSignedWorkCard,
        withdrawalEnabled: withdrawalEnabled,
    })
        .then((response) => {
            window.location.href = nextStep + "?" + "pipeline_slug=" + pipeline_slug + "&" + "federalId=" + federalId_replaced;
            console.log("Contato FGTS criado")
        })
        .catch(function (error) {
            showToast(error.response.data.message);
        });
}

//QUALIFICAÇÃO
function qualification() {
    var attempt = 0;
    var attemptWaiting = 0;

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
        console.log("Enviou para o Storage: ", pipelineSlug, federalId)
    } else {
        const dataQualificationLocalStorage = localStorage.getItem('dataQualification');
        if (dataQualificationLocalStorage) {
            const storedDataQualification = JSON.parse(dataQualificationLocalStorage);
            pipelineSlug = storedDataQualification.pipelineSlug;
            federalId = storedDataQualification.federalId;

            console.log("Não tinha na URL: ", pipelineSlug, federalId);
        } else {
            console.log('Nenhum valor armazenado no localStorage para dataQualification');
        }
    }


    const sendRequest = () => {
        axios
            .get(`${API_URL}/proxima-etapa/${pipelineSlug}/${federalId}`, {})
            .then((response) => {
                let URL_redirect;
                const contexto = response.data.contexto;
                const situacao = response.data.situacao;
                const perfil = response.data.perfil;
                const mensagem = response.data.mensagem;
                const protocolo = response.data.protocolo;
                /* PEDIR INFO */
                const pedirInfos = response.data.pedirInfos;
                /* OPORTUNIDADE */
                const oportunidades = response.data.oportunidades;
                // ENVIAR OPORTUNIDADE PARA O LOCALSTORAGE
                const oportunidadesJSON = JSON.stringify(oportunidades);
                localStorage.setItem('oportunidades', oportunidadesJSON);

                const id = response.data.oportunidades.id;
                const produto = response.data.oportunidades.produto;
                const banco = response.data.oportunidades.banco;
                const etapa = response.data.oportunidades.etapa;
                const acao = response.data.oportunidades.acao;
                const linkAssinatura = response.data.oportunidades.linkAssinatura;

                switch (contexto) {
                    //REQUER AÇÃO DO CLIENTE
                    case "resolver-situação":
                        switch (situacao) {
                            case "matricula":
                                URL_redirect = `/benefit`;
                                window.location.href = URL_redirect;
                                break;
                            case "habilitar-saque":
                                URL_redirect = `/enable`;
                                window.location.href = URL_redirect;
                                break;
                            case "autorizar-banco":
                                URL_redirect = `/authorize`;
                                window.location.href = URL_redirect;
                                break
                            case "assinatura-pendente":
                                bankRedirect(banco)
                        }

                    //TEM OPORTUNIDADE
                    case "tem-oportunidade":
                        if (pedirInfos.length > 0 && (perfil == "novato" || perfil == "tomador")) {
                            URL_redirect = `/opportunity?protocol=${protocolo}&tp=wpp`;
                            window.location.href = URL_redirect;
                        } else if (pedirInfos.length > 0 && perfil == "tomador") {
                            URL_redirect = `/opportunity?tp=web`;
                            window.location.href = URL_redirect;
                        } else {
                            URL_redirect = `/success?protocol=${protocolo}`;
                            window.location.href = URL_redirect;
                        }
                        break;
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

                    //AGUARDANDO QUALIFICAÇÃO  (Estamos buscando uma oportunidade, aguarde a qualificação)
                    case "aguardando-qualificacao":
                        attemptWaiting++;
                        console.log("contator: ", attemptWaiting)
                        if (attemptWaiting < 4) {
                            setTimeout(function () {
                                sendRequest();
                            }, 3000);
                        } else {
                            var popUpNoResponse = document.querySelector("#popUpNoResponse");
                            popUpNoResponse.click()
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

function redirectToSignature() {
    // Obter as oportunidades do localStorage
    const oportunidadesJSON = localStorage.getItem("oportunidades");

    if (oportunidadesJSON) {
        // Fazer o parse das oportunidades
        const oportunidades = JSON.parse(oportunidadesJSON);

        // Verificar se oportunidades é um array
        if (Array.isArray(oportunidades)) {
            // Encontrar a oportunidade com a ação "confirmar"
            const oportunidadeConfirmar = oportunidades.find(function (oportunidade) {
                return oportunidade.acao === 'confirmar';
            });

            if (oportunidadeConfirmar) {
                const banco = oportunidadeConfirmar.banco;

                // Substitua bankRedirect pelo que você precisar fazer com o banco
                console.log("Redirecionando para o banco:", banco);
            } else {
                console.log("Nenhuma oportunidade com ação 'confirmar' encontrada no localStorage.");
            }
        } else {
            console.log("O conteúdo de 'oportunidades' no localStorage não é um array.");
        }
    } else {
        console.log("Nenhuma informação 'oportunidades' encontrada no localStorage.");
    }
}



function onTheWeb() {
    //OBTER INFO DO LOCALSTORAGE
    var DataInfoQualification = localStorage.getItem("dataQualification");
    var infoQualification = JSON.parse(DataInfoQualification);

    let federalId = infoQualification.federalId;

    axios.get(`${API_URL}/${pipelineSlug}/proxima-etapa/${federalId}`, {})
        .then((response) => {
            /* PEDIR INFO */
            const pedirInfos = response.data.pedirInfos;

            if (pedirInfos.includes("documento")) {
                URL_redirect = `/document`;
                window.location.href = URL_redirect;

            } else if (pedirInfos.includes("endereco")) {
                URL_redirect = `/address`;
                window.location.href = URL_redirect;

            } else if (pedirInfos.includes("conta")) {
                URL_redirect = `/account`;
                window.location.href = URL_redirect;
            }



        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
        });
}

//REGISTRAR FORMULARIOS
function registrarEndereco(zipcode, address, addressNumber, district, city, state) {
    //OBTER INFO DO LOCALSTORAGE
    var DataInfoQualification = localStorage.getItem("dataQualification");
    var infoQualification = JSON.parse(DataInfoQualification);

    let federalId = infoQualification.federalId;


    axios
        .get(`${API_URL}/registrar-endereco`, {
            "federalId": federalId,
            "address": address,
            "addressNumber": addressNumber,
            "district": district,
            "city": city,
            "state": state,
            "zipcode": zipcode
        })
        .then((response) => {
            qualification()
        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
        });
}

function registrarEndereco(type, number, issueDate, agency, agencyState) {
    //OBTER INFO DO LOCALSTORAGE
    var DataInfoQualification = localStorage.getItem("dataQualification");
    var infoQualification = JSON.parse(DataInfoQualification);

    let federalId = infoQualification.federalId;

    axios
        .get(`${API_URL}/registrar-endereco`, {
            "federalId": federalId,
            "type": type,
            "number": number,
            "issueDate": issueDate,
            "agency": agency,
            "agencyState": agencyState
        })
        .then((response) => {
            qualification()
        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
        });
}

function registrarConta(bankNo, branch, acctNo, acctType) {
    //OBTER INFO DO LOCALSTORAGE
    var DataInfoQualification = localStorage.getItem("dataQualification");
    var infoQualification = JSON.parse(DataInfoQualification);

    let federalId = infoQualification.federalId;

    axios
        .get(`${API_URL}/registrar-endereco`, {
            "federalId": federalId,
            "bankNo": bankNo,
            "branch": branch,
            "acctNo": acctNo,
            "acctType": acctType
        })
        .then((response) => {
            qualification()
        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
        });
}



//VALIDAÇÕES
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
    withdrawalEnabled = secondChoice === "sim";

    criar_contato_fgts();
}

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
    }

    registrarEndereco(zipcode, address, addressNumber, district, city, state);
}

function validateDocumento() {
    const type = document.querySelector('[data-brz-label="Tipo de Documento"]').value;
    const number = document.querySelector('[data-brz-label="Número do Documento"]').value;
    const issueDate = document.querySelector('[data-brz-label="Data de Emissão"]').value;
    const agency = document.querySelector('[data-brz-label="Expeditor"]').value;
    const agencyState = document.querySelector('[data-brz-label="UF Expeditor"]').value;

    if (
        type == "" ||
        number == "" ||
        issueDate == "" ||
        agency == "" ||
        agencyState == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }

    registrarEndereco(type, number, issueDate, agency, agencyState);
}

function validateConta() {
    const bank = document.querySelector('[data-brz-label="Banco"]').value;
    const acctType = document.querySelector('[data-brz-label="Tipo de conta"]').value;
    const branch = document.querySelector('[data-brz-label="Agência"]').value;
    const account = document.querySelector('[data-brz-label="Conta"]').value;
    const verifyDigit = document.querySelector('[data-brz-label="Dígito"]').value;

    if (
        bank == "" ||
        acctType == "" ||
        branch == "" ||
        account == "" ||
        verifyDigit == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }

    let acctNo = account + verifyDigit;
    let bankNo = bank.bank_no;

    registrarConta(bankNo, branch, acctNo, acctType);
}
