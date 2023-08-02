 var popUpClose = document.getElementById('popUpClose');
    var stateItems = document.querySelectorAll('.btnState');

    stateItems.forEach(function (e) {
      e.addEventListener('click', function () {
        popUpClose.click();
      });
    });

    window.onload = function () {
      var stateItems = document.querySelectorAll('#stateItems');
      var selectedCity = document.querySelectorAll('#selected-city');
      var state = document.querySelectorAll('#state');
      var insucessPopUp = document.getElementById('insucess');
      var ArrayConvenios;

      fetch('https://ipapi.co/json/')
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var code = data.region_code;
          var stateName = data.region;
          selectedCity.forEach(function (item) {
            item.textContent = code;
          });

          state.forEach(function (item) {
            item.textContent = stateName;
          });

          axios.get('https://api2.kemosoft.com.br/api:workflow/conveniomastergov')
            .then(response => {
              const data = response.data;

              if (Array.isArray(data)) {
                ArrayConvenios = data.map(convenios => {
                  return {
                    nome: convenios.name,
                    prazo: convenios.prazo,
                    idadeMinima: convenios.idadeMinima,
                    idadeMaxima: convenios.idadeMaxima,
                    percentualMargemSaque: convenios.percentualMargemSaque,
                  };
                });

                stateItems.forEach(item => {
                  const cityName = item.textContent;
                  const convenioEncontrado = ArrayConvenios.some(convenio => convenio.nome === cityName);
                  item.style.display = convenioEncontrado ? 'block' : 'none';
                });

                showConvenio(ArrayConvenios, code);
              } else {
                console.log('Resposta da API inválida. Não foi possível obter as informações do convênio.');
                insucessPopUp.click();
              }
            })
            .catch(error => {
              console.error('Erro ao obter as informações do convênio:', error);
              insucessPopUp.click();
            });
        })
        .catch(function (error) {
          console.log('Ocorreu um erro ao obter a localização do IP:', error);
          insucessPopUp.click();
        });

      function showConvenio(ArrayConvenios, city) {
        var informacoesConvenio = ArrayConvenios.find(function (infos) {
          return infos.nome === city;
        });

        if (informacoesConvenio) {
          var prazoElement = document.getElementById("prazo");
          var minIdadeElement = document.getElementById("idadeMinima");
          var maxIdadeElement = document.getElementById("idadeMaxima");
          var percentualElement = document.getElementById("percentualMargemSaque");

          prazoElement.textContent = informacoesConvenio.prazo;
          minIdadeElement.textContent = informacoesConvenio.idadeMinima;
          maxIdadeElement.textContent = informacoesConvenio.idadeMaxima;
          percentualElement.textContent = informacoesConvenio.percentualMargemSaque;
        } else {
          insucessPopUp.click();
        }
      }

      function insucessPopUp() {
        var insucess = document.getElementById('insucess');
        insucess.style.display = 'block';
      }

      stateItems.forEach(function (item) {
        item.addEventListener('click', function () {
          var cityName = item.textContent;

          selectedCity.forEach(function (item) {
            item.textContent = cityName;
          });

          state.forEach(function (item) {
            item.textContent = cityName;
          });

          showConvenio(ArrayConvenios, cityName);
        });
      });
    };
