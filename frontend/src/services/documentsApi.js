const API_PREFIX = '/api';

async function parseError(response) {
  const payload = await response.json().catch(() => null);
  return payload?.error || 'Não foi possível concluir a solicitação.';
}

async function ensureSuccess(response) {
  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response;
}

export async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner', owner);

  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: formData,
  });

  await ensureSuccess(response);
  return response.json();
}

export async function listDocuments() {
  const response = await fetch(`${API_PREFIX}/documents`);

  await ensureSuccess(response);
  return response.json();
}

export async function downloadDocument(id) {
  const response = await fetch(`${API_PREFIX}/documents/${id}/download`);

  await ensureSuccess(response);
  return response.blob();
}
