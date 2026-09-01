class DocumentRepository {
  constructor() {
    this.documents = new Map();
  }

  save(document, filePath) {
    this.documents.set(document.id, { document, filePath });
    return document;
  }

  findAll() {
    return Array.from(this.documents.values(), ({ document }) => document);
  }

  findById(id) {
    return this.documents.get(id);
  }
}

module.exports = DocumentRepository;
