let registerCustomerUrl = 'https://api2.kemosoft.com.br/api:lp/offer-request-start';
let whatsappNumber = '558440420474';

const button = document.querySelector('.brz-btn-submit');
const spinner = button.querySelector('.brz-form-spinner');

async function getContactBrandInfo(){

  var url_params = window.location.href;
  var url = new URL(url_params);
  let data = url.searchParams.get("bid"); 
  let af = url.searchParams.get("af"); 

  axios.post('https://api.consigmais.com.br/server/lp/main/v2/getBrandInfo', {
    brandId : data,
    affiliateCode: af
  })
  .then(function (response) {
      whatsappNumber = response.data.whatsapp;
  })
  .catch(function (error) {
      console.log(error);
  }); 

}

function getCookie(name) {

    let cookie = {};
  
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
  
    return cookie[name];
  }


  function redirectToWhatsApp(){
    window.open('https://api.whatsapp.com/send?phone='+whatsappNumber+'&text=Olá,%20solicitei%20uma%20simulação%20SIAPE%20e%20preciso%20de%20ajuda!', '_self');
  }


  function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function(){ x.className = x.className.replace("show", `${text}`); }, 3000);
  }

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

async function registerCustomer(name, birth, federalId, phone, email){

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');

    axios.post(registerCustomerUrl, {
      "name": name,
      "birth": birth,
      "federalId": federalId,
      "phone": phone,
      "email": email,
      "useTerms":true,
      "dataPrivacy":true,
      "dataSearchAllowed":true,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'X-Client': getCookie('client_origin')
      }
    })
    .then((response) => {
      redirectToWhatsApp();
    })
    .catch(function (error) {
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      showToast(error.response.data.message);
    }); 
    }

    function validateForm(){ 

        const name = document.querySelector('[data-label="Nome"]').value;
        const phone = document.querySelector('[data-label="Whatsapp"]').value;
        const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
        const federalId = document.querySelector('[data-label="CPF"]').value;
      
        if (name == "" || phone == "" || birth == "" || federalId =="") {
          showToast("Por favor, preencha todos os campos.");
          return false;
        }
      
        registerCustomer(name, birth, federalId, phone);
      }


    getContactBrandInfo();
    //verifica se tem cookie, caso positivo prepara o affiliateData senao pega da url e prepara o affiliateData
    setCookies();