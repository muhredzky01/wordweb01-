import { Link } from 'react-router-dom'
import { ArrowRight, BookMarked, BookOpen, CheckCircle2, NotebookPen, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { bookById } from '../data'
import { BookCover } from '../components/BookCover'
import { Rating } from '../components/Rating'
import { numberID } from '../lib/utils'

export function Shelf() {
  const { t, shelf, toggleShelf, progress, notes } = useApp()
  const items = shelf.map(bookById).filter(Boolean)
  const finished = items.filter((b) => b && (progress[b.id] ?? 0) >= 100).length
  const reading = items.filter((b) => b && (progress[b.id] ?? 0) > 0 && (progress[b.id] ?? 0) < 100).length

  return (
    <div className="page">
      <div className="page-head page-head-small">
        <div className="container">
          <nav className="breadcrumb"><Link to="/">Beranda</Link><span>/</span><span>Rak baca</span></nav>
          <div className="page-head-row">
            <div>
              <p className="eyebrow"><BookMarked size={15} /> Ruang belajar</p>
              <h1>{t('shelf.title')}</h1>
              <p>{t('shelf.subtitle')}</p>
            </div>
            {items.length > 0 && (
              <div className="shelf-summary">
                <div><strong>{items.length}</strong><span>disimpan</span></div>
                <div><strong>{reading}</strong><span>dibaca</span></div>
                <div><strong>{finished}</strong><span>selesai</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container section">
        {items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><BookMarked size={28} /></span>
            <h2>{t('shelf.empty')}</h2>
            <p>{t('shelf.emptyHint')}</p>
            <Link to="/katalog" className="btn btn-primary">Mulai jelajahi</Link>
          </div>
        ) : (
          <div className="shelf-page-list">
            {items.map((book) => book && (
              <article className="shelf-page-row" key={book.id}>
                <Link to={`/kitab/${book.slug}`}><BookCover book={book} size="shelf" /></Link>
                <div className="shelf-page-info">
                  <span className="book-cat">Rak baca</span>
                  <h3><Link to={`/kitab/${book.slug}`}>{book.title}</Link></h3>
                  <p>{book.author} · {book.volumes > 1 ? `${book.volumes} ${t('common.volumes')}` : '1 PDF'} · {numberID(book.readers)} pembaca</p>
                  <Rating value={book.rating} />
                  <div className="shelf-progress-row">
                    <span className="progress-track large"><i style={{ width: `${progress[book.id] ?? 0}%` }} /></span>
                    <strong>{progress[book.id] ?? 0}%</strong>
                  </div>
                  {notes[book.id] && <p className="shelf-note"><NotebookPen size={13} /> {notes[book.id].slice(0, 110)}{notes[book.id].length > 110 ? '…' : ''}</p>}
                </div>
                <div className="shelf-page-actions">
                  <Link to={`/baca/${book.slug}`} className="btn btn-primary btn-sm">
                    {(progress[book.id] ?? 0) > 0 ? t('shelf.continue') : t('common.readNow')} <ArrowRight size={14} />
                  </Link>
                  <Link to={`/kitab/${book.slug}`} className="btn btn-ghost btn-sm"><BookOpen size={14} /> Detail</Link>
                  <button type="button" className="btn btn-ghost btn-sm danger-text" onClick={() => toggleShelf(book.id)}><Trash2 size={14} /> {t('common.remove')}</button>
                </div>
                {(progress[book.id] ?? 0) >= 100 && <span className="finished-badge"><CheckCircle2 size={13} /> Selesai</span>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
