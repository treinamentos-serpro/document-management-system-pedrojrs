const documentsRepository = require('../repositories/documents.repository');

function toMetadata(document) {
  const { storedPath, ...metadata } = document;
  return metadata;
}

function createDocument(file, owner) {
  const document = documentsRepository.createDocument(file, owner);
  return toMetadata(document);
}

function listDocuments() {
  return documentsRepository.listDocuments().map(toMetadata);
}

function getDocumentForDownload(id) {
  return documentsRepository.findDocumentById(id);
}

module.exports = {
  createDocument,
  listDocuments,
  getDocumentForDownload
};
