//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br";
let API_KEY = "905c1698-33ce-4a98-a3cc-5a98efc733dd";

let origin = window.location.href;
let referrer = document.referrer;

let name;
let phone;
let federalId;
let pipelineSlug;
let attempt = 0;


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
        case "/pref-jn":
            return "pref-jn"
        case "/pref-rj":
            return "pref-rj"
        case "/pref-ca":
            return "pref-ca"
        case "/gov-pi":
            return "gov-pi"
        case "/pref-maringa":
            return "maringa-pr"
        case "/pref-jaboatao":
            return "jaboatao-pe"
        case "/pref-jaboatao":
            return "juazeiro-ce"
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

    axios.post(API_URL + "/v2/criar-contato", {
        nome: name_replaced,
        telefone: phone,
        cpf: federalId_replaced,
        funil: pipeline_slug,
        urlOrigem: origin,
        urlReferencia: referrer,
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

            setTimeout(function () {
                qualification(pipeline_slug, federalId_replaced);
            }, 3000);

        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "ACEITAR E CONTINUAR";
            showToast(error.response.data.message);
        });
}

function qualification(pipe, federal) {
    axios
        .get(`${API_URL}/v1/proxima-etapa/${pipe}/${federal}`, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            let URL_redirect;
            const contexto = response.data.contexto;
            console.log("Contexto: ", contexto);

            switch (contexto) {
                case "encerrado":
                    URL_redirect = `/noqualified`;
                    window.location.href = URL_redirect;
                    break;

                case "aguardando-qualificacao":
                    URL_redirect = `/nooportunity`;
                    window.location.href = URL_redirect;
                    break;

                default:
                    URL_redirect = `/success`;
                    window.location.href = URL_redirect;
                    break;
            }
        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
            attempt++;
            if (attempt < 3) {
                qualification();
            } else {
                const URL_redirect = `/offline`;
                window.location.href = URL_redirect;
            }
        });
}
