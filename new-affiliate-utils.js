//showToast
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function(){ x.className = x.className.replace("show", `${text}`); }, 3000);
  }

//registerAffiliate
async function registerAffiliate(name, federalId, zipcode, phone, email){

    var url_params = window.location.href;
    var url = new URL(url_params);
    var brand = window.location.pathname; 

    let referrer = (url.searchParams.get("af") == null) ? (window.location.pathname == "/novo-afiliado-homeofficealianca" ? "A6jsrGZdqUAxKRXJA" : "Vv5P88AWTr7qsU8v8") : url.searchParams.get("af");

    console.log(referrer);

    const button = document.querySelector('.btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
  
    axios.post('https://api.consigmais.com.br/signup/affiliate/register', {
      "name": name,
      "birth": null,
      "federalId": federalId,
      "mainEmail": email,
      "zipcode": zipcode.replace(/[^\w\s]/gi, '').replace(/\s/g, ''),
      "phone": phone.replace(/[^\w\s]/gi, '').replace(/\s/g, ''),
      "referrerCode": referrer,
      "terms":true
    })
    .then((response) => {

        var sectionS = document.getElementById("succes");
        var sectionR = document.getElementById("register");
        
        sectionR.style.opacity = "0"; 
        sectionR.style.pointerEvents = "none"; 
        
        sectionR.style.transition = "opacity 0.3s ease-out";
        sectionS.style.transition = "opacity 0.3s ease-in";
        

        setTimeout(function() {
          sectionR.style.display = "none";
          sectionR.style.opacity = "1"; 
          sectionR.style.pointerEvents = "auto"; 
        
          sectionS.style.display = "block";
          sectionS.style.opacity = "1"; 
        }, 300);

        document.documentElement.scrollTop = 0; // Para navegadores modernos
        document.body.scrollTop = 0; // Para navegadores mais antigos

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

    var name = document.querySelector('[data-brz-label="Nome ou Nome fantasia"]').value;
    var phone = document.querySelector('[data-brz-label="Whatsapp"]').value;
    var email = document.querySelector('[data-brz-label="Email"]').value;
    var zipcode = document.querySelector('[data-brz-label="CEP"]').value;
    var federalId = document.querySelector('[data-brz-label="CNPJ"]').value;

        if (name == "" || phone == "" || federalId =="" || zipcode == "") {
            showToast("Por favor, preencha todos os campos.");
            return false;
          }

    }
  
    registerAffiliate(name, federalId, zipcode, phone, email);
  }

  if(window.location.pathname == '/novo-afiliado' || window.location.pathname == '/novo-afiliado-homeofficeconfianca'){
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
