//setCookies client origin
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

      document.cookie = "client_origin="+encodeURIComponent(JSON.stringify(ipinfo))+"; expires=" + expirationDate.toUTCString() + "; domain=.faz.vc; path=/;";
  })
  .catch(function (error) {
      console.log(error);
  }); 
}

// obtem o cookie pelo nome 
function getCookie(name) {

    let cookie = {};
  
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
  
    return cookie[name];
  }

  setCookies();

