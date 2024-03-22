/* FUNÇÕES DE VALIDAÇÃO */
function validatePhone(phone) {
    const numericPhone = phone.replace(/\D/g, "");

    if (numericPhone.length !== 11) {
        return false;
    }

    const validDDDs = [
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "21",
        "22",
        "24",
        "27",
        "28",
        "31",
        "32",
        "33",
        "34",
        "35",
        "37",
        "38",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "51",
        "53",
        "54",
        "55",
        "61",
        "62",
        "63",
        "64",
        "65",
        "66",
        "67",
        "68",
        "69",
        "71",
        "73",
        "74",
        "75",
        "77",
        "79",
        "81",
        "82",
        "83",
        "84",
        "85",
        "86",
        "87",
        "88",
        "89",
        "91",
        "92",
        "93",
        "94",
        "95",
        "96",
        "97",
        "98",
        "99",
    ];

    const firstTwoDigits = numericPhone.substring(0, 2);
    if (!validDDDs.includes(firstTwoDigits)) {
        return false;
    }

    if (numericPhone[2] !== "9") {
        return false;
    }

    const firstDigit = numericPhone[0];
    if (numericPhone.split("").every((digit) => digit === firstDigit)) {
        return false;
    }

    return true;
}

/* function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} */

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|br|io|net|org|gov)$/i;
    const atSymbolCount = (email.match(/@/g) || []).length; 
    return emailRegex.test(email.trim()) && atSymbolCount === 1;
}



function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    if (cpf.length !== 11) return false;
    let sum = 0,
        remainder;

    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
}

const ufSiglas = [
    "AC", "AL", "AP", "AM", "BA",
    "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB",
    "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP",
    "SE", "TO"
];

function validateUF(sigla) {
    if (ufSiglas.includes(sigla.toUpperCase())) {
        return true;
    } else {
        return false;
    }
}

function isDateValid(dateString) {
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!datePattern.test(dateString)) {
            return false;
        }
        const [, day, month, year] = dateString.match(datePattern);
        const dayInt = parseInt(day, 10);
        const monthInt = parseInt(month, 10);
        const yearInt = parseInt(year, 10);
        if (yearInt < 1900 || yearInt > 2099) {
            return false;
        }

        const date = new Date(yearInt, monthInt - 1, dayInt);
        if (
            date.getDate() === dayInt &&
            date.getMonth() === monthInt - 1 &&
            date.getFullYear() === yearInt
        ) {
            return true;
        }

        return false;
    }

function isUnderage(birthDate) {
    var parts = birthDate.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; 
    var year = parseInt(parts[2], 10);

    var birthDateObj = new Date(year, month, day);
    var currentDate = new Date();
    var timeDiff = currentDate.getTime() - birthDateObj.getTime();
    var age = Math.floor(timeDiff / (1000 * 3600 * 24 * 365.25));
    if (age < 18) {
        return false;
    } else {
        return true;
    }
}


//removerAtributos
function removeAttributeStorage() {
    localStorage.removeItem("attemptsEnable");
    localStorage.removeItem("attemptsAuth");
}

function validarNumeroBeneficio(numeroBeneficio) {
    var regexBeneficio = /^[0-9]{10}$/;
    if (regexBeneficio.test(numeroBeneficio)) {
        var sequenciaRepetida = /(\d)\1{9}/;
        if (sequenciaRepetida.test(numeroBeneficio)) {
            return false;
        }
        return true;
    }
    return false;
}

function validateMod11Digit(code, numDig, limMult, x10) {
    if (!numDig) numDig = 1;
    let dado = code.substring(0, code.length - numDig);
    let mult, soma, i, n, dig;
    if (!x10) x10 = 1; // Correção aqui
    for (n = 1; n <= numDig; n++) {
        soma = 0;
        mult = 2;
        for (i = dado.length - 1; i >= 0; i--) {
            soma += (mult * parseInt(dado.charAt(i)));
            if (++mult > limMult) mult = 2;
        }
        if (x10) {
            dig = ((soma * 10) % 11) % 10;
        } else {
            dig = soma % 11;
            if (dig == 10) dig = "X";
        }
        dado += (dig);
    }
    return (dado === code);
}

function isBirthValid(dateString) {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!datePattern.test(dateString)) {
        return false;
    }
    const [, , , year] = dateString.match(datePattern);
    const yearInt = parseInt(year, 10);
    const currentDate = new Date();
    const maxBirthYear = currentDate.getFullYear();

    if (maxBirthYear - yearInt > 76) {
        return false;
    }

    if (maxBirthYear - yearInt < 18) {
        menorIdade = true;
    } else{
        menorIdade = false;
    }

    return true; 
}


/* FUNÇÕES DE EXIBIÇÃO */
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () {
        x.className = x.className.replace("show", `${text}`);
    }, 3000);
}

function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

/* FUNÇÕES DE ARMAZENAMENTO LOCAL */
function setItemStorage({
    pipelineSlug,
    federalId,
    leadId,
    opportunity
}) {
    var dataQualification = {
        pipelineSlug,
        federalId,
        leadId,
        opportunity
    };
    var objDataQualification = JSON.stringify(dataQualification);
    localStorage.setItem("dataQualification", objDataQualification);
}

function getItemStorage() {
    const dataQualificationLocalStorage = localStorage.getItem('dataQualification');
    const storedDataQualification = JSON.parse(dataQualificationLocalStorage);

    return {
        pipelineSlug: storedDataQualification.pipelineSlug,
        federalId: storedDataQualification.federalId,
        leadId: storedDataQualification.leadId,
        opportunity: storedDataQualification.opportunity
    };
}

/* REDIRECIONAMENTO E INTEGRAÇÕES EXTERNAS */
function nextStepInfos(federal, pipeline) {

    function obterParametroDaURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
    const urlCallBack = obterParametroDaURL('callbackUrl');

    let federalIdRequest;
    let pipelineRequest;

    if (federal && pipeline) {
        federalIdRequest = federal;
        pipelineRequest = pipeline;
    } else {
        const { pipelineSlug, federalId } = getItemStorage();
        federalIdRequest = federalId;
        pipelineRequest = pipelineSlug;
    }

    axios
        .get(`${API_URL}/proxima-etapa/${pipelineRequest}/${federalIdRequest}`, {
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
                    URL_redirect = `/documento?federalId=${federalIdRequest}&callbackUrl=${urlCallBack}&pipeline=${pipelineRequest}`;
                    window.location.href = URL_redirect;
                } else {
                    URL_redirect = `/documento?federalId=${federalIdRequest}`;
                    window.location.href = URL_redirect;
                }

            } else if (pedirInfos.includes("endereco")) {
                if (urlCallBack) {
                    URL_redirect = `/endereco?federalId=${federalIdRequest}&callbackUrl=${urlCallBack}&pipeline=${pipelineRequest}`;
                    window.location.href = URL_redirect;
                } else {
                    URL_redirect = `/endereco?federalId=${federalIdRequest}`;
                    window.location.href = URL_redirect;
                }

            } else if (pedirInfos.includes("conta")) {
                if (urlCallBack) {
                    URL_redirect = `/conta?federalId=${federalIdRequest}&callbackUrl=${urlCallBack}&pipeline=${pipelineRequest}`;
                    window.location.href = URL_redirect;
                } else {
                    URL_redirect = `/conta?federalId=${federalIdRequest}`;
                    window.location.href = URL_redirect;
                }

            } else {
                if (urlCallBack) {
                    callback(urlCallBack);
                } else {
                    qualification();
                }
            }

        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter a qualificação");
        });
}

function bankRedirect(oportunidades, contexto) {
    const oportunidadeConfirmada = oportunidades.find(oportunidade => oportunidade.confirmada === true);

    console.log("Oportunidades: ", oportunidades);
    console.log("Contexto: ", contexto);

    if (oportunidadeConfirmada) {
        const banco = oportunidadeConfirmada.chaveBanco;

        switch (banco) {
            case "eccor":
                if (contexto === "aguardando-link-assinatura") {
                    URL_redirect = `/signature?tp=wpp`;
                    window.location.href = URL_redirect;
                } else {
                    URL_redirect = `/pendingsignature?tp=wpp`;
                    window.location.href = URL_redirect;
                }
                break;
            case "facta":
                if (contexto === "aguardando-link-assinatura") {
                    URL_redirect = `/signature?tp=link`;
                    window.location.href = URL_redirect;
                } else {
                    URL_redirect = `/pendingsignature?tp=link`;
                    window.location.href = URL_redirect;
                }
                break;
            case "bmg":
                if (contexto === "aguardando-link-assinatura") {
                    URL_redirect = `/signature?tp=sms`;
                    window.location.href = URL_redirect;
                } else {
                    URL_redirect = `/pendingsignature?tp=sms`;
                    window.location.href = URL_redirect;
                }
                break;
            default:
                console.log(`Banco não reconhecido: ${banco}`);
        }
    } else {
        console.log("Nenhuma oportunidade confirmada encontrada");
    }
}

function getCEP(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showToast('CEP não encontrado. Verifique e tente novamente.');
                document.querySelector('[data-brz-label="CEP"]').value = '';
            } else {
                // Preenche os campos se não houver erro
                document.querySelector('[data-brz-label="Rua"]').value = data.logradouro || '';
                document.querySelector('[data-brz-label="Número"]').focus();
                document.querySelector('[data-brz-label="Bairro"]').value = data.bairro || '';
                document.querySelector('[data-brz-label="Cidade"]').value = data.localidade || '';
                document.querySelector('[data-brz-label="UF"]').value = data.uf || '';
            }
        })
         .catch(error => {
            console.error('Erro ao obter endereço:', error);
            showToast('Erro ao obter endereço. Verifique o CEP e tente novamente.');
        });
}

// OBTER PRÓXIMA ETAPA
function getProximaEtapa(pipeline, federalId) {
  return axios.get(`${API_URL}/proxima-etapa/${pipeline}/${federalId}`, {
    headers: {
      'api-key': API_KEY
    }
  })
    .then((response) => {
    const leadId = response.data.id;
    const contexto = response.data.contexto;
        
      setItemStorage({
        pipelineSlug: pipeline,
        federalId: federalId,
        leadId: leadId,
      });
      return { leadId, contexto };
    })
    .catch(function (error) {
      console.log(error, "Não foi possível obter a próxima etapa");
      throw error; // Propague o erro para que possa ser tratado externamente, se necessário
    });
}

/* DADOS BANCÁRIOS */
function setBanksArray() {

    const banks = [
        {
            "bank_no": "104",
            "name": "104 - Caixa Econômica Federal"
        },
        {
            "bank_no": "001",
            "name": "001 - Banco do Brasil S.A."
        },
        {
            "bank_no": "237",
            "name": "237 - Banco Bradesco S.A."
        },
        {
            "bank_no": "033",
            "name": "033 - Banco Santander S.A."
        },
        {
            "bank_no": "341",
            "name": "341 - Itaú Unibanco S.A."
        },
        {
            "bank_no": "260",
            "name": "260 - Nubank S.A."
        },
        {
            "bank_no": "077",
            "name": "077 - Banco Inter S.A."
        },
        {
            "bank_no": "380",
            "name": "380 - PicPay Serviços S.A"
        },
        {
            "bank_no": "003",
            "name": "003 - Banco da Amazonia S.A."
        },
        {
            "bank_no": "004",
            "name": "004 - Banco do Nordeste"
        },
        {
            "bank_no": "012",
            "name": "012 - Banco Inbursa S.A."
        },
        {
            "bank_no": "021",
            "name": "021 - BANESTES S.A. Banco do Estado do Espirito Santo"
        },
        {
            "bank_no": "024",
            "name": "024 - Banco Bandepe S.A."
        },
        {
            "bank_no": "025",
            "name": "025 - Banco Alfa S.A."
        },
        {
            "bank_no": "029",
            "name": "029 - ITAU BMG CONSIGNADO"
        },
        {
            "bank_no": "037",
            "name": "037 - Banco do Estado do Para S.A."
        },
        {
            "bank_no": "041",
            "name": "041 - Banco do Estado do RS"
        },
        {
            "bank_no": "041",
            "name": "041 - Banrisul S.A."
        },
        {
            "bank_no": "047",
            "name": "047 - Banco do Estado de Sergipe S.A."
        },
        {
            "bank_no": "065",
            "name": "065 - Banco Andbank (Brasil) S.A."
        },
        {
            "bank_no": "069",
            "name": "069 - Banco Crefisa"
        },
        {
            "bank_no": "070",
            "name": "070 - Banco de Brasilia S.A. (BRB)"
        },
        {
            "bank_no": "074",
            "name": "074 - Banco J. Safra S.A."
        },
        {
            "bank_no": "075",
            "name": "075 - Banco ABN AMRO S.A."
        },
        {
            "bank_no": "076",
            "name": "076 - KardBank"
        },
        {
            "bank_no": "082",
            "name": "082 - Banco Topazio S.A."
        },
        {
            "bank_no": "083",
            "name": "083 - Banco China Construction Bank (CCB)"
        },
        {
            "bank_no": "084",
            "name": "084 - Unicred Norte do Paraná"
        },
        {
            "bank_no": "085",
            "name": "085 - Cooperativa Central de Crédito (Ailos)"
        },
        {
            "bank_no": "091",
            "name": "091 - Unicred Central do Rio Grande do Sul"
        },
        {
            "bank_no": "094",
            "name": "094 - Banco Finaxis S.A."
        },
        {
            "bank_no": "102",
            "name": "102 - Banco XP S.A."
        },
        {
            "bank_no": "104",
            "name": "104 - CAIXA TEM"
        },
        {
            "bank_no": "120",
            "name": "120 - Banco Rodobens S.A."
        },
        {
            "bank_no": "121",
            "name": "121 - Banco Agibank"
        },
        {
            "bank_no": "121",
            "name": "121 - Banco Agibank S.A."
        },
        {
            "bank_no": "125",
            "name": "125 - Plural S.A. "
        },
        {
            "bank_no": "136",
            "name": "136 - Banco Unicred do Brasil"
        },
        {
            "bank_no": "149",
            "name": "149 - FACTA FINANCEIRA"
        },
        {
            "bank_no": "169",
            "name": "169 - Banco Ole Bonsucesso Consignado S.A."
        },
        {
            "bank_no": "208",
            "name": "208 - Banco BTG Pactual S.A."
        },
        {
            "bank_no": "212",
            "name": "212 - Banco Original S.A."
        },
        {
            "bank_no": "217",
            "name": "217 - Banco John Deere S.A."
        },
        {
            "bank_no": "218",
            "name": "218 - Bonsucesso S.A."
        },
        {
            "bank_no": "222",
            "name": "222 - Banco Credit Agricole Brasil S.A."
        },
        {
            "bank_no": "224",
            "name": "224 - Banco Fibra S.A."
        },
        {
            "bank_no": "233",
            "name": "233 - Banco Cifra S.A."
        },
        {
            "bank_no": "237",
            "name": "237 - Banco Next"
        },
        {
            "bank_no": "237",
            "name": "237 - Banco Next.bradesco"
        },
        {
            "bank_no": "243",
            "name": "243 - Banco Master S.A."
        },
        {
            "bank_no": "246",
            "name": "246 - Banco ABC Brasil S.A."
        },
        {
            "bank_no": "249",
            "name": "249 - Banco Investcred Unibanco S.A."
        },
        {
            "bank_no": "254",
            "name": "254 - Paraná Banco S.A."
        },
        {
            "bank_no": "269",
            "name": "269 - HSBC Brasil S.A. - Banco de Investimento"
        },
        {
            "bank_no": "276",
            "name": "276 - Banco Senff S.A."
        },
        {
            "bank_no": "280",
            "name": "280 - Will Bank"
        },
        {
            "bank_no": "280",
            "name": "280 - Will Bank"
        },
        {
            "bank_no": "290",
            "name": "290 - PagSeguro Internet S.A."
        },
        {
            "bank_no": "299",
            "name": "299 - Banco Sorocred S.A. - Banco Multiplo (AFINZ)"
        },
        {
            "bank_no": "318",
            "name": "318 - BMG S.A."
        },
        {
            "bank_no": "320",
            "name": "320 - China Construction Bank "
        },
        {
            "bank_no": "323",
            "name": "323 - Mercado Pago"
        },
        {
            "bank_no": "329",
            "name": "329 - Acreditoo"
        },
        {
            "bank_no": "329",
            "name": "329 - QueroCredito"
        },
        {
            "bank_no": "336",
            "name": "336 - Banco C6 S.A."
        },
        {
            "bank_no": "341",
            "name": "341 - Banco iti.itau"
        },
        {
            "bank_no": "370",
            "name": "370 - Banco Mizuho do Brasil S.A."
        },
        {
            "bank_no": "376",
            "name": "376 - Banco J. P. Morgan S.A."
        },
        {
            "bank_no": "389",
            "name": "389 - Banco Mercantil do Brasil"
        },
        {
            "bank_no": "394",
            "name": "394 - Bradesco Financiamentos"
        },
        {
            "bank_no": "399",
            "name": "399 - HSBC Bank Brasil S.A."
        },
        {
            "bank_no": "403",
            "name": "403 - Banco Cora"
        },
        {
            "bank_no": "422",
            "name": "422 - Banco Safra S.A."
        },
        {
            "bank_no": "456",
            "name": "456 - Banco MUFG Brasil S.A."
        },
        {
            "bank_no": "457",
            "name": "457 - UY3 SOCIEDADE DE CRÉDITO DIRETO S.A"
        },
        {
            "bank_no": "464",
            "name": "464 - Banco Sumitomo Mitsui Brasileiro S.A."
        },
        {
            "bank_no": "473",
            "name": "473 - Banco Caixa Geral - Brasil S.A."
        },
        {
            "bank_no": "477",
            "name": "477 - Citibank S.A."
        },
        {
            "bank_no": "479",
            "name": "479 - Banco ItauBank S.A"
        },
        {
            "bank_no": "487",
            "name": "487 - Deutsche Bank S.A."
        },
        {
            "bank_no": "488",
            "name": "488 - JPMorgan Chase Bank"
        },
        {
            "bank_no": "505",
            "name": "505 - Banco Credit Suisse (Brasil) S.A."
        },
        {
            "bank_no": "600",
            "name": "600 - Banco Luso Brasileiro S.A."
        },
        {
            "bank_no": "604",
            "name": "604 - Banco Industrial do Brasil S.A."
        },
        {
            "bank_no": "611",
            "name": "611 - Banco Paulista S.A."
        },
        {
            "bank_no": "612",
            "name": "612 - Banco Guanabara S.A."
        },
        {
            "bank_no": "623",
            "name": "623 - Banco PAN S.A."
        },
        {
            "bank_no": "626",
            "name": "626 - Banco Ficsa/C6 Consig"
        },
        {
            "bank_no": "630",
            "name": "630 - Banco Smartbank S.A."
        },
        {
            "bank_no": "633",
            "name": "633 - Banco Rendimento S.A."
        },
        {
            "bank_no": "637",
            "name": "637 - Sofisa S.A."
        },
        {
            "bank_no": "643",
            "name": "643 - Banco Pine S.A."
        },
        {
            "bank_no": "654",
            "name": "654 - Banco Digimais S.A."
        },
        {
            "bank_no": "655",
            "name": "655 - Banco Votorantim"
        },
        {
            "bank_no": "655",
            "name": "655 - Banco Votorantim/Neon"
        },
        {
            "bank_no": "707",
            "name": "707 - Banco Daycoval S.A"
        },
        {
            "bank_no": "739",
            "name": "739 - Banco CETELEM S.A (BGN)"
        },
        {
            "bank_no": "743",
            "name": "743 - Banco Semear S.A."
        },
        {
            "bank_no": "745",
            "name": "745 - Banco Citibank S.A."
        },
        {
            "bank_no": "746",
            "name": "746 - Banco Modal S.A."
        },
        {
            "bank_no": "747",
            "name": "747 - Banco Rabobank International Brasil S.A."
        },
        {
            "bank_no": "748",
            "name": "748 - Sicredi S.A."
        },
        {
            "bank_no": "752",
            "name": "752 - Banco BNP Paribas Brasil S.A."
        },
        {
            "bank_no": "756",
            "name": "756 - Sicoob / Bancoob"
        },
        {
            "bank_no": "888",
            "name": "888 - JB CRED"
        },
        {
            "bank_no": "889",
            "name": "889 - CREFAZ"
        },
        {
            "bank_no": "955",
            "name": "955 - Banco Ole Consignado"
        }
    ];

    const selects = document.querySelectorAll('[data-brz-label="Banco"]');

    selects.forEach(select => {
        select.innerHTML = "";

        banks.forEach(bank => {
            const option = document.createElement('option');
            option.text = bank.name;
            option.value = bank.bank_no;
            select.add(option);
        });
    });
}

/* GESTÃO DE OPORTUNIDADES E QUALIFICAÇÃO */
function requalify() {

    const { pipelineSlug, federalId, leadId } = getItemStorage();

    axios
        .post(API_URL + `/card/${leadId}/requalify`, {}, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            qualification()
           /*  let URL_redirect = `/qualification?pipeline_slug=${pipelineSlug}&federalId=${federalId}`
            window.location.href = URL_redirect; */
        })
        .catch(function (error) {
            showToast(error.response.data.message);
        });
}

function requalifyEnrollment(enrollment) {

    const { pipelineSlug, federalId, leadId } = getItemStorage();

    axios
        .post(API_URL + `/card/${leadId}/requalify`, {
            enrollment: enrollment,
        }, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            qualification()
            /* let URL_redirect = `/qualification?pipeline_slug=${pipelineSlug}&federalId=${federalId}`
            window.location.href = URL_redirect; */
        })
        .catch(function (error) {
            showToast(error.response.data.message);
        });
}

/* REGISTRO E MANIPULAÇÃO DE DADOS */
function registrarEndereco(zipcode, address, addressNumber, district, city, state) {

    function obterParametroDaURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
    const urlFederalId = obterParametroDaURL('federalId');
    const urlPipeline = obterParametroDaURL('pipeline');

    let federal;
    let pipeline;

    if (urlFederalId && urlPipeline) {
        federal = urlFederalId;
        pipeline = urlPipeline;
    } else {
        const { pipelineSlug, federalId } = getItemStorage();
        federal = federalId;
        pipeline = pipelineSlug;
    }

    //REPLACE CEP
    const zipcodeReplaced = zipcode.replace(/\D/g, '');


    const button = document.querySelector(".brz-btn-submit.submit_endereco");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";


    axios
        .post(`${API_URL}/registrar-endereco`, {
            "federalId": federal,
            "address": address,
            "addressNumber": addressNumber,
            "district": district,
            "city": city,
            "state": state,
            "zipcode": zipcodeReplaced
        }, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            nextStepInfos(federal, pipeline)
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "CONFIRMAR E CONTINUAR";
            console.log(error.response.data.message);
            showToast("Parece que houve um problema! Por Favor, tente novamente!")
        });
}

function registrarDocumento(type, number, agencyState, motherName) {


    function obterParametroDaURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
    const urlFederalId = obterParametroDaURL('federalId');
    const urlPipeline = obterParametroDaURL('pipeline');

    let federal;
    let pipeline;

    if (urlFederalId && urlPipeline) {
        federal = urlFederalId;
        pipeline = urlPipeline;
    } else {
        const { pipelineSlug, federalId } = getItemStorage();
        federal = federalId;
        pipeline = pipelineSlug;
    }

    const motherName_replaced = motherName.replace(/\s+/g, ' ');

    const button = document.querySelector(".brz-btn-submit.submit_documento");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios
        .post(`${API_URL}/registrar-documento`, {
            "federalId": federal,
            "type": type,
            "number": number,
            "agencyState": agencyState,
            "mother": motherName_replaced
        }, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            nextStepInfos(federal, pipeline)
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "CONFIRMAR E CONTINUAR";
            console.log(error.response.data.message);
            showToast("Parece que houve um problema! Por Favor, tente novamente!")
        });
}

function registrarConta(bankNo, branch, acctNo, acctType) {

    function obterParametroDaURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    // VERIFICAR SE OS PARÂMETROS ESTÃO NA URL
    const urlFederalId = obterParametroDaURL('federalId');
    const urlPipeline = obterParametroDaURL('pipeline');

    let federal;
    let pipeline;

    if (urlFederalId && urlPipeline) {
        federal = urlFederalId;
        pipeline = urlPipeline;
    } else {
        const { pipelineSlug, federalId } = getItemStorage();
        federal = federalId;
        pipeline = pipelineSlug;
    }

    const button = document.querySelector(".brz-btn-submit.submit_conta");
    const spinner = button.querySelector(".brz-form-spinner");
    const span = button.querySelector(".brz-span.brz-text__editor");

    button.setAttribute("disabled", true);
    spinner.classList.remove("brz-invisible");
    span.textContent = "";

    axios
        .post(`${API_URL}/registrar-conta`, {
            "federalId": federal,
            "bankNo": bankNo,
            "branch": branch,
            "acctNo": acctNo,
            "acctType": acctType
        }, {
            headers: {
                'api-key': API_KEY
            }
        })
        .then((response) => {
            nextStepInfos(federal, pipeline)
        })
        .catch(function (error) {
            button.removeAttribute("disabled");
            spinner.classList.add("brz-invisible");
            span.textContent = "CONFIRMAR E CONTINUAR";
            console.log(error.response.data.message);
            showToast("Parece que houve um problema! Por Favor, tente novamente!")
        });
}

function validateEndereco() {
    const zipcode = document.querySelector('[data-brz-label="CEP"]').value;
    const address = document.querySelector('[data-brz-label="Rua"]').value;
    const addressNumber = document.querySelector('[data-brz-label="Número"]').value;
    const district = document.querySelector('[data-brz-label="Bairro"]').value;
    const city = document.querySelector('[data-brz-label="Cidade"]').value;
    const state = document.querySelector('[data-brz-label="UF"]').value;

    if (
        zipcode == "" ||
        address == "" ||
        addressNumber == "" ||
        state == "" ||
        district == "" ||
        city == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    } else if (!validateUF(state)) {
        showToast("Por favor, informe um estado válido.");
        return false;
    } else {
        registrarEndereco(zipcode, address, addressNumber, district, city, state);
    }

}

function validateDocumento() {
    const type = document.querySelector('[data-brz-label="Tipo de Documento"]').value;
    const number = document.querySelector('[data-brz-label="Número do Documento"]').value;
    const agencyState = document.querySelector('[data-brz-label="UF Expeditor"]').value;
    const motherName = document.querySelector('[data-brz-label="Nome da sua Mãe"]').value;

    if (
        type == "" ||
        number == "" ||
        agencyState == "" ||
        motherName == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }  else if (!validateUF(agencyState)) {
        showToast("Por favor, informe um estado válido.");
        return false;
    }  else if (!motherName.trim() || !/[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(motherName)) {
        showToast("Por favor, digite o nome da sua mãe completo");
        return false;
    } else {
        registrarDocumento(type, number, agencyState, motherName);
    }
}

function validateConta() {
    const selectedBankElement = document.querySelector('[data-brz-label="Banco"]');
    const bankNo = selectedBankElement.value;
    let acctType = document.querySelector('[data-brz-label="Tipo de conta"]').value;
    const branch = document.querySelector('[data-brz-label="Agência"]').value;
    const account = document.querySelector('[data-brz-label="Conta"]').value;
    const verifyDigit = document.querySelector('[data-brz-label="Dígito"]').value;

    // Adicionando a verificação para o tipo de conta
    if (acctType.toLowerCase() === 'conta corrente') {
        acctType = 'C';
    } else if (acctType.toLowerCase() === 'poupança') {
        acctType = 'P';
    }

    if (
        bankNo == "" ||
        acctType == "" ||
        branch == "" ||
        account == "" ||
        verifyDigit == ""
    ) {
        showToast("Por favor, preencha todos os campos.");
        return false;
    } else {
        registrarConta(bankNo, branch, account + verifyDigit, acctType);
    }
}
