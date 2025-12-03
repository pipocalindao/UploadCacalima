// Objeto 'form' para referenciar os elementos do HTML
const form = {
    email: document.getElementById('email'),
    senha: document.getElementById('senha'),
    recuperarsenha: document.getElementById('recuperar'),
    login: document.getElementById('login'),
    emailinvalido: document.getElementById('invalidemail'),
    emailvazio: document.getElementById('notemail'),
    senhavazia: document.getElementById('notsenha')
};

// Funções de validação chamadas pelos inputs
function validaremails() {
    alternarbotoesativos();
    errosdeemail();
}
function validarsenhas() {
    alternarbotoesativos();
    errosdesenha();
}

// Habilita/desabilita botões e mostra erros
function alternarbotoesativos() {
    const emailval = emailvalido();
    
    // Verifica se os elementos existem na página antes de tentar usá-los
    if (form.recuperarsenha) {
         form.recuperarsenha.disabled = !emailval;
    }
    if (form.login) {
        form.login.disabled = !emailval || !validarsenha();
    }

    if (form.emailvazio && !form.email.value) {
        setTimeout(() => {
            if (form.emailvazio) form.emailvazio.style.display = "none";
        }, 3000);
    }
    if (form.senhavazia && !form.senha.value) {
        setTimeout(() => {
            if (form.senhavazia) form.senhavazia.style.display = "none";
        }, 3000);
    }
}

// Verifica se o email é válido
function emailvalido() {
    const email = form.email.value;
    if (!email) return false;
    return validadeEmail(email); // Função do arquivo validacao.js
}

// Funções que mostram/escondem mensagens de erro
function errosdeemail() {
    const email = form.email.value;
    if (form.emailvazio) {
        form.emailvazio.style.display = email ? "none" : "block";
    }
    if (form.emailinvalido) {
        form.emailinvalido.style.display = (email && !validadeEmail(email)) ? "block" : "none";
    }
}

function errosdesenha() {
    const senha = form.senha.value;
    if (form.senhavazia) {
        form.senhavazia.style.display = senha ? "none" : "block";
    }
}

// Verifica se a senha não está vazia
function validarsenha() {
    const senha = form.senha.value;
    if (!senha) return false;
    return true;
}

// --- Função de Login ---
function login(event) {
  if (event && event.preventDefault) event.preventDefault();
  
  firebase.auth().signInWithEmailAndPassword(form.email.value, form.senha.value)
    .then(response => {
      window.location.href = "home.html";
    })
    .catch(error => {
      console.error("Erro ao logar o usuário:", error);
      alert(GetErrorMessage(error));
    });
}
function GetErrorMessage(error) {
if (error == "auth/user-not-found") {
    return "Usuário não encontrado.";
}
return error.message
}
// --- Botão Recuperar Senha ---

function recuperarSenha() {
    alert("Enviando email de recuperação de senha...");
    console.log("Enviando email de recuperação de senha para:", form.email.value);
    firebase.auth().sendPasswordResetEmail(form.email.value)
    .then(() => {
      alert("Email de recuperação de senha enviado!");
    }
    )
    .catch((error) => {
      console.error("Erro ao enviar email de recuperação de senha:", error);
      alert(GetErrorMessage(error));
    });
} 

// Adiciona o 'listener' APENAS se o botão existir na página
const btnRecuperar = document.getElementById('recuperar');
if (btnRecuperar) {
    btnRecuperar.addEventListener('click', function(event) {
        event.preventDefault(); // opcional se type="button"
        // só chama se o botão estiver habilitado e um email válido estiver preenchido
        if (!btnRecuperar.disabled) {
            recuperarSenha();
        }
    });
}


// --- Botão Login ---
// Adiciona o 'listener' APENAS se o botão existir na página
if (document.getElementById('login')) {
    document.getElementById('login').addEventListener('click', login);
}