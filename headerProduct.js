
var url_params = window.location.href;
var url = new URL(url_params);
let productId = url.searchParams.get("oid"); 


const brand = ""
// axios.post('https://api.consigmais.com.br/server/lp/main/v2/getBrandInfo', {
//     brandId : data,
//     affiliateCode: af
// })

// .then(function (response) {
    
//     const res = response.data;
//     const img = '<div style="display: flex;justify-content: center; align-items: center;"><img style="width:90%; max-width:190px;" src="' + (res.brandLogoDark?res.brandLogoDark:res.brandLogo) + '" alt="Logomarca ' + res.brandName + '"></div>';
//     const imgMain = '<div style="display: flex;justify-content: center; align-items: center;"><img style="width:70%; max-width:120px;" src="' + (res.brandLogoDark?res.brandLogoDark:res.brandLogo) + '" alt="Logomarca ' + res.brandName + '"></div>';
//     const imgForm = '<div style="display: flex;justify-content: left; align-items: left;"><img style="width:70%; max-width:120px;" src="' + (res.brandLogoDark?res.brandLogoDark:res.brandLogo) + '" alt="Logomarca ' + res.brandName + '"></div>';
//     const imgFooter = '<div style="display: flex;justify-content: center; align-items: center;"><img style="width:40%; max-width:80px;" src="' + (res.brandLogoDark?res.brandLogoDark:res.brandLogo) + '" alt="Logomarca ' + res.brandName + '"></div>';
//     const prefixtext = 'Este produto de autocontratação e simulação online está sendo oferecido pela '+res.brandName+' correspondente bancário oficial para o banco BMG.';
//     const terms =  'Todos os direitos reservados. Todo conteúdo do site, logotipos,'+
//     'marcas, layout, aqui veiculados são de propriedade exclusiva. É vedada qualquer reprodução,'+ 
//     'total ou parcial, de qualquer elemento de identidade, sem expressa autorização. A violação de '+ 
//     'qualquer direito mencionado implicará na responsabilização civil e criminal nos termos da Lei.';

//     const content = '<p class="footer" style="text-align: center;">'+prefixtext+'</p>'+
//                     '<p class="footer terms" style="text-align: center;">'+terms+'</p>'+
//                     '<p class="footer links" style="text-align: center;"><a style="color:#fff" href="https://api.consigmais.com.br/terms/">Termos de Uso</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="color:#fff" href="https://api.consigmais.com.br/privacy/">Politicas de Privacidade</a></p>'+
//                     '<p class="footer address" style="text-align: center;">'+res.address+'</p>'+
//                     '<p class="footer federalid" style="text-align: center;">'+res.federalId+'</p>';

//     document.title = res.brandName+" | Empréstimo Consignado";  

//     if(document.getElementById("logo")){ document.getElementById("logo").innerHTML = img;}
//     if(document.getElementById("logo-main")){document.getElementById("logo-main").innerHTML = imgMain;}
//     if(document.getElementById("logo-form")){document.getElementById("logo-form").innerHTML = imgForm;}
//     if(document.getElementById("footer")){document.getElementById("footer").innerHTML = content;}
//     if(document.getElementById("logo-footer")){document.getElementById("logo-footer").innerHTML = imgFooter;}

// })
// .catch(function (error) {
//     console.log(error);
// });  