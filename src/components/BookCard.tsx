import { ArrowUpRight, BookMarked, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Book } from '../types'
import { useApp } from '../context/AppContext'
import { categoryMap } from '../data'
import { BookCover } from './BookCover'
import { Rating } from './Rating'
import { cx, numberID } from '../lib/utils'

interface Props {
  book: Book
  layout?: 'grid' | 'list'
}

export function BookCard({ book, layout = 'grid' }: Props) {
  const { favorites, toggleFavorite, shelf, toggleShelf, progress, t } = useApp()
  const fav = favorites.includes(book.id)
  const saved = shelf.includes(book.id)
  const category = categoryMap[book.category]

  return (
    <article className={cx('book-card', layout === 'list' && 'book-card-list')}>
      <div className="book-card-media">
        <Link to={`/kitab/${book.slug}`} state={{ from: 'card' }} aria-label={`Lihat ${book.title}`}>
          <BookCover book={book} />
        </Link>
        <span className={cx('cover-badge', book.featured ? 'badge-featured' : book.volumes > 1 ? 'badge-volumes' : 'badge-pdf')}>
          {book.featured ? t('catalog.featured') : book.volumes > 1 ? `${book.volumes} ${t('common.volumes')}` : 'PDF'}
        </span>
        <button
          type="button"
          className={cx('icon-btn heart-btn', fav && 'is-active')}
          onClick={() => toggleFavorite(book.id)}
          aria-label={fav ? `Hapus ${book.title} dari favorit` : `Simpan ${book.title} ke favorit`}
          aria-pressed={fav}
        >
          <Heart size={17} fill={fav ? 'currentColor' : 'none'} />
        </button>
        <div className="cover-actions">
          <Link to={`/baca/${book.slug}`} className="btn btn-light btn-sm">
            {t('common.read')} <ArrowUpRight size={14} />
          </Link>
          <button type="button" className={cx('icon-btn shelf-mini', saved && 'is-active')} onClick={() => toggleShelf(book.id)} aria-label={t('common.addShelf')} aria-pressed={saved}>
            <BookMarked size={16} />
          </button>
        </div>
        {saved && typeof progress[book.id] === 'number' && (
          <span className="card-progress" title={`${progress[book.id]}%`}>
            <i style={{ width: `${progress[book.id]}%` }} />
          </span>
        )}
      </div>

      <div className="book-card-body">
        <span className="book-cat" style={{ color: category.color }}>{category.name}</span>
        <h3 className="book-title">
          <Link to={`/kitab/${book.slug}`}>{book.title}</Link>
        </h3>
        {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
        <p className="book-author">{book.author}</p>
        <div className="book-meta-row">
          <span className="free-tag">{t('common.free')}</span>
          <Rating value={book.rating} />
        </div>
        <div className="book-meta-sub">
          <span>{book.volumes > 1 ? `${book.volumes} ${t('common.volumes')}` : '1 PDF'}</span>
          <span aria-hidden="true">·</span>
          <span>{numberID(book.readers)} {t('detail.readers')}</span>
        </div>
      </div>
    </article>
  )
}
