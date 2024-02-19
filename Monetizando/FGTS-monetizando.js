//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let API_KEY = "92bb024f-cb57-4be0-816c-47ff99f97536"


let step_URL = window.location.host;
let URL_redirect = "";
let origin = window.location.href;
let referrer = document.referrer;
let name;
let phone;
let federalId;
let email;
let birth;
let workWithSignedWorkCard;
let withdrawalEnabled;

let controlNoOpportunity = false;


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
        .get(`${API_URL}/proxima-etapa/fgts/${federalIdRequest}`, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            /* PEDIR INFO */
            const pedirInfos = response.data.pedirInfos;
            console.log(pedirInfos)

            if (pedirInfos.includes("documento")) {
                if (urlCallBack) {
                    URL_redirect = `/documento?federalId=${federalIdRequest}&callbackUrl=${urlCallBack}`;
                    window.location.href = URL_redirect;
                } else {
                    URL_redirect = `/documento?federalId=${federalIdRequest}`;
                    window.location.href = URL_redirect;
                }

            } else if (pedirInfos.includes("endereco")) {
                if (urlCallBack) {
                    URL_redirect = `/endereco?federalId=${federalIdRequest}&callbackUrl=${urlCallBack}`;
                    window.location.href = URL_redirect;
                } else {
                    URL_redirect = `/endereco?federalId=${federalIdRequest}`;
                    window.location.href = URL_redirect;
                }


            } else if (pedirInfos.includes("conta")) {
                if (urlCallBack) {
                    URL_redirect = `/conta?federalId=${federalIdRequest}&callbackUrl=${urlCallBack}`;
                    window.location.href = URL_redirect;
                } else {
                    URL_redirect = `/conta?federalId=${federalIdRequest}`;
                    window.location.href = URL_redirect;
                }
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

//CRIAR CONTATO FGTS
async function criar_contato_fgts() {

    //CONFIG
    const nextStep = "qualification"
    const pipeline_slug = "fgts"
    const autorizedBanks = ["bmg", "eccor"];

    const federalId_replaced = federalId.replace(/[^\d]/g, "");

    const button = document.querySelector(".btn-submit-fgts");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";


    axios.post(API_URL + '/criar-contato', {
        name: name,
        phone: phone,
        birthDate: birth,
        email: email,
        federalId: federalId_replaced,
        autorizedBanks: autorizedBanks,
        pipelineSlug: pipeline_slug,
        origin: origin,
        referrer: referrer,
        workWithSignedWorkCard: workWithSignedWorkCard,
        withdrawalEnabled: withdrawalEnabled,
    }, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then((response) => {
            window.location.href = nextStep + "?" + "pipeline_slug=" + pipeline_slug + "&" + "federalId=" + federalId_replaced;
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "ACEITAR E CONTINUAR";
            showToast(error.response.data.message);
        });
}


function validateForm() {
    const nameElement = document.querySelector('[data-brz-label="Nome Completo"]').value;
    const phoneElement = document.querySelector('[data-brz-label="WhatsApp"]').value;
    const federalIdElement = document.querySelector('[data-brz-label="CPF"]').value;
    const birthElement = document.querySelector('[data-brz-label="Data de Nascimento"]').value;
    const emailElement = document.querySelector('[data-brz-label="Email (Opcional)"]').value;
    const firstChoice = document.querySelector('[data-brz-label="Já Trabalhou de Carteira Assinada?"]').value.toLowerCase();
    const secondChoice = document.querySelector('[data-brz-label="Tem o Saque Habilitado?"]').value.toLowerCase();

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
    email = emailElement;
    workWithSignedWorkCard = firstChoice === "sim";
    withdrawalEnabled = secondChoice === "sim";

    criar_contato_fgts();
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

                    //
                    case "aguardar-link-assinatura":
                        URL_redirect = `/requirestreatment`;
                        window.location.href = URL_redirect;
                        break;

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


