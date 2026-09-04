// frontend/js/login.js

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const inputEmail = document.getElementById('login-email');
  const inputPassword = document.getElementById('login-password');
  const errorEmail = document.getElementById('error-login-email');
  const errorPassword = document.getElementById('error-login-password');
  const msjLogin = document.getElementById('msj-login');

  if (!formLogin) return;

  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    errorEmail.textContent = '';
    errorPassword.textContent = '';
    msjLogin.textContent = '';
    msjLogin.className = 'mensaje-exito';

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();
    let hayError = false;

    // Validaciones básicas en el frontend
    if (!email) {
      errorEmail.textContent = 'El correo electrónico es obligatorio.';
      hayError = true;
    }

    if (!password) {
      errorPassword.textContent = 'La contraseña es obligatoria.';
      hayError = true;
    }

    if (hayError) return;

    try {
      // Petición al endpoint de autenticación del backend
      const respuesta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Guardar el token JWT o los datos de sesión en localStorage
        if (datos.token) {
          localStorage.setItem('token', datos.token);
        }
        if (datos.usuario) {
          localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        }

        msjLogin.style.color = '#10b981';
        msjLogin.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';

        // Redirigir a la página principal tras inicio de sesión exitoso
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);

      } else {
        // Mostrar mensaje de error proveniente de la API
        msjLogin.style.color = '#ef4444';
        msjLogin.textContent = datos.mensaje || 'Credenciales incorrectas.';
      }
    } catch (error) {
      console.error('Error en la petición de login:', error);
      msjLogin.style.color = '#ef4444';
      msjLogin.textContent = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
    }
  });
});