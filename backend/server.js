// 1. Importar las dependencias
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/producto');

// 2. Crear la aplicación y definir el puerto
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Activar middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error de conexión:', err));

// 5. Ruta GET /api/productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({
      error: 'Error al obtener los productos'
    });
  }
});

// 6. Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});