import DownloadButton from './DownloadButton';

function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
}

export default function DocumentList({ documents, isLoading, error }) {
  if (isLoading) {
    return <p style={styles.message}>Carregando documentos...</p>;
  }

  if (error) {
    return <p role="alert" style={styles.error}>{error}</p>;
  }

  if (documents.length === 0) {
    return <p style={styles.message}>Nenhum documento enviado.</p>;
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Nome</th>
            <th style={styles.header}>Proprietário</th>
            <th style={styles.header}>Tamanho</th>
            <th style={styles.header}>Enviado em</th>
            <th style={styles.header}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td style={styles.cell}>{document.originalName}</td>
              <td style={styles.cell}>{document.owner}</td>
              <td style={styles.cell}>{formatSize(document.size)}</td>
              <td style={styles.cell}>{formatDate(document.uploadedAt)}</td>
              <td style={styles.cell}><DownloadButton document={document} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrapper: { overflowX: 'auto' },
  table: { borderCollapse: 'collapse', minWidth: '700px', width: '100%' },
  header: { background: '#e3f1ed', color: '#173b35', fontSize: '13px', padding: '11px 12px', textAlign: 'left' },
  cell: { borderBottom: '1px solid #dce5e3', color: '#263238', padding: '12px', verticalAlign: 'top' },
  message: { color: '#52615e' },
  error: { color: '#a52020' },
};
