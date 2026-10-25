import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookMarked, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { bookById } from '../data'
import { BookCover } from './BookCover'
import { numberID } from '../lib/utils'

export function ShelfDrawer() {
  const { shelfOpen, closeShelf, shelf, toggleShelf, progress, t } = useApp()
  const items = shelf.map(bookById).filter(Boolean)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeShelf() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeShelf])

  if (!shelfOpen) return null

  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true" aria-label={t('shelf.drawerTitle')}>
      <button type="button" className="overlay-scrim" onClick={closeShelf} aria-label={t('common.close')} />
      <aside className="shelf-drawer">
        <header className="shelf-drawer-head">
          <div>
            <p className="eyebrow"><BookMarked size={14} /> Maktabah</p>
            <h2>{t('shelf.drawerTitle')}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={closeShelf} aria-label={t('common.close')}>
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <span className="empty-icon"><BookMarked size={26} /></span>
            <p>{t('shelf.drawerEmpty')}</p>
            <Link to="/katalog" className="btn btn-primary" onClick={closeShelf}>{t('nav.catalog')}</Link>
          </div>
        ) : (
          <>
            <div className="shelf-drawer-list">
              {items.map((book) => book && (
                <div className="shelf-row" key={book.id}>
                  <Link to={`/kitab/${book.slug}`} onClick={closeShelf}>
                    <BookCover book={book} size="mini" />
                  </Link>
                  <div className="shelf-row-info">
                    <Link to={`/kitab/${book.slug}`} onClick={closeShelf} className="shelf-row-title">{book.title}</Link>
                    <small>{book.author} · {numberID(book.readers)} {t('detail.readers')}</small>
                    <span className="progress-track"><i style={{ width: `${progress[book.id] ?? 0}%` }} /></span>
                  </div>
                  <button type="button" className="icon-btn danger" onClick={() => toggleShelf(book.id)} aria-label={`${t('common.remove')} ${book.title}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <footer className="shelf-drawer-foot">
              <Link to="/rak" className="btn btn-primary btn-block" onClick={closeShelf}>
                {t('shelf.open')} <ArrowRight size={16} />
              </Link>
              <p>{items.length} kitab · PDF</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
