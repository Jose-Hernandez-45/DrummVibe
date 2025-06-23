// Creación de la tabla de usuarios
document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.querySelector('#tablaUsuarios tbody');
  const buscador = document.getElementById('buscador');
  let usuarios = [];

  // Caragar usuarios desde la base de datos
  async function cargarUsuarios() {
    try {
      const res = await fetch('http://localhost:5000/usuarios');
      usuarios = await res.json();
      mostrarUsuarios(usuarios);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  }

  //Mostrar los usuaris dentro de la tabla
  function mostrarUsuarios(lista) {
    tabla.innerHTML = '';
    lista.forEach(user => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${user.usuario}</td>
        <td>${user.correo}</td>
        <td><input type="checkbox" class="admin-checkbox" ${user.rol === 'administrador' ? 'checked' : ''}></td>
      `;

      // Administradores agregación
      fila.dataset.usuario = user.usuario;
      tabla.appendChild(fila);
    });
  }

  //buscador de usuraios
  buscador.addEventListener('input', () => {
    const texto = buscador.value.toLowerCase();
    const filtrados = usuarios.filter(u => u.usuario.toLowerCase().includes(texto));
    mostrarUsuarios(filtrados);
  });

  // Boton de guardar cambios
  document.getElementById('guardarCambios').addEventListener('click', async () => {
    const filas = tabla.querySelectorAll('tr');
    const cambios = [];

    // Agregar administradores por checkbox
    filas.forEach(fila => {
      const usuario = fila.dataset.usuario;
      const esAdmin = fila.querySelector('.admin-checkbox').checked;
      cambios.push({ usuario, rol: esAdmin ? 'administrador' : 'usuario' });
    });


    // Actualizacion y cambios
    try {
      const res = await fetch('http://localhost:5000/usuarios/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cambios),
      });
      const data = await res.json();
      alert(data.message || 'Cambios guardados');
    } catch (error) {
      console.error(error);
      alert('Error al guardar los cambios');
    }
  });

  cargarUsuarios();
});
