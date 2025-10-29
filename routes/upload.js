const express = require('express');
const router = express.Router();
const multer = require('multer');
const { subirZipImagenes } = require('../controllers/uploadController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload-images', upload.single('zipfile'), subirZipImagenes);

module.exports = router;
