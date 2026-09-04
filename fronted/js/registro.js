const URL_API = 'https://api-colombia.com/api/v1';

const selectDepto  = document.querySelector('#reg-departamento');
const selectMuni   = document.querySelector('#reg-municipio');
const formRegistro = document.querySelector('#form-registro');

// ── PASO 1: Cargar departamentos al abrir la página ──────────────────────────
async function cargarDepartamentos() {
  try {
    selectDepto.innerHTML = '<option value="">Cargando departamentos...</option>';

    const respuesta     = await fetch(`${URL_API}/Department`);
    const departamentos = await respuesta.json();

    // Ordenar alfabéticamente por nombre
    departamentos.sort(function(a, b) { return a.name.localeCompare(b.name); });

    // Opción inicial vacía + una opción por departamento
    selectDepto.innerHTML = '<option value="">-- Selecciona un departamento --</option>';
    departamentos.forEach(function(depto) {
      const opcion = document.createElement('option');
      opcion.value       = depto.id;       // id para consultar los municipios en el endpoint
      opcion.textContent = depto.name;
      selectDepto.appendChild(opcion);
    });

  } catch (error) {
    selectDepto.innerHTML = '<option value="">Error al cargar. Recarga la página.</option>';
    console.error('Error cargando departamentos:', error);
  }
}

// ── PASO 2: Cargar municipios cuando el usuario elige un departamento ─────────
async function cargarMunicipios(idDepartamento) {
  try {
    selectMuni.disabled = true;
    selectMuni.innerHTML = '<option value="">Cargando municipios...</option>';

    const respuesta  = await fetch(`${URL_API}/Department/${idDepartamento}/cities`);
    const municipios = await respuesta.json();

    // Ordenar alfabéticamente
    municipios.sort(function(a, b) { return a.name.localeCompare(b.name); });

    selectMuni.innerHTML = '<option value="">-- Selecciona un municipio --</option>';
    municipios.forEach(function(muni) {
      const opcion = document.createElement('option');
      opcion.value       = muni.name;
      opcion.textContent = muni.name;
      selectMuni.appendChild(opcion);
    });
    selectMuni.disabled = false;

  } catch (error) {
    selectMuni.innerHTML = '<option value="">Error al cargar municipios.</option>';
    console.error('Error cargando municipios:', error);
  }
}

// ── PASO 3: Escuchar cambio en el select de departamento ─────────────────────
selectDepto.addEventListener('change', function() {
  const idSeleccionado = selectDepto.value;

  if (!idSeleccionado) {
    selectMuni.innerHTML = '<option value="">Primero elige un departamento</option>';
    selectMuni.disabled  = true;
    return;
  }

  cargarMunicipios(idSeleccionado);
});

// ── PASO 4: Validar y registrar usuario ──────────────────────────────────────
if (formRegistro) {
  formRegistro.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    const nombre = document.querySelector('#reg-nombre').value.trim();
    const email = document.querySelector('#reg-email').value.trim();
    const password = document.querySelector('#reg-password').value;
    const municipio = selectMuni.value;

    let hayErrores = false;

    // Validar nombre
    if (nombre.length < 3) {
      document.querySelector('#error-reg-nombre').textContent = 'Escribe tu nombre completo';
      hayErrores = true;
    } else {
      document.querySelector('#error-reg-nombre').textContent = '';
    }

    // Validar email
    if (!email.includes('@') || email.length < 5) {
      document.querySelector('#error-reg-email').textContent = 'Ingresa un correo válido';
      hayErrores = true;
    } else {
      document.querySelector('#error-reg-email').textContent = '';
    }

    // Validar contraseña
    if (password.length < 6) {
      document.querySelector('#error-reg-password').textContent = 'La contraseña debe tener al menos 6 caracteres';
      hayErrores = true;
    } else {
      document.querySelector('#error-reg-password').textContent = '';
    }

    // Validar departamento
    if (!selectDepto.value) {
      document.querySelector('#error-reg-departamento').textContent = 'Selecciona un departamento';
      hayErrores = true;
    } else {
      document.querySelector('#error-reg-departamento').textContent = '';
    }

    // Validar municipio
    if (!municipio) {
      document.querySelector('#error-reg-municipio').textContent = 'Selecciona un municipio';
      hayErrores = true;
    } else {
      document.querySelector('#error-reg-municipio').textContent = '';
    }

    // Si no hay errores, enviar los datos al servidor
    if (!hayErrores) {
      try {
        const respuesta = await fetch('http://localhost:3000/api/auth/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre:       nombre,
            email:        email,
            password:     password,
            departamento: selectDepto.options[selectDepto.selectedIndex].textContent,
            municipio:    municipio
          })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          document.querySelector('#error-reg-email').textContent =
            datos.error || 'Error al crear la cuenta';
          return;
        }

        document.querySelector('#registro-exito').style.display = 'block';
        formRegistro.reset();
        selectMuni.innerHTML = '<option value="">Primero elige un departamento</option>';
        selectMuni.disabled  = true;

      } catch (error) {
        document.querySelector('#error-reg-nombre').textContent =
          'No se pudo conectar. Verifica que npm run dev esté corriendo.';
      }
    }
  });
}

// ── EJECUCIÓN INICIAL ────────────────────────────────────────────────────────
// Llama a la API de departamentos al cargar la página
document.addEventListener('DOMContentLoaded', cargarDepartamentos);