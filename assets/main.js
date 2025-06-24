// Menú hamburguesa en index
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');

  if(menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('show');
    });
  }
});


// Mostrar animación de salida del loader al cargar la página
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.transition = "opacity 0.5s ease";
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
    console.log("Este codigo es de Hernández Galindo José Miguel");
  }
});