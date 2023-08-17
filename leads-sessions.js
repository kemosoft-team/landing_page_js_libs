// Initial Setup
let apiBaseUrl = 'https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb';
var ticket = '';
var ticket_value = '';
var ticket_type = '';

// Show Toast
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}

// Get Cookies
function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function (el) {
        let [k, v] = el.split('=');
        cookie[k.trim()] = v;
    });
    return cookie[name];
}

//obtem os parametros do afiliado oriondos dos cookies
function captureAffiliateData() {

    const urlParams = new URLSearchParams(window.location.search);

    let affiliateData = {
        affiliateCode: urlParams.get('af') || 'Vv5P88AWTr7qsU8v8',
        source: urlParams.get('source') || null,
        productId: urlParams.get('pid') || null,
        vendorId: urlParams.get('vid') || null,
        offerId: urlParams.get('oid') || '28',
        clickId: urlParams.get('cid') || '645d01bc3981320001f44bd1',
        pixelId: urlParams.get('afx') || null,
        gtmId: urlParams.get('afgtm') || null,
        latDays: urlParams.get('latd') || null,
        brandId: urlParams.get('bid') || '23',
        nextStep: urlParams.get('nxstp') || null,
        token: urlParams.get('tkn') || null,
        fbClid: urlParams.get('fbClid') || null,
        sessionId: urlParams.get('sessionId') || null,
        rawUri: window.location.search
    };
    return affiliateData;
}


//seta cookies
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

            //verfica se tem parametros na URL
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('af') && urlParams.has('oid')) {

                for (const [key, value] of urlParams.entries()) {
                    ipinfo[key] = value;
                }

            } else {
                ipinfo['af'] = 'Vv5P88AWTr7qsU8v8';
                ipinfo['bid'] = '23';
                ipinfo['oid'] = '28';
                ipinfo['cid'] = '645d01bc3981320001f44bd1';
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


// Set Ticket
function setTicket(ticketType) {
    switch (ticketType) {
        case 'fullpass':
            var valueFullPass = '3.997';
            ticket = { type: 'fullpass', amount: valueFullPass };
            ticket_Type = ticket.type;
            ticket_value = ticket.amount;
            btnWillOpen.click();
            break;

        case 'vip':
            var valueVip = '4.497'
            ticket = { type: 'vip', amount: valueVip };
            ticket_Type = ticket.type;
            ticket_value = ticket.amount;
            btnWillOpen.click();
            break;

        case 'diamond':
            var valueDiamond = '5.497';
            ticket = { type: 'diamond', amount: valueDiamond };
            ticket_Type = ticket.type;
            ticket_value = ticket.amount;
            btnWillOpen.click();
            break;

        default:
            break;
    }
}

//registerCustomer
async function registerCustomer(name, federalId, phone, email, ticket, ticket_value, ticket_type) {

    const affiliate = captureAffiliateData();

    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
    console.log(ticket_value);

    /*  axios.post(apiBaseUrl + 'registerCustomer', { */
    axios.post(apiBaseUrl, {
        "name": name,
        "federalId": federalId,
        "phone": phone,
        "email": email,
        "ticket": ticket,
        "affiliateData": affiliate
    },

        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'X-Client': getCookie('client_origin')
            }
        })
        .then((response) => {
            var link_checkout = `https://checkout.summersales.com.br/?purchase=${ticket_type}&FbClid=${affiliate.fbClid}&sessionId=${affiliate.sessionId}`;
            window.location.href = `https://xm16mrwaafp.typeform.com/to/sEzGeuZe#name=${name}&phone=${phone}&email=${email}&ticket_value=${ticket_value}&link_checkout=${link_checkout}&FbClid=${fbClid}&sessionId=${sessionId}`;
        })

        .catch(function (error) {
            button.removeAttribute('disabled');
            spinner.classList.add('brz-invisible');
            span.textContent = 'CADASTRAR AGORA!';
            showToast(error.response.data.message);
        });
}

//validar form
function validateForm() {

    const name = document.querySelector('[data-label="Nome"]').value;
    const phone = document.querySelector('[data-label="Whatsapp"]').value;
    const email = document.querySelector('[data-label="Email"]').value;
    const federalId = document.querySelector('[data-label="CPF"]').value;

    if (name == "" || federalId == "" || phone == "" || email == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }

    registerCustomer(name, federalId, phone, email);
}

// Event Listeners for Ticket Types
var btnWillOpen = document.getElementById('btnWillOpen');
var fullpass = document.getElementById('fullpass');
var vip = document.getElementById('vip');
var diamond = document.getElementById('diamond');

fullpass.addEventListener('click', function () {
    setTicket('fullpass');
});

vip.addEventListener('click', function () {
    setTicket('vip');
});

diamond.addEventListener('click', function () {
    setTicket('diamond');
});


// Event Listener for Form Submission
const buttonSubmit = document.querySelector(".brz-btn-submit");
buttonSubmit.addEventListener("click", function (event) {
    validateForm();
});

// Initial Execution
setCookies();


