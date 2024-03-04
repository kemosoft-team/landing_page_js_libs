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

let aposentadoOuPensionista;
let jaContratouEmprestimo;
let benefitAmountRange;
let leadId;
let pipelineSlug;


function callback(urlCallBack) {
    console.log(urlCallBack);

    axios.post(`https://api.retool.com/v1/workflows/e166680b-6824-49f8-9801-fdb55e7588d2/startTrigger?workflowApiKey=retool_wk_18c231a430cc43159f83b873c786b9c9`, {
        "callbackUrl": urlCallBack
    })
        .then((response) => {
            window.location.href = "https://wa.me/558440429964";
        })
        .catch(function (error) {
            console.log(error, "Erro no post n8n");
        });
}

function validar_contato_inss() {
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
    if (!nameElement.trim() || !/[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(nameElement)) {
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
        var popUpBirth = document.querySelector("#popUpBirth");
        popUpBirth.click();
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
    aposentadoOuPensionista = firstChoice === "sim";
    jaContratouEmprestimo = secondChoice === "sim";

    //CRIAR CONTATO
    criar_contato_inss()
}

function criar_contato_inss() {
    // CONFIG
    const pipeline_slug = "inss";

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
        birthDate: birth,
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
            
            criar_questions()
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "ACEITAR E CONTINUAR";
            showToast(error.response.data.message);
        });
}

function criar_questions() {
    axios.post(API_URL + `/${leadId}/perguntas`, {
        aposentadoOuPensionista: aposentadoOuPensionista,
        jaContratouEmprestimo: jaContratouEmprestimo
    }, {
        headers: {
            'api-key': API_KEY
        }
    })

        .then(async (response) => {
            //ABRA O POP UP DE INFO BENEFIT
            const benefit = document.getElementById("benefit");
            benefit.click();
        })
        .catch(function (error) {
            showToast(error.response.data.message);
        });
}

function validar_PopUpBenefit() {
    const benefit = document.querySelector('[data-brz-label="Número do Benefício/Matrícula (Opcional)"]').value;
    if (benefit && benefit.length != 10) {
        showToast("O número do benefício deve conter 10 caracteres.");
        return false;
    } else if (benefit && !validarNumeroBeneficio(benefit)) {
        showToast("O número do benefício informado é inválido! Revise a informação!");
        return false;
    } else if (benefit && !validateMod11Digit(benefit, 1, 9, true)) {
        showToast("O número do benefício informado é inválido!! Revise a informação!");
        return false;
    } else if (!benefit) {
        //ABRI POP UP QUESTIONARIOS
        const close_benefit = document.getElementById("close_benefit");
        close_benefit.click();
        const representativeQuestions = document.getElementById("question_representative");
        representativeQuestions.click();
    } else {
        //SALVAR NAS VARIAVEIS GLOBAIS
        enrollment = benefit;
        criar_PopUpEnrollment(enrollment)
    }
}

function criar_PopUpEnrollment(enrollment) {

    const button = document.querySelector(".brz-btn-submit.submit_benefit");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios.post(API_URL + "/registrar-dados-empregaticios", {
        federalId: federalId,
        enrollment: enrollment,
    }, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then((response) => {
            //ABRI POP UP QUESTIONARIOS
            const close_benefit = document.getElementById("close_benefit");
            close_benefit.click();
            const representativeQuestions = document.getElementById("question_representative");
            representativeQuestions.click();
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "Confirmar e Continuar";
            showToast(error.response.data.message);
        });
}

function validar_contato_inss_representative() {
    const name_RepresentiveElement = document.querySelector('[data-brz-label="Nome do Representante"]').value;
    const federalId_RepresentiveElement = document.querySelector('[data-brz-label="CPF do Representante"]').value;

    if (name_RepresentiveElement == "" || federalId_RepresentiveElement == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }
    if (!validateCPF(federalId_RepresentiveElement)) {
        showToast("O CPF do Representante não é válido!");
        return false;
    } if (!name_RepresentiveElement.trim() || !/[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(name_RepresentiveElement)) {
        showToast("Por favor, digite o nome do representante completo");
        return false;
    } if (federalId == federalId_RepresentiveElement) {
        showToast(
            "Os CPFs do beneficiário e do representante devem ser diferentes!"
        );
        return false;
    }

    name_Representive = name_RepresentiveElement;
    federalId_Representive = federalId_RepresentiveElement;
    criar_contato_inss_representative();
}

function criar_contato_inss_representative() {


    /* REPLACE */
    const name_Representive_replaced = name_Representive.replace(/\s+/g, ' ');
    const federalId_Representive_replaced = federalId_Representive.replace(/[^\d]/g, "");

    const button = document.querySelector(".brz-btn-submit.submit_form_representative");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";


    axios.post(API_URL + "/criar-contato", {
        name: name,
        phone: phone,
        federalId: federalId,
        birthDate: birth,
        representativeName: name_Representive_replaced,
        representativeFederalId: federalId_Representive_replaced,
        pipelineSlug: pipelineSlug,
        origin: origin,
        referrer: referrer,
    }, {
        headers: {
            'api-key': API_KEY
        }
    })
        .then((response) => {
            name_Representive = name_Representive_replaced;
            federalId_Representive = federalId_Representive_replaced;
            qualification();
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "Confirmar e Continuar";
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

                var dataQuestions = JSON.parse(localStorage.getItem('dataQuestions'));
                let aposentadoOuPensionista;

                if (dataQuestions) {
                    aposentadoOuPensionista = dataQuestions.aposentadoOuPensionista;
                    console.log("Aposentado: ", aposentadoOuPensionista)
                } else {
                    console.log("Não há questions")
                }

                setItemStorage({
                    pipelineSlug: pipelineSlug,
                    federalId: federalId,
                    leadId: leadId,
                    opportunity: oportunidades
                });


                switch (contexto) {
                    //NOOPPORTUNITY
                    case "sem-oportunidade":
                        URL_redirect = `/noopportunity`;
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
                        URL_redirect = `/noqualified`;
                        window.location.href = URL_redirect;
                        break;

                    //AGUARDANDO QUALIFICAÇÃO 
                    case "aguardando-qualificacao":
                        if (aposentadoOuPensionista) {
                            URL_redirect = `/requirestreatment`;
                            window.location.href = URL_redirect;
                        } else {
                            URL_redirect = `/noopportunity`;
                            window.location.href = URL_redirect;
                        }

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
            requalifyEnrollment(enrollment);
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "CONFIRMAR E CONTINUAR";
            console.log(error.response.data.message);
            showToast("Parece que houve um problema! Por Favor, tente novamente!")
        });
}








