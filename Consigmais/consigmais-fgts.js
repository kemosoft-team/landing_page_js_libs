//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let API_KEY = "381e75ed-12ce-4673-930a-e0815c0545dc"
let step_URL = window.location.host;
let URL_redirect = "";
let origin = window.location.href;
let referrer = document.referrer;

let name;
let phone;
let federalId;
let birth;
let email;
let leadId

let jaTrabalhouCarteiraAssinada;
let saqueHabilitado;

let controlNoOpportunity = false;

/* REDIRECIONAMENTO E INTEGRAÇÕES EXTERNAS */
function callback(urlCallBack) {
    console.log(urlCallBack);
    axios.post(`https://api.retool.com/v1/workflows/e166680b-6824-49f8-9801-fdb55e7588d2/startTrigger?workflowApiKey=retool_wk_18c231a430cc43159f83b873c786b9c9`, {
        "callbackUrl": urlCallBack
    })
        .then((response) => {
            window.location.href = "https://wa.me/558440420474";
        })
        .catch(function (error) {
            console.log(error, "Erro no post n8n");
        });
}
//VALIDAÇÕES
function validar_questions() {
    const firstChoice = document
        .querySelector('[data-brz-label="Tem ou já teve um emprego com carteira assinada?"]')
        .value.toLowerCase();
    const secondChoice = document
        .querySelector('[data-brz-label="Você ativou o Saque-Aniversário no FGTS?"]')
        .value.toLowerCase();

    if (firstChoice === "") {
        showToast("Por favor, responda todas as perguntas.");
        return false;

    } else if ((firstChoice === "sim, estou trabalhando com carteira assinada." || firstChoice === "sim, já trabalhei assim antes, mas não estou mais.") && secondChoice === "") {
        showToast("Por favor, responda todas as perguntas.");
        return false;

    } else if (firstChoice === "não, nunca trabalhei com carteira assinada.") {
        jaTrabalhouCarteiraAssinada = false;
        saqueHabilitado = false;
        criar_questions(jaTrabalhouCarteiraAssinada, saqueHabilitado);
    } else {
        jaTrabalhouCarteiraAssinada = firstChoice === "sim, estou trabalhando com carteira assinada." || firstChoice === "sim, já trabalhei assim antes, mas não estou mais.";
        saqueHabilitado = secondChoice === "sim, já está ativado.";
        criar_questions(jaTrabalhouCarteiraAssinada, saqueHabilitado);
    }
}

function validar_contato_fgts() {
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
    const emailElement = document.querySelector(
        '[data-brz-label="Email (Opcional)"]'
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
    if (!nameElement.trim() || !/[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(nameElement)) {
        showToast("Por favor, digite seu nome completo");
        return false;
    }
    if (!validateCPF(federalIdElement)) {
        showToast("O CPF não é válido!");
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
    if (emailElement && !validateEmail(emailElement)) {
        showToast("O e-mail informado não é válido!");
        return false;
    }
    //SALVAR NAS VARIAVEIS GLOBAIS
    name = nameElement;
    phone = phoneElement;
    federalId = federalIdElement;
    birth = birthElement;
    email = emailElement

    criar_contato_fgts();
}

//CRIAR CONTATO FGTS
async function criar_contato_fgts() {

    //CONFIG
    const pipeline_slug = "fgts"
    const autorizedBanks = ["bmg", "eccor", "facta", "novo-saque"];

    /* REPLACE */
    const federalId_replaced = federalId.replace(/[^\d]/g, "");
    const name_replaced = name.replace(/\s+/g, ' ');

    const button = document.querySelector(".brz-btn-submit.submit_form");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios.post(API_URL + '/criar-contato', {
        name: name_replaced,
        phone: phone,
        birthDate: birth,
        federalId: federalId_replaced,
        email: email,
        autorizedBanks: autorizedBanks,
        pipelineSlug: pipeline_slug,
        origin: origin,
        referrer: referrer,
        naoQualificar: true,
    }, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then(async (response) => {
            leadId = response.data.id;
            federalId = federalId_replaced;
            console.log("Criar Contato: ", leadId)

            setItemStorage({
                pipelineSlug: pipeline_slug,
                federalId: federalId_replaced,
                leadId: leadId,
            });
            
            const customId = federalId_replaced;
            window.clarity("identify", customId);

            //ABRA O POP UP DE QUESTIONARIO
            const questions = document.getElementById("questions");
            questions.click();
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "ACEITAR E CONTINUAR";
            showToast(error.response.data.message);
        });
}

function criar_questions(jaTrabalhouCarteiraAssinada, saqueHabilitado) {
    //removerAtributos Attempts
    removeAttributeStorage()

    let attemptsEnable = localStorage.getItem("attemptsEnable") || 0;
    let attemptsAuth = localStorage.getItem("attemptsAuth") || 0;

    const button = document.querySelector(".brz-btn-submit.submit_questions");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios.post(API_URL + `/${leadId}/perguntas`, {
        jaTrabalhouCarteiraAssinada: jaTrabalhouCarteiraAssinada,
        saqueHabilitado: saqueHabilitado
    }, {
        headers: {
            'api-key': API_KEY
        }
    })

        .then(async (response) => {
            if (!jaTrabalhouCarteiraAssinada) {
                window.location.href = "noopportunity" + "?" + "federalId=" + federalId + "&" + "id=" + leadId;

            } else if (!saqueHabilitado) {
                attemptsEnable++;
                localStorage.setItem("attemptsEnable", attemptsEnable);
                window.location.href = "enable" + "?" + "federalId=" + federalId + "&" + "id=" + leadId;
            } else if (saqueHabilitado) {
                attemptsAuth++;
                localStorage.setItem("attemptsAuth", attemptsAuth);
                window.location.href = "authorize" + "?" + "federalId=" + federalId + "&" + "id=" + leadId;
            }
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "Simular Agora";
            showToast(error.response.data.message);
        });
}

//QUALIFICAÇÃO
function qualification() {
    var attempt = 0;

    let attemptsEnable = localStorage.getItem("attemptsEnable") || 0;
    let attemptsAuth = localStorage.getItem("attemptsAuth") || 0;

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
                setItemStorage({
                    pipelineSlug: pipelineSlug,
                    federalId: federalId,
                    leadId: leadId,
                    opportunity: oportunidades
                });
                switch (contexto) {
                    //REQUER AÇÃO DO CLIENTE
                    case "resolver-situacao":
                        switch (situacao) {
                            case "habilitar-saque":
                                attemptsEnable++;
                                localStorage.setItem("attemptsEnable", attemptsEnable);

                                URL_redirect = `/enable`;
                                window.location.href = URL_redirect;
                                break;
                            case "autorizar-banco":
                                attemptsAuth++;
                                localStorage.setItem("attemptsAuth", attemptsAuth);

                                URL_redirect = `/authorize`;
                                window.location.href = URL_redirect;
                                break
                            case "assinatura-pendente":
                                bankRedirect(oportunidades, contexto)
                                break
                            case "atualizar-registro-fgts":
                                URL_redirect = `/requirestreatment`;
                                window.location.href = URL_redirect;
                                break
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
                        }
                        break
                    //JANELA MES ANIVERSÁRIO
                    case "janela-bloqueio":
                        URL_redirect = `/window`;
                        window.location.href = URL_redirect;
                        break;
                    //AGUARDAR LINK-LINK-ASSINATURA
                    case "aguardar-link-assinatura":
                        bankRedirect(oportunidades, contexto)
                        break;
                    //EM ANALISE
                    case "em-analise":
                        URL_redirect = `/paymentstatus?tp=ea`;
                        window.location.href = URL_redirect;
                        break;
                    //PAGO
                    case "pago":
                        URL_redirect = `/paymentstatus?tp=pg`;
                        window.location.href = URL_redirect;
                        break;
                    //PAGO E EM ANALISE
                    case "pago-&-analise":
                        URL_redirect = `/paymentstatus?tp=pa`;
                        window.location.href = URL_redirect;
                        break;
                    //NOOPPORTUNITY
                    case "sem-oportunidade":
                        URL_redirect = `/noopportunity`;
                        window.location.href = URL_redirect;
                        break;
                    //NOQUALIFIED
                    case "nao-qualificado":
                        URL_redirect = `/noqualified`;
                        window.location.href = URL_redirect;
                        break;
                    //AGUARDANDO QUALIFICAÇÃO
                    case "aguardando-qualificacao":
                        URL_redirect = `/qualification?pipeline_slug=${pipelineSlug}&federalId=${federalId}&waiting=true`;
                        window.location.href = URL_redirect;
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

//GERENCIAMENTO DAS PERGUNTAS
function changeQuestionOne() {
    var selectedOption = selectElement1.options[selectElement1.selectedIndex].value;
    if (selectedOption === "Sim, estou trabalhando com carteira assinada." || selectedOption === "Sim, já trabalhei assim antes, mas não estou mais.") {
        var divs = forms2Element.querySelectorAll(".brz-forms2__item");
        if (divs.length >= 2) {
            divs[1].style.display = "block";
        }
    } else {
        var divs = forms2Element.querySelectorAll(".brz-forms2__item");
        if (divs.length >= 2) {
            divs[1].style.display = "none";
        }
    }
}

function changeQuestionTwo() {
    var selectedOption = selectElement2.options[selectElement2.selectedIndex].value;
    if (selectedOption === "Sim, já está ativado.") {
        var divs = forms2Element.querySelectorAll(".brz-forms2__item");
        if (divs.length >= 2) {
            divs[2].style.display = "block";
            textFooter.style.display = "block";
            textBanksDiv.style.display = "block";
        }
    } else {
        var divs = forms2Element.querySelectorAll(".brz-forms2__item");
        if (divs.length >= 2) {
            divs[2].style.display = "none";
            textFooter.style.display = "none";
            textBanksDiv.style.display = "none";
        }
    }
}

