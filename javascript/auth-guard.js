// --- 1. Injeta o HTML do Loading assim que o script roda ---
// Isso garante que ele apareça o mais rápido possível
const loadingHTML = `
    <div id="loading-overlay">
        <div class="spinner"></div>
    </div>
`;
document.body.insertAdjacentHTML('afterbegin', loadingHTML);

document.addEventListener('DOMContentLoaded', () => {
    
    // Configurações
    const paginasPublicas = ['index.html', 'home.html', 'sobre.html', 'contato.html', 'campeonatos.html'];
    const paginasRestritas = ['aulas.html', 'materiais.html', 'atletas.html'];
    const paginasAdmin = ['cadastro.html'];

    const path = window.location.pathname;
    const isLoginPage = path.includes('index.html') || path === '/';
    const isRestrictedPage = paginasRestritas.some(p => path.includes(p));
    const isAdminPage = paginasAdmin.some(p => path.includes(p));

    if (!firebase.auth) {
        removerLoading(); // Se der erro, remove o loading pra não travar
        return;
    }

    firebase.auth().onAuthStateChanged(async (user) => {
        const navList = document.querySelector('.nav-list');

        if (user) {
            // --- USUÁRIO LOGADO ---
            const db = firebase.firestore();
            let dados = { tipo: 'aluno', nome: 'Usuário' };
            
            try {
                const docSnap = await db.collection("usuarios").doc(user.uid).get();
                if (docSnap.exists) dados = docSnap.data();
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }

            // Verifica permissão de Admin
            if (isAdminPage && dados.tipo !== 'admin') {
                alert("Acesso Negado.");
                window.location.href = "home.html";
                return;
            }

            configurarMenuLogado(navList, dados);

        } else {
            // --- VISITANTE ---
            if (isRestrictedPage || isAdminPage) {
                window.location.href = "index.html";
                return;
            }
            configurarMenuVisitante(navList);
        }

        // --- FINALIZA O CARREGAMENTO ---
        // Só remove a tela branca depois que o menu estiver pronto
        removerLoading();
    });
});

function removerLoading() {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
        loader.classList.add('loading-hidden');
        // Remove do HTML depois da animação (0.5s)
        setTimeout(() => loader.remove(), 500);
    }
}

function configurarMenuLogado(navList, dados) {
    const itens = navList.querySelectorAll('li');
    
    itens.forEach(li => {
        const link = li.querySelector('a');
        if (!link) return;
        const href = link.getAttribute('href');

        // Mostra páginas restritas
        if (['aulas.html', 'materiais.html', 'atletas.html'].includes(href)) {
            li.style.display = 'block';
        }

        // Botão Cadastro (Só Admin)
        if (href === 'cadastro.html') {
            li.style.display = (dados.tipo === 'admin') ? 'block' : 'none';
        }
    });

    adicionarBotaoPerfil(navList, dados);
}

function configurarMenuVisitante(navList) {
    const itens = navList.querySelectorAll('li');
    itens.forEach(li => {
        const link = li.querySelector('a');
        if (!link) return;
        const href = link.getAttribute('href');

        // Esconde tudo que é privado
        if (['aulas.html', 'materiais.html', 'atletas.html', 'cadastro.html'].includes(href)) {
            li.style.display = 'none';
        }
    });

    // Botão de Login (se não estiver na tela de login)
    if (!window.location.pathname.includes('index.html')) {
        const itemPerfil = document.getElementById('item-perfil-user');
        if (itemPerfil) itemPerfil.remove();

        const li = document.createElement('li');
        li.id = "item-login-btn";
        li.innerHTML = `<a href="index.html" style="color: #00faaf; border: 1px solid #00faaf; padding: 5px 15px; border-radius: 5px;">Login</a>`;
        navList.appendChild(li);
    }
}

function adicionarBotaoPerfil(navList, dados) {
    const btnLogin = document.getElementById('item-login-btn');
    if (btnLogin) btnLogin.remove();
    
    const perfilAntigo = document.getElementById('item-perfil-user');
    if (perfilAntigo) perfilAntigo.remove();

    const li = document.createElement('li');
    li.id = "item-perfil-user";
    
    const foto = dados.fotoUrl || 'imagens/logo.png';
    const nome = dados.nome ? dados.nome.split(' ')[0] : 'Atleta';

    li.innerHTML = `
        <div class="user-menu-container" onclick="toggleLogout()">
            <span class="user-name">Olá, ${nome}</span>
            <img src="${foto}" class="user-avatar">
            <div id="logout-menu" class="logout-dropdown">
                <a href="#" onclick="sairDoSistema()">Sair</a>
            </div>
        </div>
    `;
    navList.appendChild(li);
}

window.toggleLogout = function() {
    const menu = document.getElementById('logout-menu');
    if (menu) menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.sairDoSistema = function() {
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
    });
}