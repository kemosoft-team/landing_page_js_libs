//API url
let apiUrl = 'https://api.retool.com/v1/workflows/f9000ea1-f16c-4c34-95f6-51ecfcc39285/startTrigger?workflowApiKey=retool_wk_7d2f4f13dd9841fbbd5b5737a82fcfc5';
let stepsUrl = 'https://vemcard.faz.vc/';
let apiConsig = 'https://api.consigmais.com.br/lp/main/v2/';

//Exibe mensagem no toast
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}

/registerCustomer
async function registerCustomer(name, federalId, phone, birth, registration) {

    const button = document.querySelector('.btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';

    axios.post(apiUrl /* + '/registerCustomer' */, {
        "nome": name,
        "cpf": federalId,
        "telefone": phone,
        "data_nascimento": birth,
        "matricula": registration
    })
        .then((response) => {
            const cpfQueryParam = encodeURIComponent(federalId); // Encode the CPF for URL
            const redirectUrl = `https://vemcard.faz.vc/account?cpf=${cpfQueryParam}`;
            window.location.href = redirectUrl;
        })
        .catch(function (error) {
            button.removeAttribute('disabled');
            spinner.classList.add('brz-invisible');
            span.textContent = 'ACEITAR E CONTINUAR';
            showToast(error.response.data.message);
        });
}


// Obtem as informações de endereço com base no CEP
function getByZipCodeInfo(zipcode) {
    axios.get(`https://viacep.com.br/ws/${zipcode}/json/`)
        .then((response) => {
            setAddressInfo(response.data);
        })
        .catch((error) => {
            showToast(error.response.data.message);
        });
}

// Preenche os campos de endereço do formulário
function setAddressInfo(obj) {
    document.querySelector('[data-label="Logradouro"]').value = obj.logradouro;
    document.querySelector('[data-label="Bairro"]').value = obj.bairro;
    document.querySelector('[data-label="Cidade"]').value = obj.localidade;
    document.querySelector('[data-label="UF"]').value = obj.uf;
}


// registerCustomerAddress
function registerCustomerAddress(zipcode, address, addressNumber, complement, state, district, city) {
    const urlParams = new URLSearchParams(window.location.search);
    const cpf = urlParams.get('cpf'); // Get CPF from URL query parameter

    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';

    axios.post(apiUrl /* + 'registerCustomerInfos' */, {
        "cpf": cpf,
        "cep": zipcode,
        "logradouro": address,
        "numero": addressNumber,
        "complemento": complement,
        "estado": state,
        "bairro": district,
        "cidade": city
    })
        .then(() => {
            const cpfQueryParam = encodeURIComponent(cpf); // Encode the CPF for URL
            const redirectUrl = `https://vemcard.faz.vc/document?cpf=${cpfQueryParam}`;
            window.location.href = redirectUrl;
        })
        .catch(function (error) {
            button.removeAttribute('disabled');
            spinner.classList.add('brz-invisible');
            span.textContent = 'Continuar';
            showToast(error.response.data.message);
        });
}



// registerCustomerAccount
function registerCustomerAccount(agency, bank, account, verifyDigit, accountType) {
    const urlParams = new URLSearchParams(window.location.search);
    const cpf = urlParams.get('cpf');

    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';

    axios.post(apiUrl /* + 'registerCustomerInfos' */, {
        "cpf": cpf,
        "no_agencia": agency,
        "banco": bank,
        "no_conta": account,
        "digito": verifyDigit,
        "tipo_conta": accountType
    })
        .then((response) => {
            const cpfQueryParam = encodeURIComponent(cpf);
            const redirectUrl = `https://vemcard.faz.vc/address?cpf=${cpfQueryParam}`;
            window.location.href = redirectUrl;
        })
        .catch(function (error) {
            button.removeAttribute('disabled');
            spinner.classList.add('brz-invisible');
            span.textContent = 'Simular';
            showToast(error.response.data.message);
        });
}


// registerCustomerDocs
async function registerCustomerDocs(docNumber, docType, issueState) {
    const urlParams = new URLSearchParams(window.location.search);
    const cpf = urlParams.get('cpf'); // Get CPF from URL query parameter

    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';

    axios.post(apiUrl /* + 'registerCustomerInfos' */, {
        "cpf": cpf, // Include CPF in the request
        "documento": docNumber,
        "tipo_documento": docType,
        "uf_expedidor": issueState
    })
        .then((response) => {
            const cpfQueryParam = encodeURIComponent(cpf); // Encode the CPF for URL
            const redirectUrl = `https://vemcard.faz.vc/success?cpf=${cpfQueryParam}`;
            window.location.href = redirectUrl;
        })
        .catch(function (error) {
            button.removeAttribute('disabled');
            spinner.classList.add('brz-invisible');
            span.textContent = 'Continuar';
            showToast(error.response.data.message);
        });
}



//validarFormAddress
function validarFormAddress() {

    const zipcode = document.querySelector('[data-label="CEP"]').value;
    const address = document.querySelector('[data-label="Logradouro"]').value;
    const addressNumber = document.querySelector('[data-label="Número"]').value;
    const complement = document.querySelector('[data-label="Complemento"]').value;
    const state = document.querySelector('[data-label="UF"]').value;
    const district = document.querySelector('[data-label="Bairro"]').value;
    const city = document.querySelector('[data-label="Cidade"]').value;


    if (zipcode == "" || address == "" || addressNumber == "" || state == "" || district == "" || city == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }
    registerCustomerAddress(zipcode, address, addressNumber, complement, state, district, city);

}

//validarFormDocs
function validarFormDocs() {

    const docType = document.querySelector('[data-label="Tipo de Documento"]').value;
    const docNumber = document.querySelector('[data-label="Número do Documento"]').value;
    const issueState = document.querySelector('[data-label="UF Expeditor"]').value;


    if (docType == "" || docNumber == "" || issueState == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }
    registerCustomerDocs(docNumber, docType, issueState);
}


function validarFormAccount() {

    const agency = document.querySelector('[data-label="Agência"]').value;
    var bank = '';
    const account = document.querySelector('[data-label="Conta"]').value;
    const verifyDigit = document.querySelector('[data-label="Dígito"]').value;
    const accountType = document.querySelector('[data-label="Tipo de conta"]').value;

    if (document.querySelectorAll('div.brz-forms2__item')[1].style.display == "block") {
        bank = document.querySelector('[data-label="Nome Banco"]').value;
    } else {
        bank = document.querySelector('[data-label="Banco"]').value;
    }

    if (agency == "" || bank == "" || account == "" || verifyDigit == "" || accountType == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }

    const accountTypeCut = accountType.charAt(0).toString();
    registerCustomerAccount(agency, bank, account, verifyDigit, accountTypeCut);
}

//valida form
function validateForm() {

    const name = document.querySelector('[data-label="Nome"]').value;
    const phone = document.querySelector('[data-label="Whatsapp"]').value;
    const federalId = document.querySelector('[data-label="CPF"]').value;
    const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
    const registration = document.querySelector('[data-label="Matricula"]').value;


    if (name == "" || phone == "" || federalId == "" || birth == "" || registration == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }

    registerCustomer(name, federalId, phone, birth, registration);
}
