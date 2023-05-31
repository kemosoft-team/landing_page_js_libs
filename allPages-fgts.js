/* ========== COOKIES ========== */

//setCookies client origin
function setCookies(latDays) {

    axios.get('https://ipinfo.io/json')
        .then(function (response) {

            const ip = response.data.ip;
            const hostname = response.data.hostname;
            const city = response.data.city;
            const region = response.data.region;
            const country = response.data.country;
            const loc = response.data.loc;
            const org = response.data.org;

            let ipinfo = {
                ip: ip || null,
                hostname: hostname || null,
                city: city || null,
                region: region || null,
                country: country || null,
                loc: loc || null,
                org: org || null,
            };

            const urlParams = new URLSearchParams(window.location.search);

            for (const [key, value] of urlParams.entries()) {
                ipinfo[key] = value;
            }

            var expirationDays = latDays || 7;
            var expirationDate = new Date();

            expirationDate.setTime(expirationDate.getTime() + (expirationDays * 24 * 60 * 60 * 1000));

            document.cookie = "client_origin=" + encodeURIComponent(JSON.stringify(ipinfo)) + "; expires=" + expirationDate.toUTCString() + "; path=/;";
        })
        .catch(function (error) {
            console.log(error);
        });
}

// obtem o cookie pelo nome 
function getCookie(name) {

    let cookie = {};

    document.cookie.split(';').forEach(function (el) {
        let [k, v] = el.split('=');
        cookie[k.trim()] = v;
    })

    return cookie[name];
}

setCookies();
getCookie();


/* ========== MASCARAS FORMULARIO ========== */
var federalId = document.querySelector('[data-label="CPF"]'),
    phone = document.querySelector('[data-label="Whatsapp"]'),
    birth = document.querySelector('[data-label="Data de Nascimento"]');

if (federalId) {
    federalId.setAttribute("inputmode", "numeric"), phone.setAttribute("inputmode", "numeric"), federalId.addEventListener("input", (function () {
        var e = federalId.value;
        e = (e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d{1,2})$/, "$1-$2"), federalId.value = e
    }));
}
if (phone) {
    phone.addEventListener("input", (function () {
        var e = phone.value;
        e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{2})(\d)/, "($1) $2")).replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3"), phone.value = e
    }));
}
if (birth) {
    birth.addEventListener("input", (function () {
        var e = birth.value;
        e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 8)).replace(/(\d{2})(\d)/, "$1/$2")).replace(/(\d{2})(\d)/, "$1/$2"), birth.value = e
    }));
}


/* ========== ACTION FORMULARIO ========== */

let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/'; 
let stepsUrl = 'https://infos.faz.vc/';

function redirectToNextStep(n) {
    window.location.replace(`${stepsUrl + n}`);
}

//setar token
function handleSetToken(value) {
    // console.log("handleToken");
    document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=.faz.vc; path=/;`;
}

//obtem o step atual pela url
function getCurrentStep() {
    const path = window.location.pathname;
    const value = path.split('/')[1];
    return value;
}

//showToast
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}

//get Token Status info-return
function getTokenStatus() {

    if (getCookie('tkn')) {

        axios.post(apiBaseUrl + '/getTokenStatus', {}, {
            headers: {
                'Authorization': `Bearer ${getCookie('tkn')}`
            }
        })
            .then(function (response) {

                const link = document.querySelector('a.btn-continue');
                link.setAttribute('href', 'https://infos.faz.vc/' + response.data.nextStep);

                document.getElementById("info-return").innerHTML = `<p class="p-info-return">${response.data.message}</p>`;
                var botao = document.querySelector(".btn-lead-info");
                botao.click();

            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function setBanks(bankList) {
    bankList.reverse();
    const selects = document.querySelectorAll('select[data-label="Banco"]');

    selects.forEach(select => {
        bankList.forEach(bank => {
            const option = document.createElement('option');
            option.text = bank.name;
            option.value = bank.bankNo;
            select.insertBefore(option, select.firstChild);
        });
    });
}

//obtem os bancos
async function getBanks() {
    axios.post('https://api.consigmais.com.br/lp/main/v2/getData', { "object": "banks" }, {
        headers: {
            'Authorization': `Bearer ${getCookie('tkn')}`
        }
    })
        .then(function (response) {
            setBanks(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}


//obtem os parametros do afiliado oriondos dos cookies
function captureAffiliateData() {

    const urlParams = new URLSearchParams(window.location.search);

    let affiliateData = {

        affiliateCode: urlParams.get('af') || null,
        source: urlParams.get('source') || null,
        productId: urlParams.get('pid') || null,
        vendorId: urlParams.get('vid') || null,
        offerId: urlParams.get('oid') || null,
        clickId: urlParams.get('cid') || null,
        pixelId: urlParams.get('afx') || null,
        gtmId: urlParams.get('afgtm') || null,
        latDays: urlParams.get('latd') || null,
        brandId: urlParams.get('bid') || null,
        nextStep: urlParams.get('nxstp') || null,
        token: urlParams.get('tkn') || null,
        rawUri: window.location.search
    };
    return affiliateData;
}


//registerCustomer
async function registerCustomer(name, birth, federalId, phone, email) {

    const affiliate = captureAffiliateData();

    const button = document.querySelector('.btn-submit-fgts');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';

    axios.post(apiBaseUrl + '/registerCustomer', {
        "name": name,
        "birth": birth,
        "federalId": federalId,
        "phone": phone,
        "email": email,
        "useTerms": true,
        "dataPrivacy": true,
        "dataSearchAllowed": true,
        "affiliateData": affiliate
    })
        .then((response) => {
            handleSetToken(response.data.token);
            redirectToNextStep(response.data.nextStep);
        })
        .catch(function (error) {
            button.removeAttribute('disabled');
            spinner.classList.add('brz-invisible');
            span.textContent = 'ACEITAR E CONTINUAR';
            showToast(error.response.data.message);
        });
}

//validar form
function validateForm() {

    const name = document.querySelector('[data-label="Nome"]').value;
    const phone = document.querySelector('[data-label="Whatsapp"]').value;
    const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
    const email = document.querySelector('[data-label="Email (Opcional)"]').value;
    const federalId = document.querySelector('[data-label="CPF"]').value;

    if (name == "" || phone == "" || birth == "" || federalId == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }

    registerCustomer(name, birth, federalId, phone, email);
}

const buttonSubmit = document.querySelector(".btn-submit-fgts");
 buttonSubmit.addEventListener("click", function(event) {
 validateForm();
});


getTokenStatus();

/* ========== */
var url_params = window.location.href, url = new URL(url_params); let data = url.searchParams.get("bid"); axios.post("https://api.consigmais.com.br/server/lp/main/v2/getBrandInfo", { brandId: data }).then((function (e) { const a = null != e.data.brandLogoDark && window.isWhiteMode ? e.data.brandLogoDark : e.data.brandLogo, o = e.data, t = '<p class="footer" style="text-align: center;">Este produto está sendo oferecido pela</p><br><div style="display: flex;justify-content: center; align-items: center;"><img style="width:100%; max-width:200px;" src="' + a + '" alt="Logomarca ' + o.brandName + '"></div><br><p class="footer terms" style="text-align: center;">Todos os direitos reservados. Todo conteúdo do site, logotipos,marcas, layout, aqui veiculados são de propriedade exclusiva. É vedada qualquer reprodução,total ou parcial, de qualquer elemento de identidade, sem expressa autorização. A violação de qualquer direito mencionado implicará na responsabilização civil e criminal nos termos da Lei.</p><p class="footer links" style="text-align: center;"><a style="color:#fff" href="https://api.consigmais.com.br/terms/">Termos de Uso</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="color:#fff" href="https://api.consigmais.com.br/privacy/">Politicas de Privacidade</a></p><p class="footer address" style="text-align: center;">' + o.address + '</p><p class="footer federalid" style="text-align: center;">' + o.federalId + "</p>"; document.getElementById("footer").innerHTML = t })).catch((function (e) { console.log(e) }));

/* ========== TIRAR FUNCIONALIDADE DO BOTÃO ========== */
<script>var form = document.querySelector('.brz-form');
form.removeAttribute('action');</script>

/* ========== FORMULARIO INFO POLITICAS ========== */
<script>
  //informações adicionais do formulario
    let novaDiv = document.createElement('div');
    novaDiv.classList.add('brz-rich-text');
    let novoParagrafo = document.createElement('p');
    novoParagrafo.classList.add('brz-css-bmkpa');
    novoParagrafo.setAttribute('data-generated-css', 'brz-css-gtmtp');
    novoParagrafo.style.fontSize = '11px';
    novoParagrafo.style.textAlign = 'justify';
    novoParagrafo.style.wordWrap = 'break-word';
    novoParagrafo.innerHTML = '<span class="terms" style="opacity: 1;">Ao continuar no botão abaixo você estará assegurando o tratamento responsável de suas informações, em conformidade com a LGPD vigente, e também: 1. Concordando com os <a href="https://api.consigmais.com.br/terms/" style="color: #646464" target="_blank">Termos de Uso</a> e de <a style="color: #646464" href="https://api.consigmais.com.br/privacy/" target="_blank">Privacidade</a> 2. Aceitando ser contatado por Whatsapp/SMS acerca desta minha consulta e solicitação, bem como autorizo ter meu CPF consultado junto às instituições bancárias e governamentais para assegurar a correta simulação / contratação deste produto.</span>';
    novaDiv.appendChild(novoParagrafo);

    let divPai = document.querySelector('.brz-forms2__item-button');

    divPai.insertAdjacentElement('beforebegin', novaDiv);
</script>








