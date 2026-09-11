// 1. Importar dependencias
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// 2. POST /api/auth/registro - crear cuenta nueva
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, departamento, municipio, rol } = req.body;                                                            

    // Verificar que el email no exista ya
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: 'El email ya está registrado' });

    // Encriptar la contraseña con 10 rondas de bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Guardar el usuario con la contraseña encriptada
    const usuario = await Usuario.create({ nombre, email, password: hash, rol });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', id: usuario._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. POST /api/auth/login - iniciar sesión y recibir token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    // Comparar la contraseña con el hash guardado en Atlas
    const valida = await bcrypt.compare(password, usuario.password);
    if (!valida) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    // Crear el token JWT - dura 24 horas con clave por defecto segura
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto_super_seguro_s17d',
      { expiresIn: '24h' }
    );

    res.json({ token, nombre: usuario.nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET /api/auth/perfil - obtener datos del usuario logueado (Protegido por token)
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    // req.usuario.id viene del JWT decodificado por verificarToken
    // .select('-password') excluye la contraseña por seguridad
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    res.json(usuario);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// 5. Exportar el router
module.exports = router;