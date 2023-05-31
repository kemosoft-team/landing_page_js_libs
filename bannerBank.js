var url_params = window.location.href;
var url = new URL(url_params);
let oid = url.searchParams.get("oid");

var clientOrigin = decodeURIComponent(getCookie('client_origin'));

    if(oid == null){
        oid = clientOrigin.oid;
    };

var logoName = '';

switch (oid) {
    //BMG
    case '18':
      logoName = 'bmg_correspondente.png';
      break;
    //Banco Master
    case '29':
      logoName = 'master_correspondente.png';
      break;
    default:
      logoName = 'bmg_correspondente.png';
      break;
  }

const content = 
        '<div class="brz-css-phzyg brz-wrapper" style="text-align: center;">'+
        '<div class="brz-image brz-css-pqspb>'+
        '<picture class="brz-picture brz-d-block brz-p-relative brz-css-hojfk" data-custom-id="potfobpdyrzexyqsnaooisokvmsnehokutoe">'+
        '<img class="brz-img" style="width:45%" src="https://lp-js-libs.s3.sa-east-1.amazonaws.com/assets/'+logoName+'" alt="" draggable="false" loading="lazy"/></picture></div>'+
        '<div style="margin-bottom: 5px !important;"><span class="brz-icon brz-span brz-css-ifcxp brz-css-hxdfk inline-block">'+
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve" class="brz-icon-svg align-[initial]" data-type="glyph" data-name="lock-circle">'+
        '<g class="nc-icon-wrapper" fill="currentColor">'+
        '<path fill="currentColor" d="M18,10.726V6c0-3.309-2.691-6-6-6S6,2.691,6,6v4.726C4.759,12.136,4,13.979,4,16c0,4.411,3.589,8,8,8 s8-3.589,8-8C20,13.979,19.241,12.136,18,10.726z M13,17.816L13,20h-2l0-2.184C9.839,17.402,9,16.302,9,15c0-1.654,1.346-3,3-3 s3,1.346,3,3C15,16.302,14.162,17.402,13,17.816z M16,9.082C14.822,8.398,13.458,8,12,8S9.178,8.398,8,9.082V6c0-2.206,1.794-4,4-4 s4,1.794,4,4V9.082z"></path></g></svg></span>'+
        '<p class="brz-css-vuboy inline-block" style="margin-top: 10px !important; margin-bottom: 0px !important; margin-left: 5px !important; text-align: center; font-family: Overpass, sans-serif !important; font-size: 12px; line-height: 1.9; font-weight: 400; letter-spacing: 0px;" data-uniq-id="vwofe" data-generated-css="brz-css-ubaxg">ESTE SITE É 100% SEGURO</p></div>';


const contentHeader = '<div class="header" style="display: flex;  justify-content: space-around;  align-items: left;"><img class="brz-img" style="width:25%; margin-left: -30px;" src="https://lp-js-libs.s3.sa-east-1.amazonaws.com/assets/'+logoName+'" alt="" draggable="false" loading="lazy" style=" width: 100px;  height: 100px;"><div><span class="brz-icon brz-span brz-css-ifcxp brz-css-hxdfk"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve" class="brz-icon-svg align-[initial]" data-type="glyph" data-name="lock-circle"><g class="nc-icon-wrapper" fill="currentColor"><path fill="currentColor" d="M18,10.726V6c0-3.309-2.691-6-6-6S6,2.691,6,6v4.726C4.759,12.136,4,13.979,4,16c0,4.411,3.589,8,8,8 s8-3.589,8-8C20,13.979,19.241,12.136,18,10.726z M13,17.816L13,20h-2l0-2.184C9.839,17.402,9,16.302,9,15c0-1.654,1.346-3,3-3 s3,1.346,3,3C15,16.302,14.162,17.402,13,17.816z M16,9.082C14.822,8.398,13.458,8,12,8S9.178,8.398,8,9.082V6c0-2.206,1.794-4,4-4 s4,1.794,4,4V9.082z"></path></g></svg></span><p class="brz-css-vuboy inline-block" style="margin-top: 20px !important; margin-bottom: 0px !important; margin-left: 5px !important; text-align: center; font-family: Overpass, sans-serif !important; font-size: 12px; line-height: 1.9; font-weight: 400; letter-spacing: 0px;" data-uniq-id="vwofe" data-generated-css="brz-css-ubaxg">ESTE SITE É 100% SEGURO</p></div></div>';

    if(document.getElementById("banner-left")){ document.getElementById("banner-left").innerHTML = content;}
    if(document.getElementById("header-mobile")){ document.getElementById("header-mobile").innerHTML = contentHeader;}










