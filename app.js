const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const productosRoutes = require('./routes/productos');
const uploadRoutes = require('./routes/upload');

app.use('/productos', productosRoutes);
app.use('/productos', uploadRoutes);

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
