import { Link } from 'react-router-dom'
import { BookHeart, Heart, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { bookById } from '../data'
import { BookCard } from '../components/BookCard'

export function Favorites() {
  const { t, favorites, clearFavorites } = useApp()
  const items = favorites.map(bookById).filter(Boolean)

  return (
    <div className="page">
      <div className="page-head page-head-small">
        <div className="container">
          <nav className="breadcrumb"><Link to="/">Beranda</Link><span>/</span><span>Favorit</span></nav>
          <div className="page-head-row">
            <div>
              <p className="eyebrow"><Heart size={15} /> Koleksi pribadi</p>
              <h1>{t('favorites.title')}</h1>
              <p>{t('favorites.subtitle')}</p>
            </div>
            {items.length > 0 && (
              <button type="button" className="btn btn-outline" onClick={clearFavorites}>
                <Trash2 size={15} /> {t('favorites.clear')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container section">
        {items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><BookHeart size={28} /></span>
            <h2>{t('favorites.empty')}</h2>
            <p>{t('favorites.emptyHint')}</p>
            <Link to="/katalog" className="btn btn-primary">Jelajahi katalog</Link>
          </div>
        ) : (
          <>
            <p className="result-count"><strong>{items.length}</strong> kitab dalam favorit Anda</p>
            <div className="book-grid">
              {items.map((book) => book && <BookCard key={book.id} book={book} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
