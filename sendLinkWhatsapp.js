async function sendLinkWhatsapp(){

var url_params = window.location.href;
var url = new URL(url_params);
let link = url.searchParams.get("origin");

const number = document.querySelector('[data-label="Whatsapp"]').value;

axios.post('https://api2.kemosoft.com.br/api:workflow/sendWhatsappMessage', {
    whatsapp : '55'+(number.replace(/\D/g, "")),
    link: link
})
.then(function (response) {
    console.log(response);
})
.catch(function (error) {
    console.log(error);
}); 

}

var celularInput = document.querySelector('[data-label="Whatsapp"]');

celularInput.addEventListener("input", (function() {
    var e = celularInput.value;
    e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{2})(\d)/, "($1) $2")).replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3"), celularInput.value = e
}));