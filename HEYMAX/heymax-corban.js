let BASE_URL_HEYMAX = "https://api.sheetmonkey.io/form/keboAXgkeWL77ZR39TKRLb";

const EVO_URL_API = 'https://evolution.kemosoft.com.br';
const APIKEY = 'B6D711FCDE4D4FD59365RCASTRE713976';

let instanceName;
let cancelRequestAttempts = true;


function validate_heymax_corban() {
    const name = document.querySelector('[data-brz-label="Nome"]').value;
    const phone = document.querySelector('[data-brz-label="WhatsApp"]').value;
    const email = document.querySelector('[data-brz-label="Email"]').value;
    const senha = document.querySelector('[data-brz-label="Senha"]').value;
    const company_name = document.querySelector('[data-brz-label="Nome da Empresa"]').value;

    if (name == "" || phone == "" || email == "" || senha == "" || company_name == "") {
        showToast(
            "Por favor, preencha todos os campos!"
        );
        return false;
    } else {
        criar_heymax_corban(name, phone, email, senha, company_name)
    }
}

function criar_heymax_corban(name, phone, email, senha, company_name) {
    axios
        .post(`${BASE_URL_HEYMAX}`, {
            name: name,
            phone: phone,
            email: email,
            password: senha,
            company_name: company_name
        })
        .then((response) => {
            var firstCompany_name = company_name.split(" ")[0];
            /* const workspace_id = response.id; */
            const workspace_id = 12345;
            instanceName = `${firstCompany_name}-01-${workspace_id}`
            console.log("InstanceName: ", instanceName)

            document.querySelector("#closeFormCorban").click()
            document.querySelector("#btnQrcodeCorban").click()
            getQrcode(instanceName)
        })
        .catch(function (error) {
            console.log(error, "Não foi possível criar o contato");
        });
}


async function getQrcode(instanceName) {
    await createInstance(instanceName);

    axios
        .get(`${EVO_URL_API}/instance/connect/${instanceName}`, {
            headers: {
                'apikey': APIKEY
            }
        })
        .then((response) => {
            document.querySelector("#waitingQrcode").style.display = "none";
            var qrCodeElement = document.querySelector('#qrCode');
            document.querySelector('#qrcode-container').style.display = "flex";
            qrCodeElement.innerHTML = response.qrCode;

            setTimeout(() => {
                verifyStatusInstance(instanceName)
            }, 10000);
        })
        .catch(function (error) {
            console.log(error, "Não foi possível obter o qrCode");
        });
}

function createInstance(instanceName) {
    axios
        .post(`${EVO_URL_API}/instance/create`, {
            instanceName: instanceName
        }, {
            headers: {
                'apikey': APIKEY
            }
        })
        .then((response) => {
            console.log("Resposta do CreateInstance: ", response)
            //SE JÁ EXISTIR O INSTANCE NAME, ABRIR O QRCODE MESMO ASSIM
        })
        .catch(function (error) {
            console.log(error, "Não foi possível criar a Instancia");
        });
}

function verifyStatusInstance(instanceName) {
    axios
        .get(`${EVO_URL_API}/instance/connectionState/${instanceName}`, {}, {
            headers: {
                'apikey': APIKEY
            }
        })
        .then((response) => {
            const status = response.instance.state;
            cancelRequestAttempts == false
            if (status === "open") {
                document.querySelector("#closeWaitingCorban").click()
                document.querySelector("#btnConfig").click()
                iniciarConfig()
            } else if (status === "connecting") {
                if (cancelRequestAttempts == false) {
                    setTimeout(() => {
                        this.verifyStatusInstance(instance)
                        this.controlAttempts++;
                    }, 10000);
                } else {
                    this.toastMessage('warning', 'Erro', 'Erro ao Tentar Conectar a sua Instância!');
                }
            }
        })
        .catch(function (error) {
            console.log(error, "Não foi possível criar a Instancia");
        });
}

function iniciarConfig() {
    console.log("Iniciando Config")
}


function closeQrCode() {
    cancelRequestAttempts = false;
}

const btnCloseQrCode = document.querySelector("#closeWaitingCorban");

btnCloseQrCode.addEventListener("click", function(){
    closeQrCode();
});


