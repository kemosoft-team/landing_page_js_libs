
//ABRIR FOMULARIO COM OUTROS BOTÕES
// #btnRequest é o botão que vai ser realizado o clique 
// btnWillOpen é o botão que vai  abrir o formulario
var btnRequest = document.querySelectorAll('#btnRequest');
var btnWillOpen = document.getElementById('btnWillOpen');

btnRequest.forEach(function (button) {
    button.addEventListener('click', function () {
        btnWillOpen.click();
        statusPopUp = true;
    });
});

