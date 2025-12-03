// Referências do Formulário
const form = {
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    senha: document.getElementById('senha'),
    confirmaSenha: document.getElementById('confirmar-senha'),
    dataNascimento: document.getElementById('nascimento'),
    faixa: document.getElementById('faixa'),
    foto: document.getElementById('foto-perfil'),
    btnRegistro: document.getElementById('RegisterBtn')
};

// --- Funções de Validação (Mantidas iguais) ---
function validadeEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Funções para o HTML chamar (oninput)
function onChangeNome() { registroAbilitarBtn(); }
function onChangeEmail() { registroAbilitarBtn(); }
function onChangeSenha() { registroAbilitarBtn(); }
function onChangeConfirmaSenha() { registroAbilitarBtn(); }
function onChangeDataNascimento() { registroAbilitarBtn(); }
function onChangeFaixa() { registroAbilitarBtn(); }

function registroAbilitarBtn() {
    if (!form.btnRegistro) return;
    if (CadastroValido()) {
        form.btnRegistro.disabled = false;
        form.btnRegistro.style.cursor = "pointer";
        form.btnRegistro.style.backgroundColor = "#00faaf";
    } else {
        form.btnRegistro.disabled = true;
        form.btnRegistro.style.cursor = "not-allowed";
        form.btnRegistro.style.backgroundColor = "#555";
    }
}

function CadastroValido() {
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const confirmaSenha = form.confirmaSenha.value;
    const nascimento = form.dataNascimento.value;
    const nome = form.nome.value.trim();
    const faixa = form.faixa.value;

    if (!nome || nome.length < 3) return false;
    if (!validadeEmail(email)) return false;
    if (!senha || senha.length < 6) return false;
    if (senha !== confirmaSenha) return false;
    if (!nascimento) return false;
    if (!faixa) return false;

    return true;
}

function lerFotoComoTexto(arquivo) {
    return new Promise((resolve, reject) => {
        if (!arquivo) return resolve(null);
        if (arquivo.size > 800 * 1024) return reject("A imagem é muito grande! Use uma menor que 800kb.");
        const reader = new FileReader();
        reader.readAsDataURL(arquivo);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// --- FUNÇÃO DE REGISTRO (CORRIGIDA PARA NÃO DESLOGAR O ADMIN) ---
async function registrar() {
    if (!CadastroValido()) return;

    form.btnRegistro.innerText = "Criando Atleta...";
    form.btnRegistro.disabled = true;

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const nascimento = form.dataNascimento.value;
    const faixa = form.faixa.value;
    const arquivoFoto = form.foto.files[0];

    // TRUQUE: Criar uma instância secundária do Firebase
    // Isso permite criar o usuário SEM deslogar o Admin atual
    let secondaryApp = null;

    try {
        // 1. Inicializa o App Secundário usando as mesmas configs do principal
        secondaryApp = firebase.initializeApp(firebase.app().options, "Secondary");
        const secondaryAuth = secondaryApp.auth();

        // 2. Prepara a foto
        let fotoBase64 = null;
        if (arquivoFoto) {
            form.btnRegistro.innerText = "Processando foto...";
            fotoBase64 = await lerFotoComoTexto(arquivoFoto);
        }

        // 3. Cria o Usuário na conexão SECUNDÁRIA
        form.btnRegistro.innerText = "Salvando...";
        const userCredential = await secondaryAuth.createUserWithEmailAndPassword(email, senha);
        const newUser = userCredential.user;

        // 4. Atualiza perfil (no Auth)
        await newUser.updateProfile({ displayName: nome });

        // 5. Salva no Banco de Dados (Usamos o banco PRINCIPAL, pois somos Admin)
        const db = firebase.firestore(); 
        await db.collection("usuarios").doc(newUser.uid).set({
            nome: nome,
            email: email,
            dataNascimento: nascimento,
            faixa: faixa,
            fotoUrl: fotoBase64,
            tipo: "aluno", // Sempre cria como aluno
            dataCadastro: new Date().toISOString()
        });

        // 6. Limpa a conexão secundária
        await secondaryAuth.signOut();
        await secondaryApp.delete();

        // 7. Sucesso! Limpa o formulário para o próximo cadastro
        alert(`Atleta ${nome} cadastrado com sucesso!`);
        limparFormulario(); 

    } catch (error) {
        console.error("Erro:", error);
        // Se der erro, tenta limpar o app secundário também
        if (secondaryApp) await secondaryApp.delete(); 
        
        let msg = error.message;
        if(typeof error === "string") msg = error;
        if(error.code === 'auth/email-already-in-use') msg = "E-mail já cadastrado.";
        if(error.code === 'auth/weak-password') msg = "Senha fraca (mínimo 6 dígitos).";
        
        alert("Erro: " + msg);
    } finally {
        // Restaura o botão
        form.btnRegistro.innerText = "Finalizar Cadastro";
        registroAbilitarBtn(); // Revalida o estado do botão
    }
}

function limparFormulario() {
    form.nome.value = "";
    form.email.value = "";
    form.senha.value = "";
    form.confirmaSenha.value = "";
    form.dataNascimento.value = "";
    form.faixa.value = "";
    form.foto.value = ""; // Limpa o input file
}

// Inicializa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    registroAbilitarBtn();
});