let baseUrl = 'https://api.consigmais.com.br/lp/main/v2';

function getCookie(name) {

    let cookie = {};
  
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
  
    return cookie[name];
  }


  function redirectToWhatsApp(){

  }


  function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function(){ x.className = x.className.replace("show", `${text}`); }, 3000);
  }

  function setCookies(latDays){

    const ipInfoData = {
      userIpInfo : getIpInfo(),
      urlOrigin : window.location.href,
    }; 
  
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
  
      document.cookie = "client_origin="+JSON.stringify(ipInfoData)+"; expires=" + expirationDate.toUTCString() + "; path=/;";
      captureAffiliateData();
  
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
  
    axios.post(baseUrl+'/registerCustomer', {
      "name": name,
      "birth": birth,
      "federalId": federalId,
      "phone": phone,
      "email": email,
      "useTerms":true,
      "dataPrivacy":true,
      "dataSearchAllowed":true,
      "affiliateData" : captureAffiliateData()
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
        const phone = document.querySelector('[data-label="Celular"]').value;
        const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
        const federalId = document.querySelector('[data-label="CPF"]').value;
      
        if (name == "" || phone == "" || birth == "" || federalId =="") {
          showToast("Por favor, preencha todos os campos.");
          return false;
        }
      
        registerCustomer(name, birth, federalId, phone);
      }


    //get status pelo token
    if (getCookie('tkn') != null) { getTokenStatus() };
    //verifica se tem cookie, caso positivo prepara o affiliateData senao pega da url e prepara o affiliateData
    document.cookie ? captureAffiliateData() : setCookies()