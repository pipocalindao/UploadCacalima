// Aguarda o documento HTML ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todos os botões de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Seleciona todas as seções de categoria (os itens que serão filtrados)
    const filterItems = document.querySelectorAll('.category-section.filter-item');

    // Adiciona um evento de clique para cada botão de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pega o valor do atributo 'data-filter' do botão clicado
            // ex: "all", "passagem", "guarda", etc.
            const filterValue = button.getAttribute('data-filter');

            // --- Etapa 1: Atualiza o estado "active" dos botões ---
            
            // Remove a classe 'active' de TODOS os botões
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            // Adiciona a classe 'active' APENAS ao botão que foi clicado
            button.classList.add('active');

            // --- Etapa 2: Filtra os itens (seções de categoria) ---

            filterItems.forEach(item => {
                // Verifica se o filtro é "all"
                if (filterValue === 'all') {
                    // Se for "all", remove a classe 'hide' de todos os itens
                    item.classList.remove('hide');
                } else {
                    // Se não for "all":
                    // Verifica se o item (seção) NÃO possui a classe do filtro clicado
                    if (!item.classList.contains(filterValue)) {
                        // Se NÃO possui, adiciona a classe 'hide' para escondê-lo
                        item.classList.add('hide');
                    } else {
                        // Se POSSUI, remove a classe 'hide' para mostrá-lo
                        item.classList.remove('hide');
                    }
                }
            });
        });
    });
});