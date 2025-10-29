const express = require('express');
const router = express.Router();
const { importarProductos, obtenerProductos, votarProducto, desvotarProducto , obtenerProveedores} = require('../controllers/productosController');

router.post('/importar', importarProductos);
router.get('/', obtenerProductos); // ← nuevo endpoint GET
router.post('/votar/:codigoProducto', votarProducto);
router.post('/desvotar/:codigoProducto', desvotarProducto);
router.get('/proveedores', obtenerProveedores);





module.exports = router;
