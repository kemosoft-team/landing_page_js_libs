window.onload = function () {
  var stateItems = document.querySelector('#stateItems');
  var selectedCity = document.querySelectorAll('#selected-city');
  var state = document.querySelectorAll('#state');

  fetch('http://localhost:3000/convenios')
    .then(response => response.json())
    .then(data => {
        
        var convenio = data.convenio; 

      if (convenio.some(item => item.convenio === stateItems.innerText)) {
        stateItems.style.display = 'block';
      } else {
        stateItems.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Erro ao obter os dados do convênio:', error);
    });

    function showConvenio(city) {
      var informacoesConvenio = convenio.find(function (info) {
        return info.convenio === city;
      });
  
      if (informacoesConvenio) {
        var limiteSaqueMaximoElement = document.getElementById("limiteSaqueMaximo");
        var limiteCompraElement = document.getElementById("limiteCompra");
        var taxaJurosElement = document.getElementById("taxaJuros");
        var margemCartaoBeneficioElement = document.getElementById("margemCartaoBeneficio");
  
        limiteSaqueMaximoElement.textContent = informacoesConvenio.limiteSaqueMaximo;
        limiteCompraElement.textContent = informacoesConvenio.limiteCompra;
        taxaJurosElement.textContent = informacoesConvenio.taxaJuros;
        margemCartaoBeneficioElement.textContent = informacoesConvenio.margemCartaoBeneficio;
      } else {
        var insucessPopUp = document.getElementById('insucess');
        insucessPopUp.click();
      }
    }
    fetch('https://ipapi.co/json/')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var code = data.region_code;
        var stateName = data.region;
        selectedCity.forEach(function(item){
          item.textContent = code;
        })
        
        state.forEach(function (item) {
          item.textContent = stateName;
        });
  
        showConvenio(code);
      })
      .catch(function (error) {
        console.log('Ocorreu um erro ao obter a localização do IP:', error);
      });
  
  
    stateItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var cityName = item.textContent;
        
        selectedCity.forEach(function(item){
          item.textContent = cityName;
        })
        
        state.forEach(function (item) {
          item.textContent = cityName;
        });
        showConvenio(cityName);
      });
    });
  };
