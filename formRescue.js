//======FORMULARIO DE RESGATE========

// ABRIR FOMULARIO AO TIRAR O MOUSE DA TELA
var statusPopUp = false;

var btnOut = document.querySelector('#btnOut');
document.addEventListener("mouseout", function (event) {
  if (event.clientY <= 0 && statusPopUp === false) {
    btnOut.click();
    statusPopUp = true;
  }
});

var btnRequestForm = document.querySelector('#btnRequestForm');
var btnWillOpenForm = document.querySelector('#btnWillOpenForm');

btnRequestForm.addEventListener('click', function () {
  btnWillOpenForm.click();
});

var scrollThreshold = Math.floor(0.75 * (document.documentElement.scrollHeight - document.documentElement.clientHeight));
var isScrolling = false;

window.addEventListener('scroll', function () {
  if (!isScrolling && window.scrollY >= scrollThreshold && statusPopUp === false) {
    isScrolling = true;
    statusPopUp = true;
  }
});

window.addEventListener('scroll', function () {
  if (isScrolling && window.scrollY <= 100 && statusPopUp === false) {
    isScrolling = false;
    btnWillOpenForm.click();
    statusPopUp = true;
  }
});

var btnClosers = document.querySelectorAll('#btnCloser');

btnClosers.forEach(function (btnCloser) {
  btnCloser.addEventListener('click', function () {
    statusPopUp = false;
    console.log(statusPopUp);
  });
});
