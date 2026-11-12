// 1. Importar Las dependencias
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const authRoutes = require('./routes/auth');
const verificarToken = require('./middleware/auth');
const productosRoutes = require('./routes/productos');
const ordenesRoutes = require('./routes/ordenes');
const pagoRoutes = require('./routes/pago');
const contactoRoutes = require('./routes/contacto');

// 2. Crear la aplicación y definir el puerto
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Activar middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar a MongoDB: local o Atlas segun DB_MODO en el .env
const modo = process.env.DB_MODO === 'local' ? 'local' : 'atlas';

// Usamos MONGODB_URI (que es la que trae tu .env de Atlas) o MONGODB_URI_ATLAS como respaldo
const uri = modo === 'local' 
    ? process.env.MONGODB_URI_LOCAL 
    : (process.env.MONGODB_URI || process.env.MONGODB_URI_ATLAS);

mongoose.connect(uri)
    .then(() => console.log(`✅ Conectado a MongoDB (${modo})`))
    .catch((err) => console.error('❌ Error de conexión: ', err));
// 5. Ruta de prueba 
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor TechStore Pro✅', baseDeDatos: modo });
});

// 6. Rutas de autenticación
app.use('/api/auth', authRoutes);

// 7. Rutas de productos
app.use('/api/productos', productosRoutes);

// 8. Rutas de órdenes
app.use('/api/ordenes', ordenesRoutes);

// 9. Rutas de pagos
app.use('/api/pagos', pagoRoutes);

// 10. Rutas de contacto
app.use('/api/contacto', contactoRoutes);

// 11. Arrancar Servidor
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});