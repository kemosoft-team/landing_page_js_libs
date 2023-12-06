var federalId = document.querySelector('[data-brz-label="CPF"]'),
    phone = document.querySelector('[data-brz-label="Whatsapp"]'),
    birth = document.querySelector('[data-brz-label="Data de Nascimento"]'),
    agency = document.querySelector('[data-brz-label="Agência"]'),
    dig = document.querySelector('[data-brz-label="Dígito"]'),
    account = document.querySelector('[data-brz-label="Conta"]'),
    federalIdB = document.querySelector('[data-brz-label="CPF/CNPJ"]'),
    cep = document.querySelector('[data-brz-label="CEP"]');


if (federalId) {
  federalId.setAttribute("inputmode", "numeric"), phone.setAttribute("inputmode", "numeric"), birth.setAttribute("inputmode", "numeric"), federalId.addEventListener("input", (function () {
    var e = federalId.value;
    e = (e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d)/, "$1.$2")).replace(/(\d{3})(\d{1,2})$/, "$1-$2"), federalId.value = e
  }));
}
if (phone) {
  phone.addEventListener("input", (function () {
    var e = phone.value;
    e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 11)).replace(/(\d{2})(\d)/, "($1) $2")).replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3"), phone.value = e
  }));
}
if (birth) {
  birth.addEventListener("input", (function () {
    var e = birth.value;
    e = (e = (e = (e = e.replace(/\D/g, "")).substring(0, 8)).replace(/(\d{2})(\d)/, "$1/$2")).replace(/(\d{2})(\d)/, "$1/$2"), birth.value = e
  }));
}
if (agency) {
  agency.addEventListener("input", function () {
    var e = agency.value;
    e = e.replace(/\D/g, "");
    e = e.substring(0, 5);

    if (e.length > 4) {
      e = e.replace(/(\d{4})(?!$)/g, "$1-");
    }

    agency.value = e;
  });
}
if (dig) {
  dig.addEventListener("input", function () {
    var e = dig.value;
    e = e.replace(/\D/g, "");
    e = e.substring(0, 1);
    dig.value = e;
  });
}
if (account) {
  account.addEventListener("input", function () {
    var value = account.value;
    value = value.replace(/\D/g, "");
    value = value.substring(0, 12);

    //   if (value.length > 3) {
    //     value = value.replace(/(\d{3})(?!$)/g, "$1.");
    //   }

    account.value = value;
  });
}

if (federalIdB) {
  federalIdB.setAttribute("inputmode", "numeric");
  federalIdB.addEventListener("input", function () {
    var value = federalIdB.value.replace(/\D/g, "");
    var formattedValue = "";

    if (value.length <= 11) {
      // CPF
      formattedValue = value.replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // CNPJ
      formattedValue = value.replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    federalIdB.value = formattedValue;
  });
}
if (cep) {
  cep.addEventListener("input", function () {
    var e = cep.value;
    e = e.replace(/\D/g, "");
    e = e.substring(0, 8);
    e = e.replace(/(\d{5})(\d)/, "$1-$2");
    cep.value = e;
  });
}
