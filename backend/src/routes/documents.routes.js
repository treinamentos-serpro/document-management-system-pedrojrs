const path = require('path');
const { randomUUID } = require('crypto');
const express = require('express');
const multer = require('multer');
const documentsController = require('../controllers/documents.controller');

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../storage'),
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${randomUUID()}${extension}`);
  }
});

const upload = multer({ storage });
const router = express.Router();

router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: 'Falha ao processar o upload.' });
    }

    return documentsController.createDocument(req, res, next);
  });
});
router.get('/documents', documentsController.listDocuments);
router.get('/documents/:id/download', documentsController.downloadDocument);

module.exports = router;
