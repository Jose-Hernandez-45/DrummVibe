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


// Loader en index
window.addEventListener("load", () => {
  console.log("Página cargada, ocultando loader...");
  const loader = document.getElementById("loader");
  if (loader) {
    console.log("Loader encontrado:", loader);
    loader.style.transition = "opacity 0.5s ease";
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => {
      loader.style.display = "none";
      console.log("Loader ocultado.");
    }, 500);
  } else {
    console.log("Loader NO encontrado.");
  }
});

