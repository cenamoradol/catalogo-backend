const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const db = require('../db');

exports.subirZipImagenes = (req, res) => {
  const zip = new AdmZip(req.file.buffer);
  const zipEntries = zip.getEntries();

  zipEntries.forEach(entry => {
    if (!entry.isDirectory) {
      const codigo = path.parse(entry.entryName).name;
      const filePath = path.join(__dirname, '../uploads', entry.entryName);
      fs.writeFileSync(filePath, entry.getData());

      db.query(
        'UPDATE productos SET imagenUrl = ? WHERE codigoProducto = ?',
        [`/uploads/${entry.entryName}`, codigo],
        (err) => {
          if (err) console.error(`Error al actualizar imagen de ${codigo}:`, err.message);
        }
      );
    }
  });

  res.json({ mensaje: 'Imágenes subidas y asociadas correctamente' });
};
