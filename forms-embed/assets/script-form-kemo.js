/* ROOT */
API_URL = "https://ms-crm-az.kemosoft.com.br";
let jaTrabalhouCarteiraAssinada = false;
let saqueHabilitado = false;
let localLeadId;
let localFederalId;


// Função para mostrar e ocultar o loader
function toggleLoader(button, show, text) {
    const loader = button.querySelector('.loader');
    if (show) {
        loader.style.display = 'inline-block';
        text.style.display = 'none';
        button.disabled = true;
    } else {
        text.style.display = 'block';
        loader.style.display = 'none';
        button.disabled = false;
    }
}

/* Carregar conteúdo dinâmico */
function loadFormContent() {
    const body = document.querySelector('body');
    body.innerHTML += `
    <div class="background-modal" style="display: none">
    <div id="form-container">
    <!-- FORMULÁRIO INICIAL -->
    <div style="display: none" class="modal initial-form">
      <header>
        <div class="title">
          <div></div>
          <h1>Formulário Inicial</h1>
          <div class="close-modal btn-open-formFGTS">
            <svg width="25" height="25" fill="none" stroke="#BDBDBD" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </div>
        </div>
      </header>
      <form class="form">
        <div class="fieldset-wrapper">
          <div class="input-wrapper">
            <!-- Inputs do Formulário -->
            <div class="inputs">
              <label for="fullName">Nome Completo</label>
              <input type="text" placeholder="Digite seu nome completo" id="fullName" required oninput="validateFullName(this)" />
              <div class="validation"></div>
              <span class="error" id="fullNameError"></span>
            </div>
            <!-- CPF -->
            <div class="inputs">
              <label for="federalId">CPF</label>
              <input type="text" placeholder="000.000.000-00" id="federalId" required minlength="11" maxlength="14" oninput="validateCPF(this)" />
              <div class="validation"></div>
              <span class="error" id="federalIdError"></span>
            </div>
            <!-- PHONE -->
            <div class="inputs">
              <label for="phone">WhatsApp</label>
              <input type="text" placeholder="(00) 0 0000-0000" id="phone" required minlength="11" maxlength="15" oninput="validatePhone(this)" />
              <div class="validation"></div>
              <span class="error" id="phoneError"></span>
            </div>
            <!-- DATA DE NASCIMENTO -->
            <div class="inputs">
              <label for="birth">Data de Nascimento</label>
              <input type="text" placeholder="00/00/0000" id="birth" required minlength="10" maxlength="10" oninput="validateBirth(this)" />
              <div class="validation"></div>
              <span class="error" id="birthError"></span>
            </div>
            <!-- EMAIL -->
            <div class="inputs">
              <label for="email">Email (Opcional)</label>
              <input type="email" placeholder="email@email.com" id="email" oninput="validateEmail(this)" />
              <div class="validation"></div>
              <span class="error" id="emailError"></span>
            </div>
          </div>
        </div>

        <button class="button-submit" type="button" onclick="validateForm()">
        <span class="loader" style="display: none"></span>
        <span class="text">Simular</span>
        </button>

      </form>
    </div>
    <!-- PERGUNTAS 1 -->
    <div style="display: none" class="modal questions-form-1">
      <header class="questions">
        <div class="title">
          <div>
           
          </div>
          <h1>Perguntas</h1>
          <div class="close-modal btn-open-formFGTS">
            <svg width="25" height="25" fill="none" stroke="#BDBDBD" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </div>
        </div>
        <div class="step-loarder">
          <div style="width: 50%" class="step-progress-bar"></div>
        </div>
      </header>

      <form class="form">
        <input type="hidden" id="api-key" name="apiKey" value="" />
        <div class="fieldset-wrapper">
          <div class="input-wrapper questions">
            <label for="employmentStatus">Tem ou já teve um emprego com carteira assinada?</label>

            <button class="btn-questions" type="button" data-answer="sim, já trabalhei assim antes" onclick="showNextQuestion(1, this)">sim, já trabalhei assim antes</button>

            <button class="btn-questions" type="button" data-answer="sim, estou trabalhando" onclick="showNextQuestion(1, this)">sim, estou trabalhando</button>

            <button class="btn-questions" type="button" data-answer="Não, nunca trabalhei" onclick="showNextQuestion(1, this)">Não, nunca trabalhei</button>
          </div>
        </div>


        <button class="button-submit" type="button" style="display: none" onclick="criar_questions()">
        <span class="loader" style="display: none"></span>
        <span class="text">Concluir Simulação</span>
        </button>
      </form>
    </div>

    <!-- PERGUNTAS 2 -->
    <div class="modal questions-form-2">
      <header class="questions">
        <div class="title">
          <div class="button-back-two">
            <svg width="25" height="25" fill="none" stroke="#BDBDBD" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.438 18.75 4.688 12l6.75-6.75"></path>
              <path d="M5.625 12h13.688"></path>
            </svg>
          </div>
          <h1>Perguntas</h1>
          <div class="close-modal btn-open-formFGTS">
            <svg width="25" height="25" fill="none" stroke="#BDBDBD" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </div>
        </div>
        <div class="step-loarder">
          <div style="width: 100%" class="step-progress-bar"></div>
        </div>
      </header>
      <form class="form">
        <input type="hidden" id="api-key" name="apiKey" value="" />
        <div class="fieldset-wrapper">
          <div class="input-wrapper questions">
            <label for="fgtsStatus">Você já ativou o saque-aniversário no FGTS?</label>

           <button class="btn-questions" type="button" data-answer="Sim, já está ativado" onclick="showNextQuestion(2, this)">Sim, já está ativado</button>

            <button class="btn-questions" type="button" data-answer="Não, nunca ativei" onclick="showNextQuestion(2, this)">Não, nunca ativei</button>
          </div>
        </div>

        <button class="button-submit" type="button" style="display: none" onclick="criar_questions()">
        <span class="loader" style="display: none"></span>
        <span class="text">Concluir e Simular</span>
        </button>


      </form>
    </div>
    </div>
  </div>
    `;

    /* ABRIR E FECHAR MODAL */
    document.querySelectorAll(".btn-open-formFGTS").forEach(function (button) {
        button.addEventListener("click", function () {
            var modal = document.querySelector(".background-modal");
            var formulario = document.querySelector(".initial-form");
            modal.style.display = "flex";
            formulario.style.display = "flex";
        });
    });

    document.querySelectorAll(".close-modal").forEach(function (button) {
        button.addEventListener("click", function () {
            var modal = document.querySelector(".background-modal");
            modal.style.display = "none";
        });
    });

    document.querySelectorAll(".button-back").forEach(function (button) {
        button.addEventListener("click", function () {
            showPreviousQuestion(1);
        });
    });

    document.querySelectorAll(".button-back-two").forEach(function (button) {
        button.addEventListener("click", function () {
            showPreviousQuestion(2);
        });
    });

    /* MASCARAS */
    var phoneMask = document.querySelector("#phone");
    var federalIdMask = document.querySelector("#federalId");
    var birthMask = document.querySelector("#birth");

    if (phoneMask) {
        phoneMask.setAttribute("inputmode", "numeric");
        phoneMask.addEventListener("input", function () {
            var value = this.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{1})(\d{4})(\d{4})$/, '$1 $2-$3');
            this.value = value;
        });
    }

    if (federalIdMask) {
        federalIdMask.setAttribute("inputmode", "numeric");
        federalIdMask.addEventListener("input", function () {
            var value = this.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            this.value = value;
        });
    }

    if (birthMask) {
        birthMask.addEventListener("input", function () {
            var e = birthMask.value;
            (e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 8)).replace(
                /(\d{2})(\d)/,
                "$1/$2"
            )).replace(/(\d{2})(\d)/, "$1/$2")),
                (birthMask.value = e);
        });
    }
}

/* Configuração dinâmica do formulário */
function configureForm(API_KEY, colors, journeyId) {
    base_URL = "baseurl";
    configureForm.apikey = API_KEY;
    configureForm.journeyId = journeyId;

    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --button-bg: ${colors.buttonBg};
            --button-color: ${colors.buttonColor};
            --button-bg-brightness: ${colors.buttonBgBrightness};
        }
    `;
    document.head.appendChild(style);
}

/* SVG */
function displayValidationSVG(svgElement, isValid) {
    if (isValid) {
        svgElement.innerHTML = `<svg width="20" height="20" fill="#0fc144" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25Zm-1.781 14.643L6.44 12.694l1.115-1.003 2.625 2.916 6.225-7.414 1.15.963-7.337 8.737Z"></path></svg>`;
    } else {
        svgElement.innerHTML = `<svg width="20" height="20" fill="#ff0000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25ZM16.06 15 15 16.06l-3-3-3 3L7.94 15l3-3-3-3L9 7.94l3 3 3-3L16.06 9l-3 3 3 3Z"></path></svg>`;
    }
    svgElement.style.display = "inline-block";
}

/* Mostrar pergunta anterior */
function showPreviousQuestion(step) {
    document.querySelector(".initial-form").style.display = "none";
    document.querySelector(".questions-form-1").style.display = "none";
    document.querySelector(".questions-form-2").style.display = "none";

    if (step === 1) {
        document.querySelector(".initial-form").style.display = "block";
    } else if (step === 2) {
        document.querySelector(".questions-form-1").style.display = "block";
    }
}

/* Mostrar próxima pergunta e selecionar opção */
function showNextQuestion(step, button) {
    document.querySelector(".initial-form").style.display = "none";
    document.querySelector(".questions-form-1").style.display = "none";
    document.querySelector(".questions-form-2").style.display = "none";

    if (step === 1) {
        document.querySelector(".questions-form-1").style.display = "block";
    } else if (step === 2) {
        document.querySelector(".questions-form-2").style.display = "block";
    }

    if (button) {
        selectOption(button, `questions-form-${step}`, step);
    }
}


/* Selecionar opção, mostrar botão de submissão e redirecionar conforme necessário */
function selectOption(button, formClass) {
    const selectedButton = document.querySelector(`.${formClass} .btn-questions.selected`);

    if (selectedButton && selectedButton !== button) {
        selectedButton.classList.remove("selected");
    }

    button.classList.add("selected");

    const answer = button.getAttribute('data-answer');

    if (formClass === 'questions-form-1') {
        jaTrabalhouCarteiraAssinada = (answer == 'sim, já trabalhei assim antes' || answer == 'sim, estou trabalhando') ? true : false;
        if (jaTrabalhouCarteiraAssinada === false) {
            document.querySelector(`.${formClass} .button-submit`).style.display = "block";
        } else {
            document.querySelector(`.${formClass} .button-submit`).style.display = "none";
            console.log("resposta", jaTrabalhouCarteiraAssinada);
            showNextQuestion(2);
        }
    } else if (formClass === 'questions-form-2') {
        saqueHabilitado = (answer === 'Sim, já está ativado') ? true : false;
        document.querySelector(`.${formClass} .button-submit`).style.display = "block";
    }
}

/* Validação do Formulário */
function validateForm() {
    const fullName = document.getElementById("fullName");
    const federalId = document.getElementById("federalId");
    const phone = document.getElementById("phone");
    const birth = document.getElementById("birth");
    const email = document.getElementById("email");

    const isFullNameValid = validateFullName(fullName);
    const isFederalIdValid = validateCPF(federalId);
    const isPhoneValid = validatePhone(phone);
    const isBirthValid = validateBirth(birth);
    const isEmailValid = validateEmail(email);

    const fullNameValue = document.getElementById("fullName").value;
    const federalIdValue = document.getElementById("federalId").value;
    const phoneValue = document.getElementById("phone").value;
    const birthValue = document.getElementById("birth").value;
    const emailValue = document.getElementById("email").value;

    if (isFullNameValid && isFederalIdValid && isPhoneValid && isBirthValid && isEmailValid) {
        criar_contato_fgts(fullNameValue, federalIdValue, phoneValue, birthValue, emailValue)
    } else {
        console.log("Formulário contém erros.");
    }
}

/* criar contato */
function criar_contato_fgts(fullName, federalId, phone, birth, email) {
    //loader 
    const button = document.querySelector('.initial-form .button-submit');
    const text = document.querySelector('.initial-form .button-submit .text');
    toggleLoader(button, true, text);

    //CONFIG
    const pipeline_slug = "fgts-sandbox"
    const autorizedBanks = ["bmg", "eccor", "facta", "novo-saque", "c6", "pan"];
    const origin = window.location.href;
    const referrer = document.referrer;

    /* REPLACE */
    const name_replaced = fullName.replace(/\s+/g, ' ');
    const federalId_replaced = federalId.replace(/[^\d]/g, "");
    const email_replaced = email.replace(/\s/g, "");

    axios.post(API_URL + '/v2/criar-contato', {
        nome: name_replaced,
        telefone: phone,
        dataNascimento: birth,
        cpf: federalId_replaced,
        email: email_replaced,
        bancosAutorizados: autorizedBanks,
        funil: pipeline_slug,
        urlOrigem: origin,
        urlReferencia: referrer,
    }, {
        headers: {
            'api-key': configureForm.apikey
        }
    })
        .then((response) => {
            localLeadId = response.data.id;
            localFederalId = federalId_replaced;

            //ABRA O POP UP DE QUESTIONARIO
            showNextQuestion(1)
            toggleLoader(button, false, text);
        })
        .catch(function (error) {
            console.error('Error:', error);
            toggleLoader(button, false, text);
        });
}


//PERGUNTAS
function criar_questions() {
    //loader 
    const button = document.querySelector('.questions-form-1 .button-submit');
    const text = document.querySelector('.questions-form-1 .button-submit .text');
    toggleLoader(button, true, text);

    axios.post(API_URL + `/v1/lead/${localLeadId}/perguntas`, {
        jaTrabalhouCarteiraAssinada: jaTrabalhouCarteiraAssinada,
        saqueHabilitado: saqueHabilitado
    }, {
        headers: {
            'api-key': configureForm.apikey
        }
    })

        .then((response) => {
            const journeyId = configureForm.journeyId;

            if (!jaTrabalhouCarteiraAssinada) {
                window.location.href = `https://www.parceiros.faz.vc/semoportunidade?tp=semcarteira&id=${journeyId}&federalId=${localFederalId}&leadId=${localLeadId}`;

            } else if (saqueHabilitado) {
                window.location.href = `https://www.parceiros.faz.vc/autorizar?id=${journeyId}&federalId=${localFederalId}`;

            } else if (!saqueHabilitado) {
                window.location.href = `https://www.parceiros.faz.vc/habilitar?id=${journeyId}&federalId=${localFederalId}`;
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
            toggleLoader(button, false, text);
        });
}





/* ==================== VALIDAÇÕES ==================== */
/* Validação de Nome */
function validateFullName(input) {
    const fullNameError = document.getElementById("fullNameError");
    const validationDiv = input.nextElementSibling;
    const fullName = input.value.trim();
    const fullNameRegex = /^[a-zA-ZáÁéÉíÍóÓúÚâÂêÊîÎôÔûÛãÃõÕçÇ ]+$/;

    if (!fullNameRegex.test(fullName)) {
        displayValidationSVG(validationDiv, false);
        fullNameError.textContent =
            "Digite um nome válido (apenas letras e espaços).";
        return false;
    }

    const parts = fullName.split(" ");
    if (parts.length < 2 || parts.some((part) => part.length < 2)) {
        displayValidationSVG(validationDiv, false);
        fullNameError.textContent = "Digite seu nome completo.";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    fullNameError.textContent = "";
    return true;
}

/* Validação de CPF */
function validateCPF(input) {
    const federalIdError = document.getElementById("federalIdError");
    const validationDiv = input.nextElementSibling;
    const federalId = input.value.replace(/\D/g, "");

    if (federalId.length !== 11) {
        displayValidationSVG(validationDiv, false);
        federalIdError.textContent = "Digite um CPF válido com 11 dígitos.";
        return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(federalId.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(federalId.substring(9, 10))) {
        displayValidationSVG(validationDiv, false);
        federalIdError.textContent = "Digite um CPF válido.";
        return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(federalId.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(federalId.substring(10, 11))) {
        displayValidationSVG(validationDiv, false);
        federalIdError.textContent = "Digite um CPF válido.";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    federalIdError.textContent = "";
    return true;
}

/* Validação de Telefone */
function validatePhone(input) {
    const phoneError = document.getElementById("phoneError");
    const validationDiv = input.nextElementSibling;
    const phone = input.value.replace(/\D/g, "");

    if (phone.length < 11) {
        displayValidationSVG(validationDiv, false);
        phoneError.textContent = "Digite um número de telefone válido com DDD.";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    phoneError.textContent = "";
    return true;
}

/* Validação de Data de Nascimento */
function validateBirth(input) {
    const birthError = document.getElementById("birthError");
    const validationDiv = input.nextElementSibling;
    const birth = input.value;
    const birthRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!birthRegex.test(birth)) {
        displayValidationSVG(validationDiv, false);
        birthError.textContent = "Digite uma data de nascimento válida (DD/MM/AAAA).";
        return false;
    }

    const [day, month, year] = birth.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        displayValidationSVG(validationDiv, false);
        birthError.textContent = "Digite uma data de nascimento válida (DD/MM/AAAA).";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    birthError.textContent = "";
    return true;
}

/* Validação de Email */
function validateEmail(input) {
    const emailError = document.getElementById("emailError");
    const validationDiv = input.nextElementSibling;
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        displayValidationSVG(validationDiv, false);
        emailError.textContent = "Digite um email válido.";
        return false;
    }

    displayValidationSVG(validationDiv, true);
    emailError.textContent = "";
    return true;
}
