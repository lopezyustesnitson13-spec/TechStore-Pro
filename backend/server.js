// 1. Importar las dependencias 
const express = require('express');
const cors    = require('cors');

// 2. Crear la aplicacion y definir el puerto
const app = express();
const PORT = 3000;

// 3. ACTIVAR MIDDLEWARES
app.use(cors());
app.use(express.json());

// 4. Ruta get /api/productos
app.get('/api/productos', (req, res) => {
    const productos = require('../fronted/data/productos.json');
    res.json(productos);
});

//5. Ruta de prueba 
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor techStore Pro' });
});

// 6. Arrancar el servidor 
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});