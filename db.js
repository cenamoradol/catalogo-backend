const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// Crear tabla si no existe
const crearTablaProductos = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      proveedor VARCHAR(255),
      nombreProducto VARCHAR(255),
      codigoProducto VARCHAR(100) UNIQUE,
      precioLPS NUMERIC(10,2),
      imagenUrl VARCHAR(255),
      votos INTEGER DEFAULT 0
    );
  `;

  try {
    await pool.query(query);
    console.log('Tabla productos verificada/creada');
  } catch (err) {
    console.error('Error al crear tabla productos:', err.message);
  }
};

crearTablaProductos();

module.exports = pool;

