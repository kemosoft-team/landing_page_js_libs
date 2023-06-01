//API url
let apiBaseUrl = 'https://api.consigmais.com.br/lp/main/v2/';
let stepsUrl = 'https://kardbank.kemobuilder.site/';

// obtem o cookie pelo nome 
function getCookie(name) {

  let cookie = {};

  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    cookie[k.trim()] = v;
  })

  return cookie[name];
}

//inicia spin loading no button
function setLoading(){
    button.setAttribute('disabled', true);
    spinner.classList.remove('brz-invisible');
    span.textContent = '';
}

//para spin loading no button
function stopLoading(textButton){
  button.removeAttribute('disabled');
  spinner.classList.add('brz-invisible');
  span.textContent = textButton;
}


function redirectToNextStep(res) {

  const nextStep = res.nextStep;

  switch (nextStep) {
    case 'signature':
      window.location.href = stepsUrl + nextStep + '?' + encodeURIComponent(JSON.stringify(res.formalizatioLink));
      break;
    case 'scheduled':
      window.location.href = stepsUrl + nextStep + '?' + encodeURIComponent(JSON.stringify(res.scheduledTo));
      break;
    default:
      window.location.href = stepsUrl + nextStep;
      break;
  }
}

function setNextStep() {

    axios.post(apiBaseUrl+'getTokenStatus', {}, {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }})
      .then(function (response) {
        window.location.href = stepsUrl+response.data.nextStep;
      })
      .catch(function (error) {
          console.log(error);
      }); 
}

  //getCurrentStep
function getCurrentStep(){
    const path = window.location.pathname;
    const value = path.split('/')[1];
    return value;
  }

//showToast
function showToast(text) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = text;
    setTimeout(function(){ x.className = x.className.replace("show", `${text}`); }, 3000);
}

//setBanks
function setBanks(bankList){
  
    bankList.reverse();
    const selects = document.querySelectorAll('select[data-label="Banco"]');
    
    selects.forEach(select => {
  
      bankList.forEach(bank => {
        const option = document.createElement('option');
        option.text = bank.name;
        option.value = bank.bankNo;
        select.insertBefore(option, select.firstChild);
  
      });
    });
  }
  
  //obtem os bancos
  async function getBanks(){
      
    axios.post(apiBaseUrl+'getData', {"object":"banks"}, {
      headers: {
        'Authorization': `Bearer ${getCookie('tkn')}`
      }})
      .then(function (response) {
         setBanks(response.data);
      })
      .catch(function (error) {
          console.log(error);
      }); 
  }



//registerCustomerAccount
async function registerCustomerAccount(agency, bank, account, verifyDigit, accountType) {

  const button = document.querySelector('.brz-btn-submit');
  const spinner = button.querySelector('.brz-form-spinner');
  const span = button.querySelector('.brz-span.brz-text__editor');

  button.setAttribute('disabled', true);
  spinner.classList.remove('brz-invisible');
  span.textContent = '';

  axios.post(apiBaseUrl+'registerCustomerInfos', {
    branchNo: agency,
    bankId: bank,
    acctNo: `${account}-${verifyDigit}`,
    acctType: accountType,
    currentStep: getCurrentStep()
  },
  {
    headers: {
      'Authorization': `Bearer ${getCookie('tkn')}`
    }})
  .then((response) => {
    redirectToNextStep(response.data);
  })
  .catch(function (error) {
      button.removeAttribute('disabled');
      spinner.classList.add('brz-invisible');
      span.textContent = 'Simular';
      showToast(error.response.data.message);
  }); 

  }

  function getNextStep(){

    const button = document.querySelector('.brz-btn-submit');
    const spinner = button.querySelector('.brz-form-spinner');
    const span = button.querySelector('.brz-span.brz-text__editor');

    axios.post(apiBaseUrl+'getNextStep', {}, 
    {
      headers: {
        'Authorization': `${getCookie('tkn')}`
      }
    })
    .then((response) => {

      if(response.data.nextStep == 'noBalance' || response.data.nextStep == 'authorize' || response.data.nextStep == 'enable'){

          window.location.href = stepsUrl+response.data.nextStep;

      }else{

        var elementsWait = document.getElementsByClassName('wait');
        var elementsSuccess = document.getElementsByClassName('success');

        for (var i = 0; i < elementsWait.length; i++) {
          elementsWait[i].style.display = 'none';
          elementsSuccess[i].style.display = 'block';
        }

        button.removeAttribute('disabled');
        spinner.classList.add('brz-invisible');
        span.textContent = 'Dê o próximo passo, preencha seus dados';
        
        button.addEventListener('click', function() {
              window.location.href = stepsUrl+response.data.nextStep;
        });
      }

      })
      .catch(function (error) {
      });
  
  }

  function validarFormAccount(){ 

    const agency = document.querySelector('[data-label="Agência"]').value;
    const bank = document.querySelector('[data-label="Banco"]').value;
    const account = document.querySelector('[data-label="Conta"]').value;
    const verifyDigit = document.querySelector('[data-label="Dígito"]').value;
    const accountType = document.querySelector('[data-label="Tipo de conta"]').value;

    if (agency == "" || bank == "" || account == "" || verifyDigit =="" || accountType =="") {
      showToast("Por favor, preencha todos os campos.");
      return false;
    }

    const  accountTypeCut = accountType.charAt(0).toString();
    registerCustomerAccount(agency, bank, account, verifyDigit, accountTypeCut);
  }

