export function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" aria-label="Loading..." />
    </div>
  )
}

export function ErrorMsg({ message }) {
  if (!message) return null
  return <p className="error">⚠ {message}</p>
}

export function Badge({ value, type }) {
  return <span className={`badge ${type || value?.toLowerCase()}`}>{value}</span>
}

export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(2px)' }}>
      <div className="card" style={{ maxWidth: 400, width: '90%', padding: 28 }}>
        <p style={{ marginBottom: 20, fontSize: '0.95rem', lineHeight: 1.6 }}>{message}</p>
        <div className="row">
          <button className="danger-btn" onClick={onConfirm}>Delete</button>
          <button className="ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="pagination">
      <button className="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Prev</button>
      <span className="pagination-info">Page {page} of {totalPages}</span>
      <button className="ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next →</button>
    </div>
  )
}
