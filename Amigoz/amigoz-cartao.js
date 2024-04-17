//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let API_KEY = "905c1698-33ce-4a98-a3cc-5a98efc733dd";

let origin = window.location.href;
let referrer = document.referrer;

let name;
let phone;
let federalId;
let enrollment;
let birth;

let leadId;
let pipelineSlug;


function callback(urlCallBack) {
    console.log(urlCallBack);

    axios.post(`https://api.retool.com/v1/workflows/e166680b-6824-49f8-9801-fdb55e7588d2/startTrigger?workflowApiKey=retool_wk_18c231a430cc43159f83b873c786b9c9`, {
        "callbackUrl": urlCallBack
    })
        .then((response) => {
            window.location.href = "https://wa.me/{{whatsapp}}";
        })
        .catch(function (error) {
            console.log(error, "Erro no post n8n");
        });
}

function validar_contato() {
    const nameElement = document.querySelector('[data-brz-label="Nome"]').value;
    const phoneElement = document.querySelector('[data-brz-label="WhatsApp"]').value;
    const federalIdElement = document.querySelector('[data-brz-label="CPF"]').value;

    if (
        nameElement == "" ||
        phoneElement == "" ||
        federalIdElement == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }
    if (!nameElement.trim() || !/[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(nameElement)) {
        showToast("Por favor, digite seu nome completo");
        return false;
    }
    if (!validateCPF(federalIdElement)) {
        showToast("O CPF invalido!");
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

    //CRIAR CONTATO
    criar_contato()
}


function identifierSlug() {

    const path = window.location.pathname;
    switch (path) {
        case "pref-jn":
            return "pref-jn"
        case "pref-rj":
            return "pref-rj"
        case "/pref-ca":
            return "pref-ca"
        case "/gov-pi":
            return "gov-pi"
    }
}


function criar_contato() {
    // CONFIG
    const pipeline_slug = identifierSlug(window.location.pathname);

    /* REPLACE */
    const federalId_replaced = federalId.replace(/[^\d]/g, "");
    const name_replaced = name.replace(/\s+/g, ' ');

    const button = document.querySelector(".brz-btn-submit.submit_form");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios.post(API_URL + "/criar-contato", {
        name: name_replaced,
        phone: phone,
        federalId: federalId_replaced,
        pipelineSlug: pipeline_slug,
        origin: origin,
        referrer: referrer,
    }, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then((response) => {
            leadId = response.data.id;
            pipelineSlug = pipeline_slug;
            federalId = federalId_replaced;
            name = name_replaced;

            setItemStorage({
                pipelineSlug: pipeline_slug,
                federalId: federalId_replaced,
                leadId: leadId,
            });

            //ENVIAR CUSTOM ID CLARITY
            const customId = federalId_replaced;
            window.clarity("identify", customId);

            document.querySelector("#btn-waiting").click();
            qualification()

        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "ACEITAR E CONTINUAR";
            showToast(error.response.data.message);
        });
}

function validar_popUp_benefit() {
    const benefit = document.querySelector('[data-brz-label="Número do Benefício/Matrícula"]').value;
    const birthElement = document.querySelector('[data-brz-label="Data de Nascimento"]').value;

    if (benefit == "" || birthElement == "") {
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
    } else if (!isDateValid(birthElement)) {
        showToast("A data de nascimento informada não é válida!");
        return false;
    } else {
        //SALVAR NAS VARIAVEIS GLOBAIS
        enrollment = benefit;
        birth = birthElement;

        criar_popUp_benefit();
    }
}

function criar_popUp_benefit() {
    // CONFIG
    const pipeline_slug = "gov-pi";

    const button = document.querySelector(".brz-btn-submit.submit_popUp_benefit");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios.post(API_URL + "/criar-contato", {
        name: name,
        phone: phone,
        federalId: federalId,
        birth: birth,
        pipelineSlug: pipeline_slug,
        enrollment: enrollment,
    }, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then((response) => {
            requalify()
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
                    //NOOPPORTUNITY
                    case "sem-oportunidade":
                        URL_redirect = `/noopportunity?federalId=${federalId}`;
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

                    //NOQUALIFIED
                    case "nao-qualificado":
                        URL_redirect = `/noqualified?federalId=${federalId}`;
                        window.location.href = URL_redirect;
                        break;

                    //AGUARDANDO QUALIFICAÇÃO 
                    case "aguardando-qualificacao":
                        URL_redirect = `/requirestreatment?federalId=${federalId}`;
                        window.location.href = URL_redirect;

                        break;

                    //ENROLLMENT INSS
                    case "resolver-situacao":
                        switch (situacao) {
                            //INFORMAR MATRICULA
                            case "informar-matricula":
                                /* ATENÇÃO NESSA PARTE */
                                document.querySelector("#btn-close-waiting").click();
                                document.querySelector("#btn-benefit").click();
                                break;
                            //INFORMAR MATRICULA NOVAMENTE
                            case "informar-matricula-valida":
                                URL_redirect = `/benefit?tp=valida`;
                                window.location.href = URL_redirect;
                                break;
                            //SOLICITAR IN100
                            case "solicitar-in100":
                                URL_redirect = `/requirestreatment?federalId=${federalId}`;
                                window.location.href = URL_redirect;
                                break;
                            //TEM OPORTUNIDADE
                            case "escolher-simulacao":
                                URL_redirect = `/opportunity?federalId=${federalId}`;
                                window.location.href = URL_redirect;
                                break;
                            //ASSINATURA PENDENTE
                            case "assinatura-pendente":
                                bankRedirect(oportunidades, contexto)
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
