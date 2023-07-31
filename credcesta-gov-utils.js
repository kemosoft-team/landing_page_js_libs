window.onload = function () {
  var stateItems = document.querySelectorAll('#stateItems');
  var selectedCity = document.querySelectorAll('#selected-city');
  var state = document.querySelectorAll('#state');

  var convenio = [
    {
      convenio: "BA",
      limiteSaqueMaximo: "98x",
      limiteCompra: "12x",
      taxaJuros: "4,72%",
      margemCartaoBeneficio: "30%"
    },
    {
      convenio: "MS",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "5,50%",
      margemCartaoBeneficio: "5%"
    },
    {
      convenio: "AM",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "3,80%",
      margemCartaoBeneficio: "20%"
    },
    {
      convenio: "MA",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "5,50%",
      margemCartaoBeneficio: "20%"
    },
    {
      convenio: "PE",
      limiteSaqueMaximo: "48x",
      limiteCompra: "12x",
      taxaJuros: "4,04%",
      margemCartaoBeneficio: "8%"
    },
    {
      convenio: "PI",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "4,68%",
      margemCartaoBeneficio: "10%"
    },
    {
      convenio: "MG",
      limiteSaqueMaximo: "72x",
      limiteCompra: "12x",
      taxaJuros: "4,99%",
      margemCartaoBeneficio: "10%"
    },
    {
      convenio: "PR",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "4,30%",
      margemCartaoBeneficio: "10%"
    },
    {
      convenio: "RJ",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "5,50%",
      margemCartaoBeneficio: "20%"
    },
    {
      convenio: "SC",
      limiteSaqueMaximo: "96x",
      limiteCompra: "36x",
      taxaJuros: "4,72%",
      margemCartaoBeneficio: "10%"
    },
    {
      convenio: "SP",
      limiteSaqueMaximo: "96x",
      limiteCompra: "12x",
      taxaJuros: "4,60%",
      margemCartaoBeneficio: "10%"
    }
  ];


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
