import { useState } from 'react';
import { downloadDocument } from '../services/documentsApi';

export default function DownloadButton({ document }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  async function handleDownload() {
    setIsDownloading(true);
    setError('');

    try {
      const file = await downloadDocument(document.id);
      const url = URL.createObjectURL(file);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.originalName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        style={styles.button}
      >
        {isDownloading ? 'Baixando...' : 'Baixar'}
      </button>
      {error && <p role="alert" style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  button: { background: '#fff', border: '1px solid #006c5f', borderRadius: '4px', color: '#006c5f', cursor: 'pointer', font: 'inherit', fontWeight: 700, padding: '7px 10px' },
  error: { color: '#a52020', fontSize: '12px', margin: '6px 0 0' },
};
