document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formClase');
  const mensaje = document.getElementById('mensajeClase');
  const buscador = document.getElementById('buscar');
  const filtroNivel = document.getElementById('filtroNivel');
  const limpiarBtn = document.getElementById('limpiarFiltros');
  const tbody = document.getElementById('tbodyClases');

  const contenedoresPanel = {
    '1': document.getElementById('panel-basico'),
    '2': document.getElementById('panel-intermedio'),
    '3': document.getElementById('panel-avanzado'),
  };

  const API_URL = location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://drummvibe2-0.onrender.com';

  // Función para escapar texto y prevenir XSS
  function escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Obtener token JWT del almacenamiento local (o cookie, según implementación)
  function getToken() {
    return localStorage.getItem('token'); // Ajusta según tu auth
  }

  // Mostrar mensajes
  function mostrarMensaje(texto, color = 'white') {
    if (mensaje) {
      mensaje.textContent = texto;
      mensaje.style.color = color;
    }
  }

  // Guardar clase
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const titulo = form['titulo'].value.trim();
      const descripcion = form['descripcion'].value.trim();
      const video = form['video'].value.trim();
      const nivel = form['nivel'].value;

      if (!titulo || !descripcion || !video || !nivel) {
        mostrarMensaje('Por favor completa todos los campos requeridos.', 'orange');
        return;
      }

      const formData = new FormData(form);

      try {
        const res = await fetch(`${API_URL}/clases`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          mostrarMensaje(data.error || 'Error al guardar la clase.', 'red');
          return;
        }

        mostrarMensaje('Clase guardada correctamente, puedes regresar', 'lightgreen');
        setTimeout(() => {
          form.reset();
          // Opcional: redirigir a otra página
        }, 5000);
      } catch (error) {
        console.error(error);
        mostrarMensaje('Error al conectar con el servidor.', 'red');
      }
    });
  }

  // Cargar clases con filtros
  async function cargarClases(filtroTexto = '', filtroNivel = '') {
    if (!tbody) return;

    try {
      const res = await fetch(`${API_URL}/clases`);
      if (!res.ok) throw new Error('Error al obtener clases');
      const clases = await res.json();

      tbody.innerHTML = '';

      const nivelesTexto = {
        '1': 'Básico',
        '2': 'Intermedio',
        '3': 'Avanzado',
      };

      const clasesFiltradas = clases.filter(clase => {
        const titulo = clase.titulo?.toLowerCase() || '';
        const coincideTexto = titulo.includes(filtroTexto.toLowerCase());
        const coincideNivel = filtroNivel ? String(clase.nivel) === filtroNivel : true;
        return coincideTexto && coincideNivel;
      });

      clasesFiltradas.forEach(clase => {
        const textoNivel = nivelesTexto[String(clase.nivel)] || 'Sin especificar';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHTML(clase.titulo)}</td>
          <td>${escapeHTML(textoNivel)}</td>
          <td>
            <button class="btn btn-sm btn-warning btnEditar" data-id="${escapeHTML(clase._id)}" aria-label="Editar clase ${escapeHTML(clase.titulo)}">
              <i class="fa-solid fa-pen-to-square"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger btnEliminar" data-id="${escapeHTML(clase._id)}" aria-label="Eliminar clase ${escapeHTML(clase.titulo)}">
              <i class="fa-solid fa-trash"></i> Borrar
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      agregarEventosBotones();
    } catch (error) {
      console.error('Error al cargar clases:', error);
      tbody.innerHTML = '<tr><td colspan="3" style="color:red;">Error al cargar clases</td></tr>';
    }
  }

  // Cargar clases en panel
  async function cargarClasesEnPanel() {
    const algunoExiste = Object.values(contenedoresPanel).some(div => div);
    if (!algunoExiste) return;

    try {
      const res = await fetch(`${API_URL}/clases`);
      if (!res.ok) throw new Error('Error al obtener clases');
      const clases = await res.json();

      Object.values(contenedoresPanel).forEach(div => {
        if (div) div.innerHTML = '';
      });

      clases.forEach(clase => {
        const divClase = document.createElement('div');
        divClase.classList.add('clase-card', `nivel-${clase.nivel}`);

        divClase.innerHTML = `
          <h5 class="clase-titulo">${escapeHTML(clase.titulo)}</h5>
          <p class="clase-descripcion">${escapeHTML(clase.descripcion)}</p>
          <a class="clase-video" href="${escapeHTML(clase.video)}" target="_blank" rel="noopener noreferrer">Ver video</a>
        `;

        const contenedor = contenedoresPanel[clase.nivel];
        if (contenedor) contenedor.appendChild(divClase);
      });
    } catch (error) {
      console.error('Error al cargar clases en panel:', error);
      Object.values(contenedoresPanel).forEach(div => {
        if (div) div.innerHTML = '<p style="color: red;">Error al cargar clases</p>';
      });
    }
  }

  // Agregar eventos a botones editar y eliminar
  function agregarEventosBotones() {
    document.querySelectorAll('.btnEliminar').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('¿Seguro que quieres eliminar esta clase?')) {
          try {
            const res = await fetch(`${API_URL}/clases/${encodeURIComponent(id)}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) {
              alert('Clase eliminada');
              aplicarFiltros();
            } else {
              alert('Error al eliminar clase');
            }
          } catch (error) {
            alert('Error al eliminar clase');
            console.error(error);
          }
        }
      });
    });

    document.querySelectorAll('.btnEditar').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.location.href = `./editar_clase.html?id=${encodeURIComponent(id)}`;
      });
    });
  }

  // Aplicar filtros
  function aplicarFiltros() {
    const texto = buscador?.value || '';
    const nivel = filtroNivel?.value || '';
    cargarClases(texto, nivel);
  }

  // Eventos de filtros
  if (buscador) buscador.addEventListener('input', aplicarFiltros);
  if (filtroNivel) filtroNivel.addEventListener('change', aplicarFiltros);
  if (limpiarBtn) {
    limpiarBtn.addEventListener('click', () => {
      buscador.value = '';
      filtroNivel.value = '';
      aplicarFiltros();
    });
  }

  // Inicialización
  if (tbody) cargarClases();
  if (Object.values(contenedoresPanel).some(div => div)) cargarClasesEnPanel();
});