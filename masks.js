var cpfInput = document.querySelector('[data-label="CPF"]');
    
    cpfInput.addEventListener("input", function() {
        
        var cpf = cpfInput.value;
            cpf = cpf.replace(/\D/g, "");  
            cpf = cpf.substring(0, 11);     
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        
    cpfInput.value = cpf;
});