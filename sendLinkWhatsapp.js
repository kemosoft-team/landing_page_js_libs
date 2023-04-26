async function sendLinkWhatsapp(){

var url_params = window.location.href;
var url = new URL(url_params);
let link = url.searchParams.get("origin");

const number = document.querySelector('[data-label="Whatsapp"]').value;

axios.post('https://api2.kemosoft.com.br/api:workflow/sendWhatsappMessage', {
    whatsapp : '55'+number,
    link: link
})
.then(function (response) {
})
.catch(function (error) {
    console.log(error);
}); 

}