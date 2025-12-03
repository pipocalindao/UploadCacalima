document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.athlete-list');

    // Verifica se o Firebase e o Firestore estão carregados
    if (!firebase.firestore) {
        console.error("Firestore não carregado.");
        container.innerHTML = '<p style="color: white; text-align: center;">Erro ao carregar banco de dados.</p>';
        return;
    }

    const db = firebase.firestore();

    // Busca apenas usuários que são 'aluno'
    db.collection("usuarios")
      .where("tipo", "==", "aluno")
      .get()
      .then((querySnapshot) => {
        
        // Limpa o conteúdo estático (se houver)
        container.innerHTML = "";

        if (querySnapshot.empty) {
            container.innerHTML = '<p style="color: #77B1A9; text-align: center; width: 100%;">Nenhum atleta cadastrado ainda.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const atleta = doc.data();
            criarCardAtleta(atleta);
        });
    })
    .catch((error) => {
        console.error("Erro ao buscar atletas:", error);
        container.innerHTML = '<p style="color: white; text-align: center;">Erro ao carregar lista de atletas.</p>';
    });
});

function criarCardAtleta(dados) {
    const container = document.querySelector('.athlete-list');
    
    // Dados padrão caso falte algo
    const foto = dados.fotoUrl || 'imagens/logo.png'; // Foto padrão
    const nome = dados.nome || 'Atleta sem nome';
    const faixa = dados.faixa || 'Branca';
    const nascimento = dados.dataNascimento;
    
    // Calcula idade
    let idade = "Data não informada";
    if (nascimento) {
        const dataNasc = new Date(nascimento);
        const hoje = new Date();
        let anos = hoje.getFullYear() - dataNasc.getFullYear();
        const m = hoje.getMonth() - dataNasc.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
            anos--;
        }
        idade = `${anos} anos`;
    }

    // Capitalizar a faixa (ex: "azul" -> "Azul")
    const faixaFormatada = faixa.charAt(0).toUpperCase() + faixa.slice(1);

    // Cria o HTML do card
    const card = document.createElement('div');
    card.classList.add('athlete-card');

    card.innerHTML = `
        <img src="${foto}" alt="Foto de ${nome}" class="athlete-photo">
        <div class="athlete-info">
            <h3>${nome}</h3>
            <div class="athlete-details">
                <span><i class="fas fa-award"></i> Faixa ${faixaFormatada}</span>
                <span><i class="fas fa-birthday-cake"></i> ${idade}</span>
            </div>
            <p class="athlete-bio">Atleta do time Caca Lima College.</p>
        </div>
    `;

    container.appendChild(card);
}