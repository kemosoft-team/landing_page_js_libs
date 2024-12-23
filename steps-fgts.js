let apiBaseUrl = "https://api.consigmais.com.br/lp/main/v2",
    stepsUrl = window.location.origin + "/";

function getCookie(e) {
    let t = {};
    return document.cookie.split(";").forEach((function(e) {
        let [o, a] = e.split("=");
        t[o.trim()] = a
    })), t[e]
}

function setNextStep() {
    axios.post(apiBaseUrl + "/getTokenStatus", {}, {
        headers: {
            Authorization: `Bearer ${getCookie("tkn")}`
        }
    }).then((function(e) {
        window.location.href = stepsUrl + e.data.nextStep
    })).catch((function(e) {
        console.log(e)
    }))
}

function redirectToNextStep(e) {
    const t = e.nextStep,
        o = window.location.search || "";
    switch (t) {
        case "signature":
            window.location.href = stepsUrl + t + o + "&" + encodeURIComponent(JSON.stringify(e.formalizatioLink));
            break;
        case "scheduled":
            window.location.href = stepsUrl + t + o + "&" + encodeURIComponent(JSON.stringify(e.scheduledTo));
            break;
        default:
            window.location.href = stepsUrl + t + o
    }
}

function setLinkSignature() {
    var e = window.location.search.substring(1);
    const t = decodeURIComponent(e);
    document.querySelector(".brz-a").href = t
}

function setSchedule() {
    window.addEventListener("DOMContentLoaded", (function() {
        var e = window.location.search.substring(1);
        const t = decodeURIComponent(e);
        var o = document.getElementById("schedule"),
            a = o.textContent.replace("xx/xx/xxxx", t);
        o.textContent = a, o.style.fontFamily = "Montserrat", o.style.fontSize = "20px", o.style.color = "#706666", o.style.fontWeight = "700", o.style.marginTop = "32px", o.style.marginBottom = "22px"
    }))
}

function getCurrentStep() {
    return window.location.pathname.split("/")[1]
}

function showToast(e) {
    var t = document.getElementById("snackbar");
    t.className = "show", document.getElementById("snackbar").innerHTML = e, setTimeout((function() {
        t.className = t.className.replace("show", `${e}`)
    }), 3e3)
}

function setBanks(e) {
    e.reverse();
    document.querySelectorAll('select[data-label="Banco"]').forEach((t => {
        e.forEach((e => {
            const o = document.createElement("option");
            o.text = e.name, o.value = e.id, t.insertBefore(o, t.firstChild)
        }))
    }))
}
async function getBanks() {
    axios.post(apiBaseUrl + "/getData", {
        object: "banks"
    }, {
        headers: {
            Authorization: `Bearer ${getCookie("tkn")}`
        }
    }).then((function(e) {
        setBanks(e.data)
    })).catch((function(e) {
        console.log(e)
    }))
}
async function getByZipCodeInfo(e) {
    axios.post(apiBaseUrl + "/getZipcodeInfo", {
        zipcode: e
    }, {
        headers: {
            Authorization: `Bearer ${getCookie("tkn")}`
        }
    }).then((e => {
        setAddressInfo(e.data)
    })).catch((function(e) {
        showToast(e.response.data.message)
    }))
}

function setAddressInfo(e) {
    document.querySelector('[data-label="Rua"]').value = e.address, document.querySelector('[data-label="Bairro"]').value = e.district, document.querySelector('[data-label="Cidade"]').value = e.city, document.querySelector('[data-label="UF"]').value = e.state
}
async function registerCustomerAddress(e, t, o, a, r, n) {
    const s = document.querySelector(".brz-btn-submit"),
        i = s.querySelector(".brz-form-spinner"),
        c = s.querySelector(".brz-span.brz-text__editor");
    s.setAttribute("disabled", !0), i.classList.remove("brz-invisible"), c.textContent = "", axios.post(apiBaseUrl + "/registerCustomerInfos", {
        zipcode: e,
        address: t,
        addressNumber: o,
        state: a,
        district: r,
        city: n,
        currentStep: getCurrentStep()
    }, {
        headers: {
            Authorization: `Bearer ${getCookie("tkn")}`
        }
    }).then((e => {
        redirectToNextStep(e.data)
    })).catch((function(e) {
        s.removeAttribute("disabled"), i.classList.add("brz-invisible"), c.textContent = "Sim, quero antecipar meu FGTS!", showToast(e.response.data.message)
    }))
}
async function registerCustomerAccount(e, t, o, a, r) {
    const n = document.querySelector(".brz-btn-submit"),
        s = n.querySelector(".brz-form-spinner"),
        i = n.querySelector(".brz-span.brz-text__editor");
    n.setAttribute("disabled", !0), s.classList.remove("brz-invisible"), i.textContent = "", axios.post(apiBaseUrl + "/registerCustomerInfos", {
        branchNo: e.replace(/[^\w\s]/gi, ""),
        bankId: t,
        acctNo: `${o}-${a}`,
        acctType: r,
        currentStep: getCurrentStep()
    }, {
        headers: {
            Authorization: `Bearer ${getCookie("tkn")}`
        }
    }).then((e => {
        redirectToNextStep(e.data)
    })).catch((function(e) {
        n.removeAttribute("disabled"), s.classList.add("brz-invisible"), i.textContent = "Simular", showToast(e.response.data.message)
    }))
}
async function registerCustomerDocs(e, t, o, a) {
    const r = document.querySelector(".brz-btn-submit"),
        n = r.querySelector(".brz-form-spinner"),
        s = r.querySelector(".brz-span.brz-text__editor");
    r.setAttribute("disabled", !0), n.classList.remove("brz-invisible"), s.textContent = "", axios.post(apiBaseUrl + "/registerCustomerInfos", {
        docNumber: e,
        docType: t,
        docState: o,
        mother: a,
        currentStep: getCurrentStep()
    }, {
        headers: {
            Authorization: `${getCookie("tkn")}`
        }
    }).then((e => {
        redirectToNextStep(e.data)
    })).catch((function(e) {
        r.removeAttribute("disabled"), n.classList.add("brz-invisible"), s.textContent = "Sim, quero antecipar meu FGTS!", showToast(e.response.data.message)
    }))
}

function getNextStep() {
    const e = localStorage.getItem("attempts") || 0,
        t = document.querySelector(".brz-btn-submit"),
        o = t.querySelector(".brz-form-spinner"),
        a = t.querySelector(".brz-span.brz-text__editor");
    axios.post(apiBaseUrl + "/getNextStep", {}, {
        headers: {
            Authorization: `${getCookie("tkn")}`
        }
    }).then((r => {
        const params = window.location.search || '';
        if (2 == e && "keepcalm" == r.data.nextStep) window.location.href = stepsUrl + "offline" + params;
        else if ("noBalance" == r.data.nextStep || "authorize" == r.data.nextStep || "enable" == r.data.nextStep) {
            if ("authorize" == r.data.nextStep) {
                const e = localStorage.getItem("authorizeLimit") || 0;
                localStorage.setItem("authorizeLimit", parseInt(e) + 1)
            }
            window.location.href = stepsUrl + r.data.nextStep
        } else {
            for (var n = document.getElementsByClassName("wait"), s = document.getElementsByClassName("success"), i = 0; i < n.length; i++) n[i].style.display = "none", s[i].style.display = "block";
            t.removeAttribute("disabled"), o.classList.add("brz-invisible"), a.textContent = "Dê o próximo passo, preencha seus dados", t.addEventListener("click", (function() {
                window.location.href = stepsUrl + r.data.nextStep + ( window.location.search || '' )
            }))
        }
    })).catch((function(e) {}))
}

function processQualification() {
    const e = document.querySelector(".brz-btn-submit"),
        t = e.querySelector(".brz-form-spinner"),
        o = e.querySelector(".brz-span.brz-text__editor");
    e.setAttribute("disabled", !0), t.classList.remove("brz-invisible"), o.textContent = "";
    const a = () => {
        const params = window.location.search || '';
        const e = localStorage.getItem("attempts") || 0;
        axios.post(apiBaseUrl + "/registerCustomerInfos", {
            enable: !0,
            authorize: !0,
            currentStep: getCurrentStep()
        }, {
            headers: {
                Authorization: `${getCookie("tkn")}`
            }
        }).then((e => {
            getNextStep(), localStorage.setItem("attempts", 2)
        })).catch((function(t) {
            e < 2 ? (localStorage.setItem("attempts", parseInt(e) + 1), a()) : window.location.href = stepsUrl + "offline" + params
        }))
    };
    a()
}

function validarFormAddress() {
    const e = document.querySelector('[data-label="CEP"]').value,
        t = document.querySelector('[data-label="Rua"]').value,
        o = document.querySelector('[data-label="Número"]').value,
        a = document.querySelector('[data-label="UF"]').value,
        r = document.querySelector('[data-label="Bairro"]').value,
        n = document.querySelector('[data-label="Cidade"]').value;
    if ("" == e || "" == t || "" == o || "" == a || "" == r || "" == n) return showToast("Por favor, preencha todos os campos."), !1;
    registerCustomerAddress(e, t, o, a, r, n)
}

function validarFormDocs() {
    const e = document.querySelector('[data-label="Tipo de Documento"]').value,
        t = document.querySelector('[data-label="Número do Documento"]').value,
        o = document.querySelector('[data-label="UF Expeditor"]').value,
        a = document.querySelector('[data-label="Nome da sua Mãe"]').value;
    if ("" == e || "" == t || "" == o || "" == a) return showToast("Por favor, preencha todos os campos."), !1;
    registerCustomerDocs(t, e, o, a)
}

function validarFormAccount() {
    const e = document.querySelector('[data-label="Agência"]').value;
    var t = "";
    const o = document.querySelector('[data-label="Conta"]').value,
        a = document.querySelector('[data-label="Dígito"]').value,
        r = document.querySelector('[data-label="Tipo de conta"]').value;
    if (t = "block" == document.querySelectorAll("div.brz-forms2__item")[1].style.display ? document.querySelector('[data-label="Nome Banco"]').value : document.querySelector('[data-label="Banco"]').value, "" == e || "" == t || "" == o || "" == a || "" == r) return showToast("Por favor, preencha todos os campos."), !1;
    registerCustomerAccount(e, t, o, a, r.charAt(0).toString())
}