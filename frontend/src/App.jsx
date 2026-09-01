import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { listDocuments } from './services/documentsApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDocuments() {
    setIsLoading(true);
    setError('');

    try {
      setDocuments(await listDocuments());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  function handleUploaded(document) {
    setDocuments((currentDocuments) => [document, ...currentDocuments]);
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>Gestão local</p>
        <h1 style={styles.title}>Document Management System</h1>
      </header>

      <section aria-labelledby="upload-title" style={styles.section}>
        <h2 id="upload-title" style={styles.heading}>Enviar documento</h2>
        <UploadComponent onUploaded={handleUploaded} />
      </section>

      <section aria-labelledby="documents-title" style={styles.section}>
        <div style={styles.listHeading}>
          <h2 id="documents-title" style={styles.heading}>Documentos</h2>
          <button type="button" onClick={loadDocuments} style={styles.refreshButton}>
            Atualizar
          </button>
        </div>
        <DocumentList documents={documents} isLoading={isLoading} error={error} />
      </section>
    </main>
  );
}

const styles = {
  page: { background: '#f4f7f5', boxSizing: 'border-box', color: '#17211f', fontFamily: 'Georgia, serif', margin: '0 auto', maxWidth: '1050px', minHeight: '100vh', padding: '48px 24px' },
  header: { borderBottom: '3px solid #006c5f', marginBottom: '32px', paddingBottom: '24px' },
  eyebrow: { color: '#006c5f', fontFamily: 'Verdana, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 8px', textTransform: 'uppercase' },
  title: { fontSize: '32px', margin: 0 },
  section: { background: '#fff', border: '1px solid #d3dfdc', borderRadius: '6px', boxShadow: '0 2px 8px rgba(30, 56, 50, 0.08)', marginBottom: '24px', padding: '24px' },
  heading: { fontSize: '21px', margin: 0 },
  listHeading: { alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
  refreshButton: { background: '#e3f1ed', border: 0, borderRadius: '4px', color: '#006c5f', cursor: 'pointer', font: '700 14px Verdana, sans-serif', padding: '9px 12px' },
};
