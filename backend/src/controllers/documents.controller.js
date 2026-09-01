const documentsService = require('../services/documents.service');

function createDocument(req, res, next) {
  const owner = req.body?.owner?.trim();

  if (!req.file || !owner) {
    return res.status(400).json({ error: 'Os campos file e owner são obrigatórios.' });
  }

  try {
    const document = documentsService.createDocument(req.file, owner);
    return res.status(201).json(document);
  } catch (error) {
    return next(error);
  }
}

function listDocuments(req, res, next) {
  try {
    return res.status(200).json(documentsService.listDocuments());
  } catch (error) {
    return next(error);
  }
}

function downloadDocument(req, res, next) {
  const document = documentsService.getDocumentForDownload(req.params.id);

  if (!document) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  return res.download(document.storedPath, document.originalName, (error) => {
    if (!error) {
      return;
    }

    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Arquivo não encontrado no armazenamento local.' });
    }

    return next(error);
  });
}

module.exports = {
  createDocument,
  listDocuments,
  downloadDocument
};
