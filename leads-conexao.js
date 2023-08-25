///get cookies
function getCookie(name) {

    let cookie = {};

    document.cookie.split(';').forEach(function (el) {
        let [k, v] = el.split('=');
        cookie[k.trim()] = v;
    })

    return cookie[name];
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
                ipinfo['af'] = 'dfsAeGX6FAKNyJz97';
                ipinfo['bid'] = '23';
                ipinfo['oid'] = '27';
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

//showToast
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}

//registerCustomer
async function registerCustomer(name, federalId, phone, email) {
    
    const cleanedPhone = phone.replace(/[^\d]/g, '');

    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';

    axios.post('https://api.consigmais.com.br/signup/affiliate/register', {
        "name": name,
        "federalId": federalId,
        "mainEmail": email,
        "phone": cleanedPhone, 
        "referrerCode":"kmirnJiDLMZFNqaa7",
        "terms":true        
    },

        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'X-Client': getCookie('client_origin')
            }
        })
        .then((response) => {
            window.location.href = 'https://conexaosummer.kemobuilder.site/info';
        })

        .catch(function (error) {
            button.removeAttribute('disabled');
            spinner.classList.add('brz-invisible');
            span.textContent = 'CADASTRAR AGORA!';
            showToast(error.response.data.message);
        });
}


const buttonSubmit = document.querySelector(".brz-btn-submit");
buttonSubmit.addEventListener("click", function (event) {
    validateForm();
});



//validar form
function validateForm() {

    const name = document.querySelector('[data-label="Nome"]').value;
    const phone = document.querySelector('[data-label="Whatsapp"]').value;
    const email = document.querySelector('[data-label="Email"]').value;
    const federalId = document.querySelector('[data-label="CPF/CNPJ"]').value;

    if (name == "" || federalId == "" || phone == "" || email == "") {
        showToast("Por favor, preencha todos os campos.");
        return false;
    }

    registerCustomer(name, federalId, phone, email);
}



setCookies();
