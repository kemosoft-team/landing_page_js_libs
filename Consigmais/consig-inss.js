//API url
let API_URL = "https://ms-crm-az.kemosoft.com.br";
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
let menorIdade = false;

function redirectWhatsapp() {
  window.location.href = "https://api.whatsapp.com/send?phone=558482001436";
}

function callback(urlCallBack) {
  console.log(urlCallBack);

  axios
    .post(
      `https://api.retool.com/v1/workflows/e166680b-6824-49f8-9801-fdb55e7588d2/startTrigger?workflowApiKey=retool_wk_18c231a430cc43159f83b873c786b9c9`,
      {
        callbackUrl: urlCallBack,
      }
    )
    .then((response) => {
      window.location.href = "https://wa.me/558440429946";
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
  if (
    nameElement == "" ||
    phoneElement == "" ||
    federalIdElement == "" ||
    birthElement == ""
  ) {
    showToast("Por favor, preencha todos os campos.");
    return false;
  } else if (
    !nameElement.trim() ||
    !/[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(nameElement)
  ) {
    showToast("Por favor, digite seu nome completo");
    return false;
  } else if (!validateCPF(federalIdElement)) {
    showToast("O CPF do Beneficiário não é válido!");
    return false;
  } else if (!isDateValid(birthElement)) {
    showToast("A data de nascimento informada não é válida!");
    return false;
  } else if (!isBirthValid(birthElement)) {
    var popUpBirth = document.querySelector("#popUpBirth");
    popUpBirth.click();
    return false;
  } else if (!validatePhone(phoneElement)) {
    showToast("O número do Whatsapp informado não é válido!");
    return false;
  } else {
    //SALVAR NAS VARIAVEIS GLOBAIS
    name = nameElement;
    phone = phoneElement;
    federalId = federalIdElement;
    birth = birthElement;

    //CRIAR CONTATO
    criar_contato_inss();
  }
}

function criar_contato_inss() {
  // CONFIG
  const pipeline_slug = "inss";

  /* REPLACE */
  const federalId_replaced = federalId.replace(/[^\d]/g, "");
  const name_replaced = name.replace(/\s+/g, " ");

  const button = document.querySelector(".brz-btn-submit.submit_form");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  const endpoint = "/v2/criar-contato";

  const payload = {
    nome: name_replaced,
    telefone: phone,
    cpf: federalId_replaced,
    dataNascimento: birth,
    funil: pipeline_slug,
    urlOrigem: origin,
    urlReferencia: referrer,
    naoQualificar: true,
  };

  axios
    .post(API_URL + endpoint, payload, {
      headers: {
        "api-key": API_KEY,
        "x-source": "lp",
      },
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

      // ENVIAR CUSTOM ID CLARITY
      const customId = federalId_replaced;
      window.clarity("identify", customId);

      if (menorIdade === true) {
        // ABRIR FORMULÁRIO REPRESENTANTE
        const formRepresentative = document.getElementById("form_representative");
        formRepresentative.click();
      } else {
        // ABRIR QUESTÕES REPRESENTANTE
        const representativeQuestions = document.getElementById("question_representative");
        representativeQuestions.click();
      }
    })
    .catch(async function (error) {
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      span.textContent = "ACEITAR E CONTINUAR";
      showToast(error.response?.data?.message || "Ocorreu um erro. Tente novamente.");
      console.error("Erro ao criar contato INSS:", error);

      await logError(
        endpoint,
        payload,
        error?.message || "Erro desconhecido",
        pipeline_slug
      );
    });
}


function validar_PopUpBenefit() {
  const benefit = document.querySelector(
    '[data-brz-label="Número do Benefício/Matrícula"]'
  ).value;

  if (benefit == "") {
    showToast("Por favor, digite o número do benefício!");
    return false;
  } else if (benefit && benefit.length != 10) {
    showToast("O número do benefício deve conter 10 caracteres.");
    return false;
  } else if (benefit && !validarNumeroBeneficio(benefit)) {
    showToast(
      "O número do benefício informado é inválido! Revise a informação!"
    );
    return false;
  } else if (benefit && !validateMod11Digit(benefit, 1, 9, true)) {
    showToast(
      "O número do benefício informado é inválido!! Revise a informação!"
    );
    return false;
  } else {
    enrollment = benefit;
    criar_PopUpEnrollment(enrollment);
  }
}

function criar_PopUpEnrollment(enrollment) {
  const button = document.querySelector(".brz-btn-submit.submit_benefit");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  const endpoint = "/v2/registrar-dados-empregaticios";

  const payload = {
    cpf: federalId,
    matricula: enrollment,
  };

  axios
    .post(API_URL + endpoint, payload, {
      headers: {
        "api-key": API_KEY,
      },
    })
    .then((response) => {
      requalify();
      showLoader();
    })
    .catch(async function (error) {
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      span.textContent = "Confirmar e Continuar";
      showToast(error.response.data.message);
      console.error("Erro ao registrar dados empregatícios:", error);

      await logError(
        endpoint,
        payload,
        error?.message || "Erro desconhecido",
        "inss"
      );
    });
}


function validar_contato_inss_representative() {
  const name_RepresentiveElement = document.querySelector(
    '[data-brz-label="Nome do Representante"]'
  ).value;
  const federalId_RepresentiveElement = document.querySelector(
    '[data-brz-label="CPF do Representante"]'
  ).value;
  const federalId_RepresentativeReplaced =
    federalId_RepresentiveElement.replace(/[^\d]/g, "");

  if (
    name_RepresentiveElement == "" ||
    federalId_RepresentativeReplaced == ""
  ) {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }
  if (!validateCPF(federalId_RepresentativeReplaced)) {
    showToast("O CPF do Representante não é válido!");
    return false;
  }
  if (
    !name_RepresentiveElement.trim() ||
    !/[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(name_RepresentiveElement)
  ) {
    showToast("Por favor, digite o nome do representante completo");
    return false;
  }
  if (federalId == federalId_RepresentativeReplaced) {
    showToast(
      "Os CPFs do beneficiário e do representante devem ser diferentes!"
    );
    return false;
  }
  if (name == name_RepresentiveElement) {
    showToast(
      "O nome do beneficiário e do representante devem ser diferentes!"
    );
    return false;
  }

  name_Representive = name_RepresentiveElement;
  federalId_Representive = federalId_RepresentativeReplaced;
  criar_contato_inss_representative();
}

function criar_contato_inss_representative() {
  /* REPLACE */
  const name_Representive_replaced = name_Representive.replace(/\s+/g, " ");
  const federalId_Representive_replaced = federalId_Representive.replace(/[^\d]/g, "");

  const button = document.querySelector(".brz-btn-submit.submit_form_representative");
  const spinner = button.querySelector(".brz-form-spinner");
  const span = button.querySelector(".brz-span.brz-text__editor");

  button.setAttribute("disabled", true);
  spinner.classList.remove("brz-invisible");
  span.textContent = "";

  const endpoint = "/v2/criar-contato";

  const payload = {
    nome: name,
    telefone: phone,
    cpf: federalId,
    dataNascimento: birth,
    nomeRepresentante: name_Representive_replaced,
    cpfRepresentante: federalId_Representive_replaced,
    funil: pipelineSlug,
    urlOrigem: origin,
    urlReferencia: referrer,
  };

  axios
    .post(API_URL + endpoint, payload, {
      headers: {
        "api-key": API_KEY,
      },
    })
    .then((response) => {
      name_Representive = name_Representive_replaced;
      federalId_Representive = federalId_Representive_replaced;

      const formBenefit = document.getElementById("form_benefit");
      formBenefit.click();
    })
    .catch(async function (error) {
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      span.textContent = "Confirmar e Continuar";
      showToast(error.response.data.message);
      console.error("Erro ao criar contato do representante:", error);

      await logError(
        endpoint,
        payload,
        error?.message || "Erro desconhecido",
        "inss"
      );
    });
}


//QUALIFICAÇÃO
function qualification() {
  const attemptsBenefit = localStorage.getItem("attemptsBenefit") || 0;
  var attempt = 0;

  function obterParametroDaURL(parametro) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametro);
  }

  // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
  let pipelineSlug = obterParametroDaURL("pipeline_slug");
  let federalId = obterParametroDaURL("federalId");

  if (pipelineSlug && federalId) {
    const dataQualification = {
      pipelineSlug: pipelineSlug,
      federalId: federalId,
    };

    const dataQualificationJSON = JSON.stringify(dataQualification);
    localStorage.setItem("dataQualification", dataQualificationJSON);
  } else {
    const dataQualificationLocalStorage = localStorage.getItem("dataQualification");
    if (dataQualificationLocalStorage) {
      const storedDataQualification = JSON.parse(dataQualificationLocalStorage);
      pipelineSlug = storedDataQualification.pipelineSlug;
      federalId = storedDataQualification.federalId;
    } else {
      console.log("Nenhum valor armazenado no localStorage para qualificação");
    }
  }

  const sendRequest = () => {
    const endpoint = `/v1/proxima-etapa/${pipelineSlug}/${federalId}`;

    axios
      .get(API_URL + endpoint, {
        headers: {
          "api-key": API_KEY,
        },
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
          opportunity: oportunidades,
        });

        switch (contexto) {
          //NOOPPORTUNITY
          case "sem-oportunidade":
            URL_redirect = `/noopportunity?federalId=${federalId}`;
            window.location.href = URL_redirect;
            break;

          //AGUARDAR LINK-LINK-ASSINATURA
          case "aguardar-link-assinatura":
            bankRedirect(oportunidades, contexto);
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
            if (aposentadoOuPensionista) {
              URL_redirect = `/requirestreatment?federalId=${federalId}`;
              window.location.href = URL_redirect;
            } else {
              URL_redirect = `/noopportunity?federalId=${federalId}`;
              window.location.href = URL_redirect;
            }

            break;

          case "encerrado":
          case "reiniciando-atendimento":
            switch (situacao) {
              case "nao-qualificado":
                URL_redirect = `/noqualified?federalId=${federalId}`;
                window.location.href = URL_redirect;
                break;
              case "oportunidade-futura":
                URL_redirect = `/futureOpportunity?federalId=${federalId}`;
                window.location.href = URL_redirect;
                break;
            }
            break;

          //ENROLLMENT INSS
          case "resolver-situacao":
            switch (situacao) {
              //INFORMAR MATRICULA
              case "informar-matricula":
                if (attemptsBenefit < 3) {
                  URL_redirect = `/benefit?federalId=${federalId}`;
                  window.location.href = URL_redirect;

                  attemptsBenefit++;
                  localStorage.setItem("attemptsBenefit", attemptsBenefit);
                } else {
                  window.open(
                    "https://wa.me/558482001436?text=Ol%C3%A1%2C%20gostaria%20de%20concluir%20minha%20solicita%C3%A7%C3%A3o!",
                    "_blank"
                  );
                }
                break;
              //INFORMAR MATRICULA NOVAMENTE
              case "informar-matricula-valida":
                if (attemptsBenefit < 3) {
                  URL_redirect = `/benefit?tp=valida`;
                  window.location.href = URL_redirect;

                  attemptsBenefit++;
                  localStorage.setItem("attemptsBenefit", attemptsBenefit);
                } else {
                  window.open(
                    "https://wa.me/558482001436?text=Ol%C3%A1%2C%20gostaria%20de%20concluir%20minha%20solicita%C3%A7%C3%A3o!",
                    "_blank"
                  );
                }

                break;
              //SOLICITAR IN100
              case "solicitar-in100":
                URL_redirect = `/requirestreatment?federalId=${federalId}`;
                window.location.href = URL_redirect;
                break;
              //TEM OPORTUNIDADE
              case "escolher-simulacao":
                if (pedirInfos.length > 0) {
                  URL_redirect = `/opportunity?federalId=${federalId}`;
                  window.location.href = URL_redirect;
                } else {
                  URL_redirect = `/success?federalId=${federalId}`;
                  window.location.href = URL_redirect;
                }
                break;
              //ASSINATURA PENDENTE
              case "assinatura-pendente":
                bankRedirect(oportunidades, contexto);
                break;
            }

            break;

          //INDISPONIVEL OU QUALQUER OUTRO STATUS NÃO LISTADO
          default:
            console.log("indisponivel ou não listado");
            attempt++;
            if (attempt < 3) {
              sendRequest();
            } else {
              logError(
                `/v1/proxima-etapa/${pipelineSlug}/${federalId}`,
                { pipelineSlug, federalId },
                error?.message || "Erro desconhecido",
                "inss"
              );

              URL_redirect = `/offline`;
              window.location.href = URL_redirect;
            }
            break;
        }
      })
      .catch(async function (error) {
        console.log(error, "Não foi possível obter a qualificação");
        attempt++;
        if (attempt < 3) {
          sendRequest();
        } else {
          await logError(
            `/v1/proxima-etapa/${pipelineSlug}/${federalId}`,
            { pipelineSlug, federalId },
            error?.message || "Erro desconhecido",
            "inss"
          );
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
    showToast(
      "O número do benefício informado é inválido! Revise a informação!"
    );
    return false;
  } else if (!validateMod11Digit(benefit, 1, 9, true)) {
    showToast(
      "O número do benefício informado é inválido!! Revise a informação!"
    );
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
  const urlFederalId = obterParametroDaURL("federalId");

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

  const endpoint = "/v2/registrar-dados-empregaticios";
  const payload = {
    cpf: federal,
    matricula: enrollment,
  };

  axios
    .post(API_URL + endpoint, payload, {
      headers: {
        "api-key": API_KEY,
      },
    })
    .then((response) => {
      requalifyEnrollment(enrollment);
    })
    .catch(async function (error) {
      button.removeAttribute("disabled");
      spinner.classList.add("brz-invisible");
      span.textContent = "CONFIRMAR E CONTINUAR";
      console.log(error.response.data.message);
      showToast("Parece que houve um problema! Por Favor, tente novamente!");

      await logError(
        endpoint,
        payload,
        error?.message || "Erro desconhecido",
        "inss"
      );
    });
}


async function logError(endpoint, payload, error_message, slug) {
  try {
    await axios.post(
      "https://n8n-01-webhook.kemosoft.com.br/webhook/log_error",
      {
        endpoint,
        payload,
        error_message,
        slug
      },
    );
  } catch (e) {
    console.warn("Erro ao registrar o log de erro:", e);
  }
}
