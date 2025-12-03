let form = {};

function validadeEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function inicializarForm() {
    form = {
        nome: document.getElementById('nome'),
        email: document.getElementById('email'),
        senha: document.getElementById('senha'),
        confirmaSenha: document.getElementById('confirmar-senha'),
        dataNascimento: document.getElementById('nascimento'),
        faixa: document.getElementById('faixa'),
        btnRegistro: document.getElementById('RegisterBtn')
    };
    
    console.log("Form inicializado:", form);
    registroAbilitarBtn();
}

function registroAbilitarBtn() {
    if (!form.btnRegistro) return; // proteção caso form não esteja pronto
    
    if (CadastroValido()) {
        form.btnRegistro.disabled = false;
    } else {
        form.btnRegistro.disabled = true;
    }
}

function CadastroValido() {
    if (!form.nome) return false; // proteção caso form não esteja pronto
    
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const confirmaSenha = form.confirmaSenha.value;
    const nascimento = form.dataNascimento.value;
    const faixa = form.faixa.value;

    if (!nome || nome.length < 3) return false;
    if (!validadeEmail(email)) return false;
    if (!senha || senha.length < 6) return false;
    if (!confirmaSenha || confirmaSenha.length < 6) return false;
    if (senha !== confirmaSenha) return false;
    if (!nascimento) return false;
    if (!faixa) return false;

    return true;
}

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

function registrar() {
    if (!CadastroValido()) {
        alert("Preencha todos os campos corretamente");
        return;
    }

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

// IMPORTANTE: roda DEPOIS que todo HTML foi carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarForm);
} else {
    // se o script foi carregado depois do DOMContentLoaded
    inicializarForm();
}