            var url_params = window.location.href;
                var url = new URL(url_params);
                let data = url.searchParams.get("bid");

                axios.post("https://api.consigmais.com.br/server/lp/main/v2/getBrandInfo", { brandId: data })
                        .then(function (e) {
                                const a = null != e.data.brandLogoDark && window.isWhiteMode ? e.data.brandLogoDark : e.data.brandLogo;
                                const o = e.data;
                                const t = '<p class="footer" style="text-align: center;">Este produto está sendo oferecido pela intermediadora financeira:</p><br>' +
                                        '<div style="display: flex;justify-content: center; align-items: center;"><img style="width:100%; max-width:200px;" src="' + a + '" alt="Logomarca ' + o.brandName + '"></div><br>' +
                                        '<p class="footer terms" style="text-align: center;">Todos os direitos reservados. Todo conteúdo do site, logotipos, marcas, layout, aqui veiculados são de propriedade exclusiva. É vedada qualquer reprodução, total ou parcial, de qualquer elemento de identidade, sem expressa autorização. A violação de qualquer direito mencionado implicará na responsabilização civil e criminal nos termos da Lei.</p>' +
                                        '<p class="footer links" style="text-align: center;"><a style="color:#fff" href="https://api.consigmais.com.br/terms/">Termos de Uso</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="color:#fff" href="https://api.consigmais.com.br/privacy/">Politicas de Privacidade</a></p>' +
                                        '<p class="footer address" style="text-align: center;">' + o.address + '</p>' +
                                        '<p class="footer federalid" style="text-align: center;">CNPJ:  ' + o.federalId + '</p>';

                                document.getElementById("footer").innerHTML = t;
                        })
                        .catch(function (e) {
                                console.log(e);
                        });

