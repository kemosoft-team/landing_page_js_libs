var url_params = window.location.href;
var url = new URL(url_params);
let bid = url.searchParams.get("bid");
let oid = url.searchParams.get("oid");

axios.post("https://api.consigmais.com.br/server/lp/main/v2/getBrandInfo", { brandId: bid })
        .then(function (e) {
                
                var t  = '';
                var a = null != e.data.brandLogoDark && window.isWhiteMode ? e.data.brandLogoDark : e.data.brandLogo;
                var o = e.data;

                switch (oid) {
                        //BMG
                        case '18':
                          t = '<footer>'+
                                '<div class="logo" style="width: -webkit-fill-available; text-align: center;">'+
                                '<img src="'+ a +'" alt="Logo" style="width:60%; max-width:150px; margin-top: 20px;"></div>'+
                                '<div class="terms">'+
                                '<p style="text-align: justify; padding: 20px">1. Sujeito à análise de crédito e incidência de encargos. 2. As parcelas antecipadas serão pagas anualmente,'+
                                'no mês em que seria efetuado o saque aniversário, mediante repasse do valor pela CEF ao banco BMG. 3. Necessário'+
                                'aderir à modalidade Saque Aniversário do FGTS e autorizar o banco BMG no APP oficial do FGTS ou pelo site da CEF.'+
                                '4 Produto oferecido pela Consigmais, intermediador financeiro Banco BMG, '+ o.address +', CNPJ '+ o.federalId +'.</p>'+
                                '<p class="footer links" style="text-align: center;"><a style="color:#fff" href="https://api.consigmais.com.br/terms/">Termos de Uso</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="color:#fff" href="https://api.consigmais.com.br/privacy/">Politicas de Privacidade</a></p>'+
                                '</div>'+
                                '</footer>';
                          break;
                        //Banco Master
                        case '29':
                          t = 'master_correspondente.png';
                          break;
                        //Default
                        default:
                          t = '<p class="footer" style="text-align: center;">Este produto está sendo oferecido pela intermediadora financeira:</p><br>' +
                          '<div style="display: flex;justify-content: center; align-items: center;"><img style="width:100%; max-width:200px;" src="' + a + '" alt="Logomarca ' + o.brandName + '"></div><br>' +
                          '<p class="footer terms" style="text-align: center;">Todos os direitos reservados. Todo conteúdo do site, logotipos, marcas, layout, aqui veiculados são de propriedade exclusiva. É vedada qualquer reprodução, total ou parcial, de qualquer elemento de identidade, sem expressa autorização. A violação de qualquer direito mencionado implicará na responsabilização civil e criminal nos termos da Lei.</p>' +
                          '<p class="footer links" style="text-align: center;"><a style="color:#fff" href="https://api.consigmais.com.br/terms/">Termos de Uso</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="color:#fff" href="https://api.consigmais.com.br/privacy/">Politicas de Privacidade</a></p>' +
                          '<p class="footer address" style="text-align: center;">' + o.address + '</p>' +
                          '<p class="footer federalid" style="text-align: center;">CNPJ:  ' + o.federalId + '</p>';
                          break;
                      }

                document.getElementById("footer").innerHTML = t;
        })
        .catch(function (e) {
                console.log(e);
        });

