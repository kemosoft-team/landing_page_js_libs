//showToast
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function(){ x.className = x.className.replace("show", `${text}`); }, 3000);
  }

//registerCustomer
async function registerCustomer(name, phone, email){

    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
  
    axios.post('', {
      "name": name,
      "phone": phone,
      "email": email
    })
    .then((response) => {
      //url checkout
    })
    .catch(function (error) {
        button.removeAttribute('disabled');
        spinner.classList.add('brz-invisible');
        span.textContent = 'CADASTRAR';
        showToast(error.response.data.message);
    }); 
}


//validar form
function validateForm(){ 

    const name = document.querySelector('[data-label="Nome"]').value;
    const phone = document.querySelector('[data-label="Whatsapp"]').value;
    const email = document.querySelector('[data-label="Email"]').value;
  
    if (name == "" || phone == "" || email == "") {
      showToast("Por favor, preencha todos os campos.");
      return false;
    }
  
    registerCustomer(name, phone, email);
  }