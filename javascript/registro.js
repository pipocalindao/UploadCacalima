// Objeto para referenciar elementos do HTML
const form = {
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    senha: document.getElementById('senha'),
    confirmaSenha: document.getElementById('confirmar-senha'),
    dataNascimento: document.getElementById('nascimento'),
    faixa: document.getElementById('faixa'),
    btnRegistro: document.getElementById('RegisterBtn')
};

// Validar email
function validadeEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Funções chamadas pelos inputs (onchange)
function onChangeNome() {
    registroAbilitarBtn();
}

function onChangeEmail() {
    registroAbilitarBtn();
}

function onChangeSenha() {
    registroAbilitarBtn();
}

function onChangeConfirmaSenha() {
    registroAbilitarBtn();
}

function onChangeDataNascimento() {
    registroAbilitarBtn();
}

function onChangeFaixa() {
    registroAbilitarBtn();
}

// Função que habilita/desabilita o botão
function registroAbilitarBtn() {
    if (CadastroValido()) {
        form.btnRegistro.disabled = false;
    } else {
        form.btnRegistro.disabled = true;
    }
}

// Função que valida todos os campos
function CadastroValido() {
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const confirmaSenha = form.confirmaSenha.value;
    const nascimento = form.dataNascimento.value;
    const nome = form.nome.value.trim();
    const faixa = form.faixa.value;

    // Valida cada campo
    if (!nome || nome.length < 3) return false;
    if (!validadeEmail(email)) return false;
    if (!senha || senha.length < 6) return false;
    if (!confirmaSenha || confirmaSenha.length < 6) return false;
    if (senha !== confirmaSenha) return false;
    if (!nascimento) return false;
    if (!faixa) return false;

    return true;
}

// Função de registro (Firebase)
function registrar() {
    alert("Iniciando registro...");
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;

    firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({
                displayName: nome
            }).then(() => {
                console.log("Cadastro realizado com sucesso!");
                alert("Cadastro realizado com sucesso!");
                window.location.href = "home.html";
            });
        })
        .catch((error) => {
            console.error("Erro ao cadastrar:", error);
            alert("Erro: " + error.message);
        });
}

// Valida ao carregar a página
document.addEventListener('DOMContentLoaded', registroAbilitarBtn);