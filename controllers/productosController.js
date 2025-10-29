const db = require('../db');

exports.importarProductos = async (req, res) => {
  const productos = req.body;

  try {
    for (const producto of productos) {
      const { proveedor, nombreProducto, codigoProducto, precioLPS } = producto;
      await db.query(
        'INSERT INTO productos (proveedor, nombreProducto, codigoProducto, precioLPS) VALUES ($1, $2, $3, $4)',
        [proveedor, nombreProducto, codigoProducto, precioLPS]
      );
    }

    res.json({ mensaje: 'Productos importados correctamente' });
  } catch (err) {
    console.error('Error al importar productos:', err.message);
    res.status(500).json({ error: 'Error al importar productos' });
  }
};

exports.obtenerProductos = async (req, res) => {
  const proveedor = req.query.proveedor;

  let query = 'SELECT * FROM productos';
  let params = [];

  if (proveedor) {
    query += ' WHERE proveedor = $1';
    params.push(proveedor);
  }

  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.votarProducto = async (req, res) => {
  const { codigoProducto } = req.params;

  try {
    await db.query(
      'UPDATE productos SET votos = votos + 1 WHERE codigoProducto = $1',
      [codigoProducto]
    );
    res.json({ mensaje: 'Voto registrado correctamente' });
  } catch (err) {
    console.error('Error al votar:', err.message);
    res.status(500).json({ error: 'Error al votar' });
  }
};

exports.desvotarProducto = async (req, res) => {
  const { codigoProducto } = req.params;

  try {
    await db.query(
      'UPDATE productos SET votos = GREATEST(votos - 1, 0) WHERE codigoProducto = $1',
      [codigoProducto]
    );
    res.json({ mensaje: 'Voto eliminado correctamente' });
  } catch (err) {
    console.error('Error al quitar voto:', err.message);
    res.status(500).json({ error: 'Error al quitar voto' });
  }
};

exports.obtenerProveedores = async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT proveedor FROM productos');
    res.json(result.rows.map(r => r.proveedor));
  } catch (err) {
    console.error('Error al obtener proveedores:', err.message);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
};