const { randomUUID } = require('node:crypto');

class DocumentService {
  constructor(documentRepository) {
    this.documentRepository = documentRepository;
  }

  createDocument(file, owner) {
    if (!file) {
      throw new Error('Um arquivo é obrigatório');
    }

    const document = {
      id: randomUUID(),
      originalName: file.originalname,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      owner
    };

    return this.documentRepository.save(document, file.path);
  }

  listDocuments() {
    return this.documentRepository.findAll();
  }

  getDocumentDownload(id) {
    const storedDocument = this.documentRepository.findById(id);

    if (!storedDocument) {
      return null;
    }

    return storedDocument;
  }
}

module.exports = DocumentService;
