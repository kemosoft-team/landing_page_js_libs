var url_params = window.location.href;
var url = new URL(url_params);
let offer = url.searchParams.get("id"); 

axios.post('https://api2.kemosoft.com.br/api:workflow/creatives', {
    offerId: offer
})
.then(function (response) {
    console.log(response);

    const creatives = response.data.creatives;

    creatives.forEach(element => {

        const tr = '<tr class="brz-table__tr"><th class="brz-table__th brz-table__aside"><div class="brz-table__th--btn"><img width="8%" src="'+element.url+'">'+
            '<span class="brz-span brz-text__editor"></span></div></th><td class="brz-table__td"><div class="brz-d-xs-flex brz-flex-xs-column"><div class="brz-css-ibzov brz-wrapper">'+
            '<div class="brz-rich-text brz-rich-text__custom brz-css-jenuz" data-custom-id="gvvamjkarfcftdlunfltalsbziwqxhkywics"><div><p data-uniq-id="rgtyl" data-generated-css='+
            '"brz-css-wcplh" class="brz-css-oafdp">'+element.file_name+'</p></div></div></div></div></td><td class="brz-table__td"><div class="brz-d-xs-flex '+
            'brz-flex-xs-column"><div class="brz-css-ibzov brz-wrapper"><div class="brz-rich-text brz-rich-text__custom brz-css-jenuz" data-custom-id="fnlzivzmfpzxrfqpebrbczgussmdgqmkqxee">'+
            '<div><p data-uniq-id="odsfb" data-generated-css="brz-css-nvodp" class="brz-css-khrpx">'+element.width+'x'+element.height+'</p></div></div></div></div></td><td class="brz-table__td">'+
            '<div class="brz-d-xs-flex brz-flex-xs-column"><div class="brz-css-ibzov brz-wrapper"><div class="brz-rich-text brz-rich-text__custom brz-css-jenuz" data-custom-id='+
            '"awezwluvfavtxffdorwbasypmczspowkoqcy"><div><p data-uniq-id="tdinl" data-generated-css="brz-css-fjvte" class="brz-css-fwbbg">'+element.type+'</p></div></div></div></div></td>'+
            '<td class="brz-table__td"><div class="brz-d-xs-flex brz-flex-xs-column"><div class="brz-wrapper-clone brz-css-xeowh"><div class="brz-d-xs-flex brz-flex-xs-wrap '+
            'brz-css-lfxda"><div class="brz-wrapper-clone__item brz-css-ygmfe" id="dxpklhwdnjzqsvpxefarvciljzprpojvsuxa"><div class="brz-icon__container" data-custom-id="dxpklhwdnjzqsvpxefarvciljzprpojvsuxa">'+
            '<a href="'+element.url+'" download><span class="brz-icon brz-span brz-css-hcefj brz-css-wjkal"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" xml:'+
            'space="preserve" class="brz-icon-svg align-[initial]" data-type="glyph" data-name="hit-down"><g class="nc-icon-wrapper" fill="currentColor"><path data-color="color-2" fill="currentColor" d="M24,23c0,'+
            '0.552-0.448,1-1,1H1c-0.552,0-1-0.448-1-1c0-0.552,0.448-1,1-1h22 C23.552,22,24,22.448,24,23z"></path> <path fill="currentColor" d="M5,9l7,9l7-9h-6V1c0-0.553-0.447-1-1-1c-0.553,0-1,0.447-1,1v8H5z"></path>'+
            '</g></svg></span></div></div></div></div></div></td></tr>';

            const temp = document.createElement('tbody');
            temp.innerHTML = tr;

            const trElement = temp.firstChild;

            const tbody = document.querySelector('tbody');
            tbody.appendChild(trElement);

            if(document.getElementById("description")){ document.getElementById("description").innerHTML = response.data.description_lang.pt;}
            if(document.getElementById("title")){ document.getElementById("title").innerHTML = '<p>Criativos '+response.data.title+'</p>';}

        
    });




})
.catch(function (error) {
    console.log(error);
}); 




