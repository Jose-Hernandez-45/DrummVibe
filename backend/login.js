document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const message = document.getElementById('message');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('contrasena');

  togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = form.usuario.value.trim();
    const contrasena = form.contrasena.value;

    if (!usuario || !contrasena) {
      message.textContent = 'Completa todos los campos';
      message.style.color = 'red';
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.textContent = data.error || 'Error en el login';
        message.style.color = 'red';
        return;
      }

      // Guardar datos en localStorage
      localStorage.setItem('usuario', data.usuario || usuario);
      localStorage.setItem('rol', data.rol || '');

      message.textContent = data.message;
      message.style.color = 'green';

      // Redirigir por rol
      setTimeout(() => {
        if (data.rol === 'administrador') {
          window.location.href = '../templates/admin.html';
        } else {
          window.location.href = '../index.html';
        }
      }, 1000);

    } catch (error) {
      message.textContent = 'Error en la conexión con el servidor';
      message.style.color = 'red';
      console.error(error);
    }
  });
});
