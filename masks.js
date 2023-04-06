var cpfInput = document.querySelector('[data-label="CPF"]');
var celularInput = document.querySelector('[data-label="Celular"]');
var dataNascimentoInput = document.querySelector('[data-label="Data de Nascimento"]');
    
    cpfInput.addEventListener("input", function() {
        
        var cpf = cpfInput.value;
            cpf = cpf.replace(/\D/g, "");  
            cpf = cpf.substring(0, 11);     
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        
    cpfInput.value = cpf;
    });


    celularInput.addEventListener("input", function() {

    var celular = celularInput.value;
        celular = celular.replace(/\D/g, "");
        celular = celular.substring(0, 11);
        celular = celular.replace(/(\d{2})(\d)/, "($1) $2");
        celular = celular.replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3");

    celularInput.value = celular;
    });


    dataNascimentoInput.addEventListener("input", function() {
    
    var dataNascimento = dataNascimentoInput.value;
        dataNascimento = dataNascimento.replace(/\D/g, "");
        dataNascimento = dataNascimento.substring(0, 8);
        dataNascimento = dataNascimento.replace(/(\d{2})(\d)/, "$1/$2");
        dataNascimento = dataNascimento.replace(/(\d{2})(\d)/, "$1/$2");

    dataNascimentoInput.value = dataNascimento;
});
