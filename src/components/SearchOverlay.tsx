import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { popularSearches, searchBooks, categoryMap } from '../data'
import { BookCover } from './BookCover'
import { Rating } from './Rating'

export function SearchOverlay() {
  const { searchOpen, closeSearch, t } = useApp()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      const timer = window.setTimeout(() => inputRef.current?.focus(), 40)
      return () => window.clearTimeout(timer)
    }
  }, [searchOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSearch()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeSearch])

  if (!searchOpen) return null

  const results = query.trim() ? searchBooks(query, 8) : []

  const goAll = () => {
    if (!query.trim()) return
    navigate(`/katalog?q=${encodeURIComponent(query.trim())}`)
    closeSearch()
  }

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label={t('common.search')}>
      <button type="button" className="overlay-scrim" onClick={closeSearch} aria-label={t('common.close')} />
      <div className="search-panel">
        <form
          className="search-panel-input"
          onSubmit={(e) => {
            e.preventDefault()
            goAll()
          }}
        >
          <Search size={22} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('common.search')}
          />
          {query && (
            <button type="button" className="icon-btn" onClick={() => setQuery('')} aria-label="Bersihkan">
              <X size={18} />
            </button>
          )}
          <button type="button" className="icon-btn" onClick={closeSearch} aria-label={t('common.close')}>
            <X size={22} />
          </button>
        </form>

        {!query.trim() ? (
          <div className="search-empty-state">
            <p className="search-section-label"><TrendingUp size={15} /> {t('search.popular')}</p>
            <div className="popular-chips">
              {popularSearches.map((term) => (
                <button key={term} type="button" onClick={() => setQuery(term)}>
                  {term}
                </button>
              ))}
            </div>
            <p className="search-hint">{t('search.hint')}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="search-empty-state">
            <p className="empty-title">{t('search.noResults')}</p>
            <p className="search-hint">{t('search.tryAgain')}</p>
          </div>
        ) : (
          <div className="search-results">
            <p className="search-section-label">{results.length} hasil untuk “{query.trim()}”</p>
            {results.map((book) => (
              <Link key={book.id} to={`/kitab/${book.slug}`} className="search-result-row" onClick={closeSearch}>
                <BookCover book={book} size="mini" />
                <div className="search-result-info">
                  <span className="book-cat" style={{ color: categoryMap[book.category].color }}>{categoryMap[book.category].name}</span>
                  <strong>{book.title}</strong>
                  <small>{book.author} · {book.volumes > 1 ? `${book.volumes} ${t('common.volumes')}` : 'PDF'}</small>
                </div>
                <Rating value={book.rating} />
                <ArrowRight size={17} className="row-arrow" />
              </Link>
            ))}
            <button type="button" className="btn btn-primary btn-block" onClick={goAll}>
              {t('search.all')} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
