// var url_params=window.location.href,url=new URL(url_params);let data=url.searchParams.get("bid");axios.post("https://api.consigmais.com.br/server/lp/main/v2/getBrandInfo",{brandId:data}).then((function(e){const a=e.data,o='<p class="footer" style="text-align: center;">Este produto está sendo oferecido pela</p><br><div style="display: flex;justify-content: center; align-items: center;"><img style="width:100%; max-width:200px;" src="'+a.brandLogo+'" alt="Logomarca '+a.brandName+'"></div><br><p class="footer terms" style="text-align: center;">Todos os direitos reservados. Todo conteúdo do site, logotipos,marcas, layout, aqui veiculados são de propriedade exclusiva. É vedada qualquer reprodução,total ou parcial, de qualquer elemento de identidade, sem expressa autorização. A violação de qualquer direito mencionado implicará na responsabilização civil e criminal nos termos da Lei.</p><p class="footer links" style="text-align: center;"><a style="color:#fff" href="https://api.consigmais.com.br/terms/">Termos de Uso</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="color:#fff" href="https://api.consigmais.com.br/privacy/">Politicas de Privacidade</a></p><p class="footer address" style="text-align: center;">'+a.address+'</p><p class="footer federalid" style="text-align: center;">'+a.federalId+"</p>";document.getElementById("footer").innerHTML=o})).catch((function(e){console.log(e)}));

var url_params = window.location.href,
    url = new URL(url_params);
let data = url.searchParams.get("bid");

axios.post("https://api.consigmais.com.br/server/lp/main/v2/getBrandInfo", {
    brandId: data
}).then((function(e) {
    const l = e.data.brandLogoDark != null && window.isWhiteMode ? e.data.brandLogoDark : e.data.brandLogo;
    const a = e.data,
        o = '<p class="footer" style="text-align: center;">Este produto está sendo oferecido pela</p><br><div style="display: flex;justify-content: center; align-items: center;"><img style="width:100%; max-width:200px;" src="' + l + '" alt="Logomarca ' + a.brandName + '"></div><br><p class="footer terms" style="text-align: center;">Todos os direitos reservados. Todo conteúdo do site, logotipos,marcas, layout, aqui veiculados são de propriedade exclusiva. É vedada qualquer reprodução,total ou parcial, de qualquer elemento de identidade, sem expressa autorização. A violação de qualquer direito mencionado implicará na responsabilização civil e criminal nos termos da Lei.</p><p class="footer links" style="text-align: center;"><a style="color:#fff" href="https://api.consigmais.com.br/terms/">Termos de Uso</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="color:#fff" href="https://api.consigmais.com.br/privacy/">Politicas de Privacidade</a></p><p class="footer address" style="text-align: center;">' + a.address + '</p><p class="footer federalid" style="text-align: center;">' + a.federalId + "</p>";
    document.getElementById("footer").innerHTML = o
})).catch((function(e) {
    console.log(e)
}));