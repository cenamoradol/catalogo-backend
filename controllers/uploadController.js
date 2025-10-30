const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const db = require('../db');

exports.subirZipImagenes = (req, res) => {
  try {
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();

    zipEntries.forEach(entry => {
      if (!entry.isDirectory) {
        const codigo = path.parse(entry.entryName).name.trim();
        const filePath = path.join(__dirname, '../uploads', entry.entryName);

        // Crear carpeta si no existe
        if (!fs.existsSync(path.dirname(filePath))) {
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        fs.writeFileSync(filePath, entry.getData());

        // 👉 Postgres usa placeholders $1, $2
        db.query(
          'UPDATE productos SET imagenurl = $1 WHERE codigoproducto = $2',
          [`/uploads/${entry.entryName}`, codigo],
          (err) => {
            if (err) console.error(`Error al actualizar imagen de ${codigo}:`, err.message);
          }
        );
      }
    });

    res.json({ mensaje: 'Imágenes subidas y asociadas correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar el archivo ZIP', error: error.message });
  }
};
