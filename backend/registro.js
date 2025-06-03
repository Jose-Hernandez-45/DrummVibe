document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('contrasena');
    const form = document.getElementById('registroForm');
    const message = document.getElementById('message');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Alterna las clases de FontAwesome para cambiar el icono
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usuario = document.getElementById('usuario').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const contrasena = passwordInput.value;

            if (!usuario || !correo || !contrasena) {
                message.textContent = 'Por favor, completa todos los campos.';
                message.style.color = '#da0700';
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, correo, contrasena }),
                });

                const data = await res.json();

                if (!res.ok) {
                    message.textContent = data.error || 'Error en el registro';
                    message.style.color = '#da0700';
                    return;
                }

                message.textContent = data.message;
                message.style.color = '#49cc21';
                form.reset();

            } catch (error) {
                message.textContent = 'Error en la conexión con el servidor';
                message.style.color = '#da0700';
                console.error(error);
            }
        });
    }
});
