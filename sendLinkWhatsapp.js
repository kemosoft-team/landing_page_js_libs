function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function(){ x.className = x.className.replace("show", `${text}`); }, 3000);
  }


async function sendLinkWhatsapp(){

var url = window.location.href;
let link = url.split("origin=")[1];

if(link == null){
    showToast("Esse link é invalido! Tente acessá-lo novamente.");
    return;
}

const number = document.querySelector('[data-label="Whatsapp"]').value;

axios.post('https://api2.kemosoft.com.br/api:workflow/sendWhatsappMessage', {
    whatsapp : '55'+(number.replace(/\D/g, "")),
    link: link
})
.then(function (response) {
    console.log(response);
})
.catch(function (error) {
    showToast(error.response.data.message);
}); 

}

var celularInput = document.querySelector('[data-label="Whatsapp"]');

celularInput.addEventListener("input", (function() {
    var e = celularInput.value;
    e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{2})(\d)/, "($1) $2")).replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3"), celularInput.value = e
}));