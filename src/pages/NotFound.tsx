import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { SearchGlyph } from '../components/Icons'

export function NotFound() {
  return (
    <div className="page notfound-page">
      <div className="notfound-inner">
        <span className="notfound-num">404</span>
        <span className="notfound-icon"><Compass size={30} /></span>
        <h1>Halaman ini tidak ada di rak kami</h1>
        <p>Mungkin tautannya berubah, atau kitab yang Anda cari sudah dipindahkan. Mari kembali ke perpustakaan.</p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary"><ArrowLeft size={16} /> Kembali ke beranda</Link>
          <Link to="/katalog" className="btn btn-outline"><SearchGlyph /> Jelajahi katalog</Link>
        </div>
      </div>
    </div>
  )
}
