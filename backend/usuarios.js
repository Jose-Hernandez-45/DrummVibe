document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.querySelector('#tablaUsuarios tbody');
  const buscador = document.getElementById('buscador');
  const mensaje = document.getElementById('mensajeCambios'); // Un div para mensajes (añadir en HTML)
  let usuarios = [];

  const API_URL = location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://drummvibe2-0.onrender.com';

  async function cargarUsuarios() {
    try {
      const res = await fetch(`${API_URL}/usuarios`);
      if (!res.ok) throw new Error('Error al obtener usuarios');
      usuarios = await res.json();
      mostrarUsuarios(usuarios);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      mostrarMensaje('No se pudieron cargar los usuarios.', false);
    }
  }

  function mostrarUsuarios(lista) {
    tabla.innerHTML = '';
    lista.forEach(user => {
      const fila = document.createElement('tr');

      // Crear celdas de forma segura (sin innerHTML)
      const tdUsuario = document.createElement('td');
      tdUsuario.textContent = user.usuario;

      const tdCorreo = document.createElement('td');
      tdCorreo.textContent = user.correo;

      const tdRol = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'admin-checkbox';
      checkbox.checked = user.rol === 'administrador';
      checkbox.id = `chk-${user.usuario}`;
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = 'Admin';

      tdRol.appendChild(checkbox);
      tdRol.appendChild(label);

      fila.appendChild(tdUsuario);
      fila.appendChild(tdCorreo);
      fila.appendChild(tdRol);

      fila.dataset.usuario = user.usuario;
      tabla.appendChild(fila);
    });
  }

  buscador.addEventListener('input', () => {
    const texto = buscador.value.toLowerCase();
    const filtrados = usuarios.filter(u => u.usuario.toLowerCase().includes(texto));
    mostrarUsuarios(filtrados);
  });

  function mostrarMensaje(texto, exito = true) {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.style.color = exito ? '#49cc21' : '#da0700';
  }

  document.getElementById('guardarCambios').addEventListener('click', async () => {
    const filas = tabla.querySelectorAll('tr');
    const cambios = [];

    filas.forEach(fila => {
      const usuario = fila.dataset.usuario;
      const esAdmin = fila.querySelector('.admin-checkbox').checked;
      cambios.push({ usuario, rol: esAdmin ? 'administrador' : 'usuario' });
    });

    try {
      const res = await fetch(`${API_URL}/usuarios/actualizar`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas JWT
        },
        body: JSON.stringify(cambios),
      });
      const data = await res.json();

      if (res.ok) {
        mostrarMensaje(data.message || 'Cambios guardados correctamente.');
      } else {
        mostrarMensaje(data.error || 'Error al guardar cambios.', false);
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje('Error al guardar los cambios.', false);
    }
  });

  cargarUsuarios();
});
