const db = require('../db');

exports.importarProductos = (req, res) => {
  const productos = req.body;

  productos.forEach(producto => {
    const { proveedor, nombreProducto, codigoProducto, precioLPS } = producto;
    db.query(
      'INSERT INTO productos (proveedor, nombreProducto, codigoProducto, precioLPS) VALUES (?, ?, ?, ?)',
      [proveedor, nombreProducto, codigoProducto, precioLPS],
      (err) => {
        if (err) console.error(`Error al insertar ${codigoProducto}:`, err.message);
      }
    );
  });

  res.json({ mensaje: 'Productos importados correctamente' });
};

exports.obtenerProductos = (req, res) => {
  const proveedor = req.query.proveedor;

  let query = 'SELECT * FROM productos';
  let params = [];

  if (proveedor) {
    query += ' WHERE proveedor = ?';
    params.push(proveedor);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err.message);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }

    res.json(results);
  });
};

exports.votarProducto = (req, res) => {
  const { codigoProducto } = req.params;

  db.query(
    'UPDATE productos SET votos = votos + 1 WHERE codigoProducto = ?',
    [codigoProducto],
    (err) => {
      if (err) {
        console.error('Error al votar:', err.message);
        return res.status(500).json({ error: 'Error al votar' });
      }

      res.json({ mensaje: 'Voto registrado correctamente' });
    }
  );
};

exports.desvotarProducto = (req, res) => {
  const { codigoProducto } = req.params;

  db.query(
    'UPDATE productos SET votos = GREATEST(votos - 1, 0) WHERE codigoProducto = ?',
    [codigoProducto],
    (err) => {
      if (err) {
        console.error('Error al quitar voto:', err.message);
        return res.status(500).json({ error: 'Error al quitar voto' });
      }

      res.json({ mensaje: 'Voto eliminado correctamente' });
    }
  );
};

exports.obtenerProveedores = (req, res) => {
  db.query('SELECT DISTINCT proveedor FROM productos', (err, results) => {
    if (err) {
      console.error('Error al obtener proveedores:', err.message);
      return res.status(500).json({ error: 'Error al obtener proveedores' });
    }

    res.json(results.map(r => r.proveedor));
  });
};

