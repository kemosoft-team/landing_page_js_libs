var federalId = document.querySelector('[data-label="CPF"]'),
    phone = document.querySelector('[data-label="Whatsapp"]'),
    birth = document.querySelector('[data-label="Data de Nascimento"]');
if(federalId){
federalId.setAttribute("inputmode", "numeric"), phone.setAttribute("inputmode", "numeric"), birth.setAttribute("inputmode", "numeric"), federalId.addEventListener("input", (function() {
    var e = federalId.value;
    e = (e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d{1,2})$/, "$1-$2"), federalId.value = e
}));
}
if(phone){phone.addEventListener("input", (function() {
    var e = phone.value;
    e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{2})(\d)/, "($1) $2")).replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3"), phone.value = e
}));
}
if(birth){birth.addEventListener("input", (function() {
    var e = birth.value;
    e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 8)).replace(/(\d{2})(\d)/, "$1/$2")).replace(/(\d{2})(\d)/, "$1/$2"), birth.value = e
}));
}