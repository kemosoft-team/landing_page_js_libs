//let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let apiBaseUrl = 'https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb';
let stepsUrl = 'https://infos.faz.vc/';
const oid = '?oid=11';


function redirectToNextStep(n) {
  window.location.replace(`${stepsUrl + oid}`);
}

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
                ipinfo['af'] = 'Vv5P88AWTr7qsU8v8';
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


//setar token
function handleSetToken(value){
    // console.log("handleToken");
    document.cookie = `tkn=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=.faz.vc; path=/;`;
  }

//obtem o step atual pela url
function getCurrentStep(){
    const path = window.location.pathname;
    const value = path.split('/')[1];
    return value;
}

  //get Token Status info-return
  function getTokenStatus(){

    if(getCookie('tkn')){
  
    axios.post(apiBaseUrl+'/getTokenStatus', {}, {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }})
      .then(function (response) {
        
        const link = document.querySelector('a.btn-continue');
        link.setAttribute('href', 'https://infos.faz.vc/'+response.data.nextStep);

         document.getElementById("info-return").innerHTML = `<p class="p-info-return">${response.data.message}</p>`;
         var botao = document.querySelector(".btn-lead-info");
         botao.click();

      })
      .catch(function (error) {
          console.log(error);
      }); 
    }
  }


function captureAffiliateData(){

      const urlParams = new URLSearchParams(window.location.search);

      let affiliateData = {

        affiliateCode: urlParams.get('af') || null,
        source: urlParams.get('source') || null,
        productId: urlParams.get('pid') || null,
        vendorId: urlParams.get('vid') || null,
        offerId: urlParams.get('oid') || null,
        clickId : urlParams.get('cid') || null,
        pixelId: urlParams.get('afx') || null,
        gtmId: urlParams.get('afgtm') || null,
        latDays: urlParams.get('latd') || null,
        brandId : urlParams.get('bid') || null,
        nextStep : urlParams.get('nxstp') || null,
        token: urlParams.get('tkn') || null,
        rawUri: window.location.search
    };
      return affiliateData;
}


// registerCustomer
async function registerCustomer(name, federalId, phone, birth, email) {
  const affiliate = captureAffiliateData();

  const button = document.querySelector('.btn-submit-fgts');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  //axios.post(apiBaseUrl + '/registerCustomer', {
    axios.post(apiBaseUrl, {
      name: name,
      birth: birth,
      federalId: federalId,
      phone: phone,
      email: email,
      useTerms: true,
      dataPrivacy: true,
      dataSearchAllowed: true,
      affiliateData: affiliate,
    }),

    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'X-Client': getCookie('client_origin')
      }
    }
    
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

// validateForm
function validateForm() {
  const name = document.querySelector('[data-label="Nome"]').value;
  const federalId = document.querySelector('[data-label="CPF"]').value;
  const phone = document.querySelector('[data-label="Whatsapp"]').value;
  const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
  const email = document.querySelector('[data-label="Email"]').value;

  if (name == "" || federalId == "" || phone == "" || birth == "" || email == "") {
    showToast("Por favor, preencha todos os campos.");
    return false;
  }

  registerCustomer(name, federalId, phone, birth, email);
}

const buttonSubmit = document.querySelector(".brz-btn-submit");
buttonSubmit.addEventListener("click", validateForm);


//showToast
function showToast(text) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  document.getElementById("snackbar").innerHTML = text;
  setTimeout(function () { x.className = x.className.replace("show", `${text}`); }, 3000);
}

  getTokenStatus();
  setCookies();









