class DocumentController {
  constructor(documentService) {
    this.documentService = documentService;
  }

  upload = (req, res, next) => {
    try {
      const owner = req.get('x-user-id') || 'anonymous';
      const document = this.documentService.createDocument(req.file, owner);
      res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  };

  list = (req, res) => {
    res.json(this.documentService.listDocuments());
  };

  download = (req, res, next) => {
    const storedDocument = this.documentService.getDocumentById(req.params.id);

    if (!storedDocument) {
      res.status(404).json({ error: 'Documento não encontrado' });
      return;
    }

    res.download(
      storedDocument.filePath,
      storedDocument.document.originalName,
      (error) => {
        if (error) {
          next(error);
        }
      }
    );
  };
}

module.exports = DocumentController;
