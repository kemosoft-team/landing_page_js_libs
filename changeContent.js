function changeContent() {

    var url = window.location.href;
    var urlObj = new URL(url);
    let oid = urlObj.searchParams.get("oid"); 

    switch (oid) {
        case '18':
            var btn = document.querySelector('.brz-btn');
            btn.style.backgroundColor = '#fa6301';
            btn.href ='http://bmg.faz.vc/';

            var logo = document.querySelector('.brz-img');
            logo.src = 'https://lp-js-libs.s3.sa-east-1.amazonaws.com/assets/bmg_correspondente.png';
            break;

        case '11':
            var btn = document.querySelector('.brz-btn');
            btn.style.backgroundColor = '#00153a';
            btn.href = 'http://google.com.br/';

            var logo = document.querySelector('.brz-img');
            var logoMobile = document.querySelector('#header-mobile.brz-img');
            logoMobile.src = 'https://lp-js-libs.s3.sa-east-1.amazonaws.com/assets/master_correspondente.png';
            logo.src = 'https://lp-js-libs.s3.sa-east-1.amazonaws.com/assets/master_correspondente.png';
            break;

        default:
            // Não faça nada
            break;
    }
}










