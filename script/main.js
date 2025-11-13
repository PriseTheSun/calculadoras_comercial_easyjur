// Menu mobile
document
  .getElementById("mobile-menu-button")
  .addEventListener("click", function () {
    document.getElementById("mobile-menu").classList.toggle("hidden");
  });

// Navegação entre páginas
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    // Atualizar navegação
    navLinks.forEach((l) => l.classList.remove("easyjur-text-dark"));
    navLinks.forEach((l) => l.classList.add("easyjur-text-gray"));
    this.classList.remove("easyjur-text-gray");
    this.classList.add("easyjur-text-dark");

    // Fechar menu mobile se estiver aberto
    document.getElementById("mobile-menu").classList.add("hidden");
  });
});
