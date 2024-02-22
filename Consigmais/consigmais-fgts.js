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
let workWithSignedWorkCard;
let withdrawalEnabled;

let naoQualificar;
let worked;

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
function validatorQuestions() {
    const firstChoice = document
        .querySelector('[data-brz-label="Tem ou já teve um emprego com carteira assinada?"]')
        .value.toLowerCase();
    const secondChoice = document
        .querySelector('[data-brz-label="Você ativou o Saque-Aniversário no FGTS?"]')
        .value.toLowerCase();

    if (firstChoice === "" || secondChoice === "") {
        showToast("Por favor, responda todas as perguntas.");
        return false;
    } else {
        workWithSignedWorkCard = firstChoice === "sim, estou trabalhando com carteira assinada." || firstChoice === "sim, já trabalhei assim antes, mas não estou mais.";
        withdrawalEnabled = secondChoice === "sim, já está ativado.";

        naoQualificar = !withdrawalEnabled;


        criar_contato_fgts();
    }
}

function validateForm() {
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

    //SALVAR NAS VARIAVEIS GLOBAIS
    name = nameElement;
    phone = phoneElement;
    federalId = federalIdElement;
    birth = birthElement;
    email = emailElement

    //ABRA O POP UP DE QUESTIONARIO
    const questions = document.getElementById("questions");
    questions.click();
}

//CRIAR CONTATO FGTS
async function criar_contato_fgts() {

    //CONFIG
    const nextStep = "qualification"
    const pipeline_slug = "fgts"
    const autorizedBanks = ["bmg", "eccor"];

    const federalId_replaced = federalId.replace(/[^\d]/g, "");
    const name_replaced = name.replace(/\s+/g, ' ');

    const button = document.querySelector(".submit_questions");
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
        workWithSignedWorkCard: workWithSignedWorkCard,
        withdrawalEnabled: withdrawalEnabled,
        naoQualificar: naoQualificar,
    }, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then((response) => {
            if (naoQualificar) {
                getProximaEtapa(pipeline_slug, federalId_replaced)
                window.location.href = "enable" + "?" + "pipeline_slug=" + pipeline_slug + "&" + "federalId=" + federalId_replaced;
            } else if (!worked) {
                window.location.href = "noopportunity" + "?" + "pipeline_slug=" + pipeline_slug + "&" + "federalId=" + federalId_replaced;
            } else {
                getProximaEtapa(pipeline_slug, federalId_replaced)
                window.location.href = "authorize" + "?" + "pipeline_slug=" + pipeline_slug + "&" + "federalId=" + federalId_replaced;
            }
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "ACEITAR E CONTINUAR";
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
                                URL_redirect = `/enable`;
                                window.location.href = URL_redirect;
                                break;
                            case "autorizar-banco":
                                URL_redirect = `/authorize`;
                                window.location.href = URL_redirect;
                                break
                            case "assinatura-pendente":
                                bankRedirect(oportunidades)
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

                    //NOOPPORTUNITY
                    case "sem-oportunidade":
                        if (!controlNoOpportunity) {
                            controlNoOpportunity = true;
                            setTimeout(function () {
                                sendRequest();
                            }, 5000);
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
                                console.log("Tempo esgotado. Executando sendRequest().");
                                sendRequest();
                            }
                        }, 1000);
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

//OBTER PRÓXIMA ETAPA
function getProximaEtapa(pipeline, federalId) {
    axios.get(`${API_URL}/proxima-etapa/${pipeline}/${federalId}`, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then((response) => {
            const leadId = response.data.id;
            setItemStorage({
                pipelineSlug: pipeline,
                federalId: federalId,
                leadId: leadId,
            });
        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a próxima etapa");
        });
}


//GERENCIAMENTO DAS PERGUNTAS
var inputElement1 = document.querySelector('[data-brz-label="Já Trabalhou de Carteira Assinada?"]');
var inputElement2 = document.querySelector('[data-brz-label="Você ativou o Saque-Aniversário no FGTS?"]');

if (inputElement1 && inputElement2) {
    inputElement1.addEventListener("change", changeQuestionOne);
    inputElement2.addEventListener("change", changeQuestionTwo);
}

var forms2Element = document
    .getElementById("questions_fgts")
    .querySelector(".brz-forms2");
var divs = forms2Element.querySelectorAll(".brz-forms2__item");

if (divs.length >= 2) {
    divs[1].style.display = "none";
    divs[2].style.display = "none";
}


function changeQuestionOne() {
    var selectedOption = selectElement1.options[selectElement1.selectedIndex].value;
    if (selectedOption === "Sim, estou trabalhando com carteira assinada." || selectedOption === "Sim, já trabalhei assim antes, mas não estou mais.") {
        var divs = forms2Element.querySelectorAll(".brz-forms2__item");

        if (divs.length >= 2) {
            divs[1].style.display = "block";
        }

    } else if (selectedOption === "Não, nunca trabalhei com carteira assinada.") {
        worked = false
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
        }

    } else {
        var divs = forms2Element.querySelectorAll(".brz-forms2__item");

        if (divs.length >= 2) {
            divs[2].style.display = "none";
        }
    }
}





