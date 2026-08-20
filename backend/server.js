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

// 6. Ruta POSt /api/productos - crear producto nuevo < AGREGAR aqui

app.post('/api/productos', async (req, res) => {
  
  try {
  
    const nuevoProducto = await Producto.create(req.body);  // Toma el Json del body 

    res.status(201).json(nuevoProducto);                    // 201 = created

  } catch (err) {
  
    res.status(400).json({ error: err.message });        // 400= datos invalidos
  
  }
});

// BACKEND/SERVER.JS - BLOQUE 7 (NUEVO): PUT /API/PRODUCTOS/:ID

// 7. Ruta PUT /api/productos/:id - actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,  // _id de MongoDB que viene en la URL
      req.body,       // campos nuevos que vienen en el body
      { new: true }   // retorna el documento YA actualizado
    );
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// BACKEND/SERVER.JS - BLOQUE 8 (NUEVO): DELETE /API/PRODUCTOS/:ID

// 8. Ruta DELETE /api/productos/:id - eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente', eliminado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});