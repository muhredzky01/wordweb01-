import { Link } from 'react-router-dom'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand" aria-label="Maktabah Kitab — beranda">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M7.5 6.5A2.5 2.5 0 0 1 10 4h15v21H10a2.5 2.5 0 0 0-2.5 2.5V6.5Z" fill="currentColor" opacity="0.35" />
          <path d="M7.5 6.5A2.5 2.5 0 0 1 10 4h15v18.5H10a2.5 2.5 0 0 0-2.5 2.5V6.5Z" stroke="currentColor" strokeWidth="2" />
          <path d="M7.5 25.5A2.5 2.5 0 0 1 10 23h15v5H10a2.5 2.5 0 0 1-2.5-2.5Z" stroke="currentColor" strokeWidth="2" />
          <path d="M13 10h8M13 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="brand-text">
          <strong>Maktabah</strong>
          <small>Kitab · perpustakaan digital</small>
        </span>
      )}
    </Link>
  )
}
