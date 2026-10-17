// 1. Importar las dependencias cargando explícitamente el .env de la carpeta backend
require('dotenv').config({ path: __dirname + '/.env' });

const express         = require('express');
const cors            = require('cors');
const mongoose        = require('mongoose');
const Producto        = require('./models/Producto');
const authRoutes      = require('./routes/auth');           
const verificarToken  = require('./middleware/auth');   
const productosRoutes = require('./routes/productos'); 
const ordenesRouter   = require('./routes/ordenes');
const pagoRoutes      = require('./routes/pago');

// 2. Crear la aplicación y definir el puerto
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Activar middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión:', err));

// 5. Declaración de Rutas (Deben ir ANTES de app.listen)
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ordenes', ordenesRouter);
app.use('/api/pagos', pagoRoutes);

// 6. Ruta de prueba 
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor TechStore Pro ✅' });
});

// 7. Arrancar Servidor (Al final de todo)
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});