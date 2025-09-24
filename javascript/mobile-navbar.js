// Define a classe MobileNavbar para controlar o menu mobile
class MobileNavbar {
    constructor(){
        // Seleciona o botão do menu mobile
        this.mobileMenu = document.querySelector('.mobile-menu');
        // Seleciona a lista de navegação
        this.navList = document.querySelector('.nav-list');
        // Seleciona todos os links da navegação (mas o seletor correto seria '.nav-list li' se quiser os itens)
        this.navLinks = document.querySelectorAll('.nav-list li');
        // Classe que será usada para ativar/desativar o menu
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this); // Garante que o 'this' dentro de handleClick se refira à instância da classe
    }

   animateLinks() {
        this.navLinks.forEach((link, index) => {
            link.style.animation
            ? (link.style.animation = "")
            : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`);
        });
    }
    handleClick() {
        // Alterna a classe ativa no menu e na lista de navegação
        this.navList.classList.toggle(this.activeClass);
        this.mobileMenu.classList.toggle(this.activeClass); // Anima os links da navegação
        this.animateLinks();
    }
    // Adiciona o evento de clique ao botão do menu mobile
    addclickEvent() {
        this.mobileMenu.addEventListener("click", this.handleClick);
    }

    // Inicializa a navbar mobile, adicionando o evento se o botão existir onde ele add  
    init () {
        if (this.mobileMenu) {
            this.addclickEvent();
        }
        return this; 
    }
}

// Cria uma instância da classe MobileNavbar
// ATENÇÃO: O construtor não espera parâmetros, então os argumentos abaixo são ignorados
const mobileNavbar = new MobileNavbar(
    ".mobile-menu",
    ".nav-list",
    ".nav-list li"
);
// Inicializa a navbar mobile
mobileNavbar.init();