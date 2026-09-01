const { Router } = require('express');
const multer = require('multer');
const { rateLimit } = require('express-rate-limit');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const DocumentController = require('../controllers/documentController');
const DocumentRepository = require('../repositories/documentRepository');
const DocumentService = require('../services/documentService');

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../storage'),
  filename: (req, file, callback) => {
    callback(null, `${randomUUID()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
const repository = new DocumentRepository();
const service = new DocumentService(repository);
const controller = new DocumentController(service);
const router = Router();
const parsePositiveInteger = (value, fallback) => {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};
const uploadRateLimitWindow = parsePositiveInteger(
  process.env.UPLOAD_RATE_LIMIT_WINDOW_MS,
  15 * 60 * 1000
);
const uploadRateLimitMax = parsePositiveInteger(process.env.UPLOAD_RATE_LIMIT_MAX, 100);
const uploadRateLimit = rateLimit({
  windowMs: uploadRateLimitWindow,
  limit: uploadRateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Muitas tentativas de upload. Tente novamente mais tarde.' }
});

router.post('/upload', uploadRateLimit, upload.single('file'), controller.upload);
router.get('/documents', controller.list);
router.get('/documents/:id/download', controller.download);

module.exports = router;
