// WATER OF LIFE - Script base

document.addEventListener("DOMContentLoaded", function() {
  console.log("WATER OF LIFE cargado correctamente");

  // Efecto simple al hacer clic en navegación
  const links = document.querySelectorAll("nav a");

  links.forEach(link => {
    link.addEventListener("click", function() {
      console.log("Navegando a:", this.getAttribute("href"));
    });
  });
});
