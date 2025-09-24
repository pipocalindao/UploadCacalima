const form = {    //pra nao ter de ficar chamando o getElementById toda hora crio um objeto com as referencias
    email: document.getElementById('email'),
    senha: document.getElementById('senha'),
    recuperarsenha: document.getElementById('recuperar'),
    login: document.getElementById('login'),
    emailinvalido: document.getElementById('invalidemail'),
    emailvazio: document.getElementById('notemail'),
    senhavazia: document.getElementById('notsenha')
}

function validaremails(){ alternarbotoesativos(), errosdeemail();} // chamo as funcoes de validacao e erro e alternacao de botoes disponiveis
function validarsenhas() { alternarbotoesativos(),  errosdesenha();}// chamo as funcoes de validacao e erro e alternacao de botoes disponiveis
    


function alternarbotoesativos() { // habilita ou desabilita os botoes de login e recuperar senha
    const emailval = emailvalido();
    form.recuperarsenha.disabled = !emailval; // habilita o botao de recuperar senha se o email for valido
    form.login.disabled = !emailval || !validarsenha(); // habilita o botao de login se o email e senha forem validos

     if (!form.email.value) { // esconde as mensagens de erro apos 3 segundos se o campo estiver vazio
        setTimeout(() => {
            form.emailvazio.style.display = "none";
        }, 3000);
    }
     if (!form.senha.value) { // esconde as mensagens de erro apos 3 segundos se o campo estiver vazio
        setTimeout(() => {
            form.senhavazia.style.display = "none";
        }, 3000);
    }
}

function emailvalido() { // verifica se o email e valido
    const email = form.email.value;
    if (!email) return false;
    return validadeEmail(email);
}

function errosdeemail() { // mostra ou esconde as mensagens de erro de email
    const email = form.email.value;
    form.emailvazio.style.display = email ? "none" : "block";
    form.emailinvalido.style.display = (email && !validadeEmail(email)) ? "block" : "none";
}

function errosdesenha() { // mostra ou esconde as mensagens de erro de senha
    const senha = form.senha.value;
    form.senhavazia.style.display = senha ? "none" : "block";
}

function validarsenha() { // verifica se a senha e valida
    const senha = form.senha.value;
    if (!senha) return false;
    return true;
}



document.getElementById('recuperar').addEventListener('click', function(event) { // apenas um teste para ver se o botao de recuperar senha esta funcionando
    event.preventDefault();
    alert('Botão de recuperar senha funcionando!');
});