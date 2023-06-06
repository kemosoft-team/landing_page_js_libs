//======FORMULARIO DE RESGATE========
//ABRIR FOMULARIO AO TIRAR O MOUSE DA TELA
// #btnOut é o botão que vai ser clicado ao tirar o mouse da tela
var statusPopUp = false;

var btnCloser = document.querySelectorAll('#btnCloser');

btnCloser = document.addEventListener("click", function () {
    statusPopUp = true;
})


btnOut = document.querySelector('#btnOut');
document.addEventListener("mouseout", function (event) {
    if (event.clientY <= 0 && statusPopUp === false) {
        btnOut.click();
        statusPopUp = true;
    }
});

btnRequestForm = document.querySelector('#btnRequestForm');
btnWillOpenForm = document.querySelector('#btnWillOpenForm');

btnRequestForm.addEventListener('click', function () {
    statusPopUp = true;
    btnWillOpenForm.click();
})

//ABRIR FORMULARIO QUANDO DESCER PELO MENOS 75% DA TELA E SUBIR NOVAMENTE
var scrollThreshold = Math.floor(0.75 * (document.documentElement.scrollHeight - document.documentElement.clientHeight));
var isScrolling = false;

//SE SCROLL PASSAR DE 75%
window.addEventListener('scroll', function () {
    if (!isScrolling && window.scrollY >= scrollThreshold) {
        isScrolling = true;
    }
});

//SE VOLTAR PARA TOP MENOR QUE 100
window.addEventListener('scroll', function () {
    if (isScrolling && window.scrollY <= 100 && statusPopUp === false) {
        isScrolling = false;
        statusPopUp = true;
        btnWillOpen.click()
    }
});

console.log(statusPopUp);
