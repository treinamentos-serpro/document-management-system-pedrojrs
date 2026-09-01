const { randomUUID } = require('node:crypto');

class DocumentService {
  constructor(documentRepository) {
    this.documentRepository = documentRepository;
  }

  createDocument(file, owner) {
    if (!file) {
      const error = new Error('Um arquivo é obrigatório');
      error.statusCode = 400;
      throw error;
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

  getDocumentById(id) {
    return this.documentRepository.findById(id);
  }
}

module.exports = DocumentService;
