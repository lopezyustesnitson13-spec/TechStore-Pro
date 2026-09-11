// ================================================
// MENÚ HAMBURGUESA
// ================================================

const botonMenu = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');

if (botonMenu && navMenu) {
  botonMenu.addEventListener('click', function() {
    navMenu.classList.toggle('open');
    const estaAbierto = navMenu.classList.contains('open');
    botonMenu.setAttribute('aria-expanded', estaAbierto);
  });

  const enlaces = navMenu.querySelectorAll('a');
  enlaces.forEach(function(enlace) {
    enlace.addEventListener('click', function() {
      navMenu.classList.remove('open');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

// ================================================
// VALIDAR FORMULARIO DE CONTACTO
// ================================================

const formulario = document.querySelector('#form-contacto');

if (formulario) {
  function mostrarError(idCampo, mensaje) {
    const campo = document.querySelector('#' + idCampo);
    const spanError = document.querySelector('#error-' + idCampo);
    if (campo && spanError) {
      campo.closest('.campo').classList.add('tiene-error');
      spanError.textContent = mensaje;
    }
  }

  function limpiarError(idCampo) {
    const campo = document.querySelector('#' + idCampo);
    const spanError = document.querySelector('#error-' + idCampo);
    if (campo && spanError) {
      campo.closest('.campo').classList.remove('tiene-error');
      spanError.textContent = '';
    }
  }

  formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    let hayErrores = false;

    const valorNombre = document.querySelector('#nombre').value.trim();
    if (valorNombre.length < 3) {
      mostrarError('nombre', 'Escribe tu nombre completo (mínimo 3 caracteres)');
      hayErrores = true;
    } else {
      limpiarError('nombre');
    }

    const valorEmail = document.querySelector('#email').value.trim();
    if (!valorEmail.includes('@') || valorEmail.length < 5) {
      mostrarError('email', 'Ingresa un correo válido (debe tener @)');
      hayErrores = true;
    } else {
      limpiarError('email');
    }

    const valorAsunto = document.querySelector('#asunto').value;
    if (valorAsunto === '') {
      mostrarError('asunto', 'Selecciona un asunto');
      hayErrores = true;
    } else {
      limpiarError('asunto');
    }

    const valorMensaje = document.querySelector('#mensaje').value.trim();
    if (valorMensaje.length < 10) {
      mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
      hayErrores = true;
    } else {
      limpiarError('mensaje');
    }

    if (!hayErrores) {
      const exito = document.querySelector('#form-exito');
      if (exito) exito.style.display = 'block';
      formulario.reset();
    }
  });
}

// ================================================
// TARJETAS DINÁMICAS DESDE ARRAY
// ================================================

function crearTarjeta(producto) {
  return `
    <article class="tarjeta"
      data-id="${producto._id}"
      data-icono="${producto.icono || '📦'}"
      data-nombre="${producto.nombre}"
      data-desc="${producto.descripcion}"
      data-precio="${producto.precio}"
      data-imagen="${producto.imagen || ''}">
      
      <span class="badge-disponible">✓ Disponible</span>

      <img src="${producto.imagen}" 
           alt="${producto.nombre}" 
           class="tarjeta-img">

      <div class="tarjeta-info">
        <h3 class="tarjeta-nombre">${producto.nombre}</h3>
        <p class="tarjeta-desc">${producto.descripcion}</p>

        <div class="tarjeta-pie">
          <span class="tarjeta-precio">${producto.precio}</span>
          <a href="producto.html?id=${producto._id || producto.id || ''}" class="btn-accion">Ver más</a>
        </div>
      </div>
    </article>
  `;
}

// ================================================
// MODAL PRODUCTO (Declarado antes para evitar errores)
// ================================================

const modal = document.querySelector('#modal-producto');

function abrirModal(tarjeta) {
  document.querySelector('#modal-icono').textContent  = tarjeta.dataset.icono  || '📦';
  document.querySelector('#modal-titulo').textContent = tarjeta.dataset.nombre || 'Producto';
  document.querySelector('#modal-desc').textContent   = tarjeta.dataset.desc   || '';
  document.querySelector('#modal-precio').textContent = tarjeta.dataset.precio || '';
  if (modal) {
    modal.dataset.imagen = tarjeta.dataset.imagen || '';
    modal.dataset.id     = tarjeta.dataset.id     || '';
    modal.classList.add('visible');
  }
}

function registrarBotonesModal() {
  document.querySelectorAll('.btn-accion').forEach(function(boton) {
    if (boton.tagName === 'A') return;
    boton.addEventListener('click', function() {
      abrirModal(boton.closest('.tarjeta'));
    });
  });
}

if (modal) {
  const btnCerrar = document.querySelector('#modal-cerrar');

  if (btnCerrar) {
    btnCerrar.addEventListener('click', function() {
      modal.classList.remove('visible');
    });
  }

  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('visible');
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') modal.classList.remove('visible');
  });
}

// ================================================
// S08: CARGAR PRODUCTOS DESDE JSON
// ================================================

async function cargarProductos() {
  const grid = document.querySelector('#grid-tarjetas');
  if (!grid) return;

  try { 
    const respuesta = await fetch('http://localhost:3000/api/productos');
    const productos = await respuesta.json();
    grid.innerHTML = productos.map(crearTarjeta).join('');

    registrarBotonesModal();
    registrarBadgeHover();
    registrarBuscador();

  } catch (error) {
    grid.innerHTML = `
      <div class="error-fetch">
        <p>⚠️ No se pudieron cargar los productos.</p>
        <button onclick="cargarProductos()" class="btn btn-primario">Reintentar</button>
      </div>
    `;
    console.error('Error al cargar productos:', error);
  }
}

cargarProductos();

// ================================================
// BARRA DE PROGRESO SCROLL
// ================================================

const barraScroll = document.querySelector('#barra-scroll');
if (barraScroll) {
  window.addEventListener('scroll', function() {
    const totalDesplazamiento = document.body.scrollHeight - window.innerHeight;
    const porcentaje = (window.scrollY / totalDesplazamiento) * 100;
    barraScroll.style.width = porcentaje + '%';
  });
}

// ================================================
// BADGE HOVER EN TARJETAS Y TIEMPO REAL
// ================================================

function registrarBadgeHover() {
  document.querySelectorAll('.tarjeta').forEach(function(tarjeta) {
    const badge = tarjeta.querySelector('.badge-disponible');
    if (badge) {
      tarjeta.addEventListener('mouseover', function() { badge.classList.add('visible'); });
      tarjeta.addEventListener('mouseout',  function() { badge.classList.remove('visible'); });
    }
  });
}

function registrarBuscador() {
  const buscador = document.querySelector('#buscador');
  if (!buscador) return;
  buscador.addEventListener('input', function() {
    const termino = buscador.value.toLowerCase().trim();
    document.querySelectorAll('.tarjeta').forEach(function(tarjeta) {
      const nombre = tarjeta.dataset.nombre.toLowerCase();
      if (nombre.includes(termino) || termino === '') {
        tarjeta.style.display = 'block';
      } else {
        tarjeta.style.display = 'none';
      }
    });
  });
}

// ================================================
// TEMA OSCURO
// ================================================

function aplicarTemaGuardado() {
  const tema = localStorage.getItem('tema');
  if (tema === 'oscuro') {
    document.body.classList.add('tema-oscuro');
    const btn = document.getElementById('btn-tema');
    if (btn) btn.textContent = '☀️';
  }
}

function toggleTema() {
  const esOscuro = document.body.classList.toggle('tema-oscuro');
  const btn = document.getElementById('btn-tema');
  if (esOscuro) {
    localStorage.setItem('tema', 'oscuro');
    if (btn) btn.textContent = '☀️';
  } else {
    localStorage.setItem('tema', 'claro');
    if (btn) btn.textContent = '🌙';
  }
}

const btnTema = document.getElementById('btn-tema');
if (btnTema) {
  btnTema.addEventListener('click', toggleTema);
}

aplicarTemaGuardado();

// ================================================
// CARRITO DE COMPRAS (MÓDULO 1)
// ================================================

function leerCarrito() {
  const guardado = localStorage.getItem('carrito');
  return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarBadge();
}

function actualizarBadge() {
  const badge = document.getElementById('carrito-badge');
  if (!badge) return;
  const carrito = leerCarrito();
  badge.textContent = carrito.length;
}

function agregarAlCarrito(producto) {
  const carrito = leerCarrito();
  carrito.push(producto);
  guardarCarrito(carrito);
  alert(`✅ ${producto.nombre} agregado al carrito`);
}

const btnModalCarrito = document.querySelector('.modal-btn-carrito');
if (btnModalCarrito) {
  btnModalCarrito.addEventListener('click', function() {
    const modalEl = document.getElementById('modal-producto');
    const producto = {
      id:     modalEl.dataset.id    || '',
      nombre: document.getElementById('modal-titulo').textContent,
      precio: document.getElementById('modal-precio').textContent,
      icono:  document.getElementById('modal-icono').textContent,
      imagen: modalEl.dataset.imagen || '',
      fecha: new Date().toLocaleDateString('es-CO')
    };
    agregarAlCarrito(producto);
    modalEl.classList.remove('visible');
  });
}

actualizarBadge();

const badgeContenedor = document.querySelector('.carrito-badge-contenedor');
if (badgeContenedor) {
  badgeContenedor.addEventListener('click', function() {
    window.location.href = 'carrito.html';
  });
}

// ================================================
// PÁGINA CARRITO - Solo se ejecuta en carrito.html
// ================================================

function mostrarPaginaCarrito() {
  const lista = document.getElementById('lista-carrito');
  const resumen = document.getElementById('carrito-resumen');
  if (!lista) return;

  const carrito = leerCarrito();

  if (carrito.length === 0) {
    if (resumen) resumen.textContent = 'Tu carrito está vacío';
    lista.innerHTML = '<p class="carrito-vacio">No hay productos en el carrito. <a href="index.html">Ver productos →</a></p>';
    return;
  }

  if (resumen) resumen.textContent = `${carrito.length} producto(s) en el carrito`;
  lista.innerHTML = '';

  carrito.forEach(function(producto, indice) {
    const item = document.createElement('div');
    item.classList.add('carrito-item');

    const imagenHTML = producto.imagen
    ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-item-img">`
    : `<span class="carrito-item-icono">${producto.icono || '📦'}</span>`;

    item.innerHTML = `
      ${imagenHTML}
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${producto.nombre}</div>
        <div class="carrito-item-precio">${producto.precio}</div>
        <div class="carrito-item-fecha">Agregado: ${producto.fecha || 'Hoy'}</div>
      </div>
      <button class="btn-eliminar" data-indice="${indice}">Eliminar</button>
    `;
    lista.appendChild(item);
  });

  document.querySelectorAll('.btn-eliminar').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const indice = parseInt(this.dataset.indice);
      const carritoActual = leerCarrito();
      carritoActual.splice(indice, 1);
      guardarCarrito(carritoActual);
      mostrarPaginaCarrito();
    });
  });
}

const btnVaciar = document.getElementById('btn-vaciar');
if (btnVaciar) {
  btnVaciar.addEventListener('click', function() {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
      localStorage.removeItem('carrito');
      actualizarBadge();
      mostrarPaginaCarrito();
    }
  });
}

mostrarPaginaCarrito();

function actualizarNavSesion() {
  const token      = localStorage.getItem('token');
  const nombre     = localStorage.getItem('usuario-nombre');
  const enlaceLogin = document.querySelector('#nav-login');
  if (!enlaceLogin) return;

  if (token && nombre) {
    const wrapper = document.createElement('div');
    wrapper.className = 'usuario-dropdown';
    const btn = document.createElement('button');
    btn.className = 'usuario-btn';
    btn.textContent = '👤 ' + nombre;

    const menu = document.createElement('div');
    menu.className = 'usuario-menu';
    const linkPerfil = document.createElement('a');
    linkPerfil.href = 'perfil.html'; linkPerfil.textContent = '👤 Mi perfil';
    const linkPedidos = document.createElement('a');
    linkPedidos.href = 'mispedidos.html'; linkPedidos.textContent = '📦 Mis pedidos';
    const sep = document.createElement('div');
    sep.className = 'menu-separador';
    const btnCerrar = document.createElement('button');
    btnCerrar.className = 'btn-cerrar-sesion';
    btnCerrar.textContent = '🚪 Cerrar sesión';
    btnCerrar.addEventListener('click', function() {
      localStorage.removeItem('token'); localStorage.removeItem('usuario-nombre');
      window.location.href = 'login.html';
    });
    menu.appendChild(linkPerfil); menu.appendChild(linkPedidos);
    menu.appendChild(sep); menu.appendChild(btnCerrar);
    wrapper.appendChild(btn); wrapper.appendChild(menu);

    const navMenu = document.querySelector('#nav-menu');
    if (navMenu) navMenu.querySelectorAll('a').forEach(function(a) {
      if (a.href.includes('registro.html')) a.style.display = 'none';
    });

    enlaceLogin.parentNode.replaceChild(wrapper, enlaceLogin);

    btn.addEventListener('click', function(e) {
      e.stopPropagation(); menu.classList.toggle('abierto');
    });
    document.addEventListener('click', function(e) {
      if (!wrapper.contains(e.target)) menu.classList.remove('abierto');
    });

  } else {
    enlaceLogin.textContent = 'Login';
    enlaceLogin.href = 'login.html';
  }
}

actualizarNavSesion();

// ==== CHECKOUT - CONFIRMAR PEDIDO ====

const btnConfirmar = document.getElementById('btn-confirmar');

if (btnConfirmar) {
  btnConfirmar.addEventListener('click', async function() {
    const token   = localStorage.getItem('token');
    const carrito = leerCarrito();
    const mensaje = document.getElementById('checkout-mensaje');

    if (!token) {
      mensaje.innerHTML = '<div style="background:#fef9c3;border:1px solid #fde047;border-radius:10px;padding:16px"></div>'
      + '<p style="color:#854d0e;font-weight:600;">⚠️ Debes iniciar sesión para confirmar tu pedido.</p>'
      + '<a href="login.html" style="color:#92400e">Ir al login →</a>';
      mensaje.style.display = 'block';
      return; 
    }

    if (carrito.length === 0) {
      mensaje.innerHTML = '<div style="background:#fef9c3;border:1px solid #fde047;border-radius:10px;padding:16px;">'
      + '<p style="color:#854d0e;font-weight:600;">⚠️ El carrito está vacío.</p></div>';
      mensaje.style.display = 'block';
      return;
    }

    const productosParaEnviar = carrito.map(function(item) {
      return { producto: item.id, cantidad: 1 };
    });

    const total = carrito.reduce(function(acc, item) {
      return acc + (parseFloat(item.precio.replace(/[^0-9.-]/g, '')) || 0);
    }, 0);

  try {
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Enviando...';

    const respuesta = await fetch('http://localhost:3000/api/ordenes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      },
        body: JSON.stringify({
          productos: productosParaEnviar,
          total: total
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.innerHTML = '<div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:10px;padding:16px;">'
          + '<p style="color:#991b1b;font-weight:600;">❌ ' + (datos.error || 'Error al crear la orden') + '</p></div>';
      mensaje.style.display = 'block';
      btnConfirmar.disabled = false;
      btnConfirmar.textContent = '✅ Confirmar pedido';
      return;
    }

    localStorage.removeItem('carrito');
    actualizarBadge();

    mensaje.innerHTML = '<div style="background:#dcfce7;border:1px solid #bbf7d0;border-radius:10px;padding:20px;">'
      + '<p style="color:#15803d;font-weight:700;font-size:16px;">✅ ¡Pedido confirmado!</p>'
      + '<p style="color:#166534;font-size:14px;margin-top:6px;">Tu orden fue registrada en el sistema.</p>'
      + '<a href="index.html" style="color:#15803d;font-weight:600;">Volver al inicio</a></div>';

    mensaje.style.display = 'block';
    mostrarPaginaCarrito();

  } catch (error) {
    mensaje.innerHTML = '<div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:10px;padding:16px;">'
      + '<p style="color:#991b1b;font-weight:600;">❌ No se pudo conectar. Verifica que el servidor esté corriendo.</p></div>';

    mensaje.style.display = 'block';
    btnConfirmar.disabled = false;
    btnConfirmar.textContent = '✅ Confirmar pedido';
    }
  });
}
// ================================================
// PÁGINA MIS PEDIDOS - Solo se ejecuta en mispedidos.html
// ================================================

async function cargarMisPedidos() {
  const contenedorPedidos = document.getElementById('lista-pedidos');
  if (!contenedorPedidos) return; // Si no estamos en mispedidos.html, no hace nada

  const token = localStorage.getItem('token');
  if (!token) {
    contenedorPedidos.innerHTML = '<p class="carrito-vacio">⚠️ Debes iniciar sesión para ver tus pedidos. <a href="login.html">Ir al login →</a></p>';
    return;
  }

  try {
    const respuesta = await fetch('http://localhost:3000/api/ordenes', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const ordenes = await respuesta.json();

    if (!respuesta.ok) {
      contenedorPedidos.innerHTML = `<p class="carrito-vacio">❌ Error: ${ordenes.error || 'No se pudieron cargar los pedidos'}</p>`;
      return;
    }

    if (ordenes.length === 0) {
      contenedorPedidos.innerHTML = '<p class="carrito-vacio">No tienes pedidos registrados todavía. <a href="index.html">Comprar productos →</a></p>';
      return;
    }

    contenedorPedidos.innerHTML = '';
    ordenes.forEach(function(orden) {
      const item = document.createElement('div');
      item.classList.add('carrito-item'); // Puedes reutilizar o adaptar esta clase CSS
      
      let productosHTML = orden.productos.map(p => `<li>Producto ID: ${p.producto} - Cantidad: ${p.cantidad}</li>`).join('');

      item.innerHTML = `
        <div class="carrito-item-info" style="width: 100%;">
          <div class="carrito-item-nombre">📦 Orden ID: ${orden._id}</div>
          <div class="carrito-item-precio">Total: $${orden.total}</div>
          <ul style="margin-top: 8px; padding-left: 20px; font-size: 14px;">${productosHTML}</ul>
          <div class="carrito-item-fecha">Fecha: ${new Date(orden.createdAt).toLocaleDateString('es-CO')}</div>
        </div>
      `;
      contenedorPedidos.appendChild(item);
    });

  } catch (error) {
    contenedorPedidos.innerHTML = '<p class="carrito-vacio">❌ No se pudo conectar con el servidor para traer los pedidos.</p>';
    console.error('Error al cargar pedidos:', error);
  }
}

cargarMisPedidos();