import { useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file || !owner.trim()) {
      setError('Selecione um arquivo e informe o proprietário.');
      return;
    }

    setStatus('submitting');
    setError('');

    try {
      const document = await uploadDocument(file, owner.trim());
      setFile(null);
      setOwner('');
      event.currentTarget.reset();
      onUploaded(document);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setStatus('idle');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Proprietário
        <input
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          style={styles.input}
          placeholder="Identificador do usuário"
          required
        />
      </label>
      <label style={styles.label}>
        Documento
        <input
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          style={styles.fileInput}
          required
        />
      </label>
      {error && <p role="alert" style={styles.error}>{error}</p>}
      <button type="submit" disabled={status === 'submitting'} style={styles.button}>
        {status === 'submitting' ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}

const styles = {
  form: { display: 'grid', gap: '16px' },
  label: { display: 'grid', gap: '7px', color: '#263238', fontSize: '14px', fontWeight: 700 },
  input: { boxSizing: 'border-box', border: '1px solid #aebdc0', borderRadius: '4px', font: 'inherit', padding: '10px 12px' },
  fileInput: { border: '1px dashed #87a7a1', borderRadius: '4px', font: 'inherit', padding: '8px' },
  button: { background: '#006c5f', border: 0, borderRadius: '4px', color: '#fff', cursor: 'pointer', font: 'inherit', fontWeight: 700, justifySelf: 'start', padding: '11px 16px' },
  error: { color: '#a52020', margin: 0 },
};
