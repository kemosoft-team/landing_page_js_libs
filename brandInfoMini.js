
var url_params = window.location.href;
var url = new URL(url_params);
let data = url.searchParams.get("bid"); 

axios.post('https://api.consigmais.com.br/server/lp/main/v2/getBrandInfo', {
    brandId : data,
})
.then(function (response) {
    

    const res = response.data;
    const prefixtext = 'Este produto de autocontratação e simulação online está sendo oferecido pela '+res.brandName+' correspondente bancário oficial para os bancos BMG, Master, Daycoval, Safra, PAN, C6 e Facta.';
    const terms =  'Todos os direitos reservados. Todo conteúdo do site, logotipos,'+
    'marcas, layout, aqui veiculados são de propriedade exclusiva. É vedada qualquer reprodução,'+ 
    'total ou parcial, de qualquer elemento de identidade, sem expressa autorização. A violação de '+ 
    'qualquer direito mencionado implicará na responsabilização civil e criminal nos termos da Lei.';

    const content = '<p class="footer" style="text-align: center;">'+prefixtext+'</p><br>'+
                    '<p class="footer terms" style="text-align: center;">'+terms+'</p>'+
                    '<p class="footer links" style="text-align: center;"><a style="color:#fff" href="https://api.consigmais.com.br/terms/">Termos de Uso</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="color:#fff" href="https://api.consigmais.com.br/privacy/">Politicas de Privacidade</a></p>'+
                    '<p class="footer address" style="text-align: center;">'+res.address+'</p>'+
                    '<p class="footer federalid" style="text-align: center;">'+res.federalId+'</p>';

    
    document.getElementById("footer").innerHTML = content;

})
.catch(function (error) {
    console.log(error);
});  