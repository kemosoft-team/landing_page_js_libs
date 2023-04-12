let baseUrl = 'https://api.consigmais.com.br/lp/main/v2';
let registerCustomerUrl = 'https://api2.kemosoft.com.br/api:lp/offer-request-start';
let whatsappNumber = '558440420474';

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

async function getIpInfo(){

    axios.get('https://ipinfo.io/json')
    .then(function (response) {
      return response;
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
      
        const ip = response.ip;
        const hostname = response.hostname;
        const city = response.city;
        const region = response.region;
        const country = response.country;
        const loc = response.loc;
        const org = response.org;

        var ipinfo = `&ip=${ip}&hostname=${hostname}&city=${city}&region=${region}&country=${country}&loc=${loc}&org=${org}`;
    
        const urlParams = new URLSearchParams(window.location.search);
        const paramsArray = [];
    
          for (const [key, value] of urlParams.entries()) {
              paramsArray.push({ name: key, value: value });
          }
    
        var expirationDays = latDays || 7;
        var expirationDate = new Date();
        
        expirationDate.setTime(expirationDate.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    
        paramsArray.forEach(param => {
          document.cookie = param.name + "=" + param.value + "; expires=" + expirationDate.toUTCString() + "; path=/;";
        });
    
        document.cookie = "client_origin="+JSON.stringify(ipinfo)+"; expires=" + expirationDate.toUTCString() + "; path=/;";
        captureAffiliateData();
    })
    .catch(function (error) {
        console.log(error);
    }); 

    
  
      }


  function captureAffiliateData(){

    if (document.cookie) {
  
        let affiliateData = {
            affiliateCode: getCookie('af') || null,
            source: getCookie('source') || null,
            productId: getCookie('pid') || null,
            vendorId: getCookie('vid') || null,
            offerId: getCookie('oid') || null,
            clickId : getCookie('cid') || null,
            pixelId: getCookie('afx') || null,
            gtmId: getCookie('afgtm') || null,
            latDays: getCookie('latd') || null,
            brandId : getCookie('bid') || null,
            nextStep : getCookie('nxstp') || null,
            token: getCookie('tkn') || null,
            rawUri: window.location.search
        };
    
        return affiliateData;
    }
  }

async function registerCustomer(name, birth, federalId, phone, email){

    axios.post(registerCustomerUrl, {
      "name": name,
      "birth": birth,
      "federalId": federalId,
      "phone": phone,
      "email": email,
      "useTerms":true,
      "dataPrivacy":true,
      "dataSearchAllowed":true,
      "affiliateData" : captureAffiliateData()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'X-Client': encodeURIComponent(window.location.href+getCookie('client_origin'))
      }
    })
    .then((response) => {
      redirectToWhatsApp();
    })
    .catch(function (error) {
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
    //get status pelo token
    if (getCookie('tkn') != null) { getTokenStatus() };
    //verifica se tem cookie, caso positivo prepara o affiliateData senao pega da url e prepara o affiliateData
    document.cookie ? captureAffiliateData() : setCookies()