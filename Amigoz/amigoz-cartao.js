//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br/v1";
let API_KEY = "905c1698-33ce-4a98-a3cc-5a98efc733dd";

let origin = window.location.href;
let referrer = document.referrer;

let name;
let phone;
let federalId;
let pipelineSlug;


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


//QUALIFICAÇÃO
function qualification() {
    var attempt = 0;

    axios
        .get(`${API_URL}/proxima-etapa/${pipelineSlug}/${federalId}`, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            let URL_redirect;
            const contexto = response.data.contexto;

            switch (contexto) {
                //NOQUALIFIED
                case "encerrado":
                    URL_redirect = `/noqualified`;
                    window.location.href = URL_redirect;
                    break;

                //QUALIFICADO OU QUALQUER OUTRO STATUS NÃO LISTADO
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
                sendRequest();
            } else {
                URL_redirect = `/offline`;
                window.location.href = URL_redirect;
            }
        });
}
