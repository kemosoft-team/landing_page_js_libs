///get cookies
function getCookie(name) {

    let cookie = {};
  
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
  
    return cookie[name];
  }

//seta cookies
function setCookies(latDays){

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

        document.cookie = "client_origin="+encodeURIComponent(JSON.stringify(ipinfo))+"; expires=" + expirationDate.toUTCString() + "; path=/;";
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
    setTimeout(function(){ x.className = x.className.replace("show", `${text}`); }, 3000);
  }

//registerCustomer
async function registerCustomer(name, phone, email){

    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
  
    axios.post('https://api2.kemosoft.com.br/api:lp/offer-request-start', {
      "name": name,
      "phone": phone,
      "email": email
    },
    {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'X-Client': getCookie('client_origin')
    }
      })
    .then((response) => {
      window.location('https://summersessions.kemobuilder.site')
    })
    .catch(function (error) {
        button.removeAttribute('disabled');
        spinner.classList.add('brz-invisible');
        span.textContent = 'CADASTRAR';
        showToast(error.response.data.message);
    }); 
}


//validar form
function validateForm(){ 

    const name = document.querySelector('[data-label="Nome"]').value;
    const phone = document.querySelector('[data-label="Whatsapp"]').value;
    const email = document.querySelector('[data-label="Email"]').value;
  
    if (name == "" || phone == "" || email == "") {
      showToast("Por favor, preencha todos os campos.");
      return false;
    }
  
    registerCustomer(name, phone, email);
  }



setCookies();