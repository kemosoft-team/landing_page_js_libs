//======FORMULARIO DE RESGATE========
//ABRIR FOMULARIO AO TIRAR O MOUSE DA TELA
// #btnOut é o botão que vai ser clicado ao tirar o mouse da tela
btnOut = document.querySelector('#btnOut');
document.addEventListener("mouseout", function (event) {
    if (event.clientY <= 0) {
        btnOut.click();
    }
});

btnRequestForm = document.querySelector('#btnRequestForm');
btnWillOpenForm = document.querySelector('#btnWillOpenForm');

btnRequestForm.addEventListener('click', function () {
    btnWillOpenForm.click();
})

//ABRIR FORMULARIO QUANDO DESCER PELO MENOS 75% DA TELA E SUBIR NOVAMENTE
var scrollThreshold = Math.floor(0.75 * (document.documentElement.scrollHeight - document.documentElement.clientHeight));
var isScrolling = false;

//SE SCROLL PASSAR DE 75%
window.addEventListener('scroll', function () {
    if (!isScrolling && window.scrollY >= scrollThreshold) {
        isScrolling = true;
        console.log(isScrolling)
    }
});

//SE VOLTAR PARA TOP MENOR QUE 100
window.addEventListener('scroll', function () {
    if (isScrolling && window.scrollY <= 100) {
        isScrolling = false;
        console.log(isScrolling)
        btnWillOpen.click()
    }
});

//ABRIR FORMULARIO QUANDO O USUARIO PASSAR MAIS DE 2 SEGUNDOS SEM INTERAGIR COM A PAGINA
var time = 12000;

var timeoutId;

function resetTimeOut() {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(dispararEvento, time);
}

function dispararEvento() {
    btnWillOpen.click()
}

window.addEventListener('mousemove', resetTimeOut);
window.addEventListener('keydown', resetTimeOut);
window.addEventListener('mousedown', resetTimeOut);
window.addEventListener('scroll', resetTimeOut);

resetTimeOut();