//======FORMULARIO DE RESGATE========
//ABRIR FOMULARIO AO TIRAR O MOUSE DA TELA
// #btnOut é o botão que vai ser clicado ao tirar o mouse da tela
var statusPopUp = false;

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
        console.log(statusPopUp)
    }
});

//SE VOLTAR PARA TOP MENOR QUE 100
window.addEventListener('scroll', function () {
    if (isScrolling && window.scrollY <= 100 && statusPopUp === false) {
        isScrolling = false;
        statusPopUp = true;
        console.log(statusPopUp)
        btnWillOpen.click()
    }
});

var btnClosers = document.querySelectorAll('#btnCloser');

btnClosers.forEach(function(btnCloser) {
  btnCloser.addEventListener('click', function() {
    var statusPopUp = false;
    console.log(statusPopUp);
  });
});

console.log(statusPopUp);
