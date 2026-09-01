const { randomUUID } = require('crypto');

const documents = [];

function createDocument(file, owner) {
  const document = {
    id: randomUUID(),
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
    storedPath: file.path
  };

  documents.push(document);
  return document;
}

function listDocuments() {
  return documents;
}

function findDocumentById(id) {
  return documents.find((document) => document.id === id);
}

module.exports = {
  createDocument,
  listDocuments,
  findDocumentById
};
