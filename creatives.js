async function getContactBrandInfo(){

    var url_params = window.location.href;
    var url = new URL(url_params);
    let offer = url.searchParams.get("bid"); 

    axios.get('https://api2.kemosoft.com.br/api:workflow/creatives', {
        offerId: "25"
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    }); 
  
  }