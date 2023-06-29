//showToast
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function(){ x.className = x.className.replace("show", `${text}`); }, 3000);
  }

//registerAffiliate
async function registerAffiliate(name, birth, federalId, zipcode, phone, email){

    var url_params = window.location.href;
    var url = new URL(url_params);
    let referrer = (url.searchParams.get("af") == null) ? url.searchParams.get("af") : "Vv5P88AWTr7qsU8v8";

    console.log(referrer);

    const button = document.querySelector('.btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
  
    axios.post('https://api.consigmais.com.br/signup/affiliate/register', {
      "name": name,
      "birth": birth,
      "federalId": federalId,
      "mainEmail": email,
      "zipcode": zipcode,
      "phone": phone.replace(/[^\w\s]/gi, ''),
      "referrerCode": referrer,
      "terms":true
    })
    .then((response) => {

        var sectionS = document.getElementById("succes");
        var sectionR = document.getElementById("register");

        sectionR.style.display = "none";
        sectionS.style.display = "block";

    })
    .catch(function (error) {
        button.removeAttribute('disabled');
        spinner.classList.add('brz-invisible');
        span.textContent = 'Aceita e Cadastrar';
        showToast(error.response.data.msg);
    }); 
}

//validar form
function validateForm(){ 

    var name = document.querySelector('[data-label="Nome ou Nome fantasia"]').value;
    var phone = document.querySelector('[data-label="Whatsapp"]').value;
    var birth = document.querySelector('[data-label="Data de Nascimento"]').value;
    var email = document.querySelector('[data-label="Email"]').value;
    var zipcode = document.querySelector('[data-label="CEP"]').value;
    var federalId = document.querySelector('[data-label="CPF/CNPJ"]').value;

    if(federalId.length > 14){

        if (name == "" || phone == "" || federalId =="" || zipcode == "") {
            showToast("Por favor, preencha todos os campos.");
            return false;
          }

    }else{

        if (name == "" || phone == "" || birth == "" || federalId =="" || zipcode == "") {
            showToast("Por favor, preencha todos os campos.");
            return false;
          }

    }
  
    registerAffiliate(name, birth, federalId, zipcode, phone, email);
  }

  if(window.location.pathname == '/novo-afiliado'){
    //Adiciona termos e condições abaixo do formulário
    let novaDiv = document.createElement('div');
        novaDiv.classList.add('brz-rich-text');
        
    let novoParagrafo = document.createElement('p');
        novoParagrafo.classList.add('brz-css-bmkpa');
        novoParagrafo.setAttribute('data-generated-css', 'brz-css-gtmtp');
        novoParagrafo.style.fontSize = '11px';
        novoParagrafo.style.color = '#fff !important';
        novoParagrafo.style.textAlign = 'justify';
        novoParagrafo.style.padding = '0 13px 0 13px';
        novoParagrafo.style.wordWrap = 'break-word';
        novoParagrafo.innerHTML = '<span class="terms" style="opacity: 1;">Ao continuar no botão abaixo você estará assegurando o tratamento responsável de suas informações, em conformidade com a LGPD vigente, e também: 1. Concordando com os <a href="https://api.consigmais.com.br/terms/" style="color: #646464" target="_blank">Termos de Uso</a> e de <a style="color: #646464" href="https://api.consigmais.com.br/privacy/" target="_blank">Privacidade</a>.</span>';
        novaDiv.appendChild(novoParagrafo);

    let divPai = document.querySelector('.brz-forms2__item-button');
        divPai.insertAdjacentElement('beforebegin', novaDiv);
  }