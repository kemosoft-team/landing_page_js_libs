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
    let referrer = url.searchParams.get("af") == null ? url.searchParams.get("af") : "Vv5P88AWTr7qsU8v8";


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
      "phone": phone,
      "referrerCode": referrer,
      "terms":true
    })
    .then((response) => {

    })
    .catch(function (error) {
        button.removeAttribute('disabled');
        spinner.classList.add('brz-invisible');
        span.textContent = 'Aceita e Cadastrar';
        showToast(error.response.data.message);
    }); 
}

//validar form
function validateForm(){ 

    const name = document.querySelector('[data-label="Nome ou Nome fantasia"]').value;
    const phone = document.querySelector('[data-label="Whatsapp"]').value;
    const birth = document.querySelector('[data-label="Data de Nascimento"]').value;
    const email = document.querySelector('[data-label="Email"]').value;
    const zipcode = document.querySelector('[data-label="CEP"]').value;
    const federalId = document.querySelector('[data-label="CPF ou CNPJ"]').value;
  
    if (name == "" || phone == "" || birth == "" || federalId =="" || zipcode == "") {
      showToast("Por favor, preencha todos os campos.");
      return false;
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
        novoParagrafo.innerHTML = '<span class="terms" style="opacity: 1;">Ao continuar no botão abaixo você estará assegurando o tratamento responsável de suas informações, em conformidade com a LGPD vigente, e também: 1. Concordando com os <a href="https://api.consigmais.com.br/terms/" style="color: #646464" target="_blank">Termos de Uso</a> e de <a style="color: #646464" href="https://api.consigmais.com.br/privacy/" target="_blank">Privacidade</a> 2. Aceitando ser contatado por Whatsapp/SMS acerca desta minha consulta e solicitação, bem como autorizo ter meu CPF consultado junto às instituições bancárias e governamentais para assegurar a correta simulação / contratação deste produto.</span>';
        novaDiv.appendChild(novoParagrafo);

    let divPai = document.querySelector('.brz-forms2__item-button');
        divPai.insertAdjacentElement('beforebegin', novaDiv);
  }