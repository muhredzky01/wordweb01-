import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight, Grid2X2, List, Search, SlidersHorizontal, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { books, categoryMap, searchBooks } from '../data'
import { BookCard } from '../components/BookCard'
import { FilterPanel, type Filters } from '../components/FilterPanel'
import { cx } from '../lib/utils'

type Sort = 'popular' | 'newest' | 'title' | 'rating'
type Tab = 'all' | 'featured' | 'popular'

const PAGE_SIZE = 12

const emptyFilters: Filters = { categories: [], languages: [], era: 'all', featured: false, collection: '', author: '' }

function readFilters(params: URLSearchParams): Filters {
  return {
    categories: params.getAll('category'),
    languages: params.getAll('language'),
    era: params.get('era') ?? 'all',
    featured: params.get('tab') === 'featured',
    collection: params.get('collection') ?? '',
    author: params.get('author') ?? '',
  }
}

export function Catalog() {
  const { t } = useApp()
  const [params, setParams] = useSearchParams()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [quickSearch, setQuickSearch] = useState('')

  const q = params.get('q') ?? ''
  const sort = (params.get('sort') as Sort) ?? 'popular'
  const tab = (params.get('tab') as Tab) ?? (params.get('tab') === 'featured' ? 'featured' : 'all')
  const page = Math.max(1, Number(params.get('page') ?? 1))
  const filters = readFilters(params)

  useEffect(() => { document.title = q ? `Cari “${q}” — Maktabah Kitab` : 'Katalog kitab — Maktabah Kitab' }, [q])
  useEffect(() => { setFilterOpen(false) }, [params])

  const update = (patch: Partial<Filters>) => {
    const next = new URLSearchParams(params)
    next.delete('page')
    if (patch.categories) {
      next.delete('category')
      patch.categories.forEach((c) => next.append('category', c))
    }
    if (patch.languages) {
      next.delete('language')
      patch.languages.forEach((l) => next.append('language', l))
    }
    if (patch.era !== undefined) {
      if (patch.era === 'all') next.delete('era')
      else next.set('era', patch.era)
    }
    if (patch.featured !== undefined) {
      if (patch.featured) next.set('tab', 'featured')
      else if (next.get('tab') === 'featured') next.delete('tab')
    }
    if (patch.author !== undefined) {
      if (!patch.author) next.delete('author')
      else next.set('author', patch.author)
    }
    if (patch.collection !== undefined) {
      if (!patch.collection) next.delete('collection')
      else next.set('collection', patch.collection)
    }
    setParams(next)
  }

  const reset = () => {
    const next = new URLSearchParams()
    if (q) next.set('q', q)
    setParams(next)
  }

  const setSort = (value: Sort) => {
    const next = new URLSearchParams(params)
    next.set('sort', value)
    next.delete('page')
    setParams(next)
  }

  const setTab = (value: Tab) => {
    const next = new URLSearchParams(params)
    next.delete('page')
    if (value === 'all') next.delete('tab')
    else next.set('tab', value)
    setParams(next)
  }

  const setPage = (value: number) => {
    const next = new URLSearchParams(params)
    next.set('page', String(value))
    setParams(next)
    window.scrollTo({ top: 240, behavior: 'smooth' })
  }

  const filtered = useMemo(() => {
    let list = q ? searchBooks(q) : [...books]
    if (filters.categories.length) list = list.filter((b) => filters.categories.includes(b.category))
    if (filters.languages.length) list = list.filter((b) => filters.languages.includes(b.language))
    if (filters.era !== 'all') list = list.filter((b) => b.era === filters.era)
    if (filters.featured) list = list.filter((b) => b.featured)
    if (filters.author) list = list.filter((b) => b.author === filters.author)
    if (filters.collection) list = list.filter((b) => b.collection === filters.collection)
    if (tab === 'popular') list = list.filter((b) => b.readers > 1500)
    if (quickSearch.trim()) {
      const needle = quickSearch.toLowerCase()
      list = list.filter((b) => `${b.title} ${b.author} ${b.tags.join(' ')}`.toLowerCase().includes(needle))
    }
    const sorted = [...list]
    if (sort === 'popular') sorted.sort((a, b) => b.readers - a.readers)
    else if (sort === 'newest') sorted.sort((a, b) => b.id.localeCompare(a.id))
    else if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title))
    else sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [q, filters, tab, sort, quickSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const activeChips: Array<{ label: string; onRemove: () => void }> = [
    ...filters.categories.map((id) => ({ label: categoryMap[id as keyof typeof categoryMap]?.name ?? id, onRemove: () => update({ categories: filters.categories.filter((c) => c !== id) }) })),
    ...filters.languages.map((lang) => ({ label: lang, onRemove: () => update({ languages: filters.languages.filter((l) => l !== lang) }) })),
    ...(filters.era !== 'all' ? [{ label: filters.era === 'klasik' ? t('common.classic') : t('common.modern'), onRemove: () => update({ era: 'all' }) }] : []),
    ...(filters.author ? [{ label: filters.author, onRemove: () => update({ author: '' }) }] : []),
    ...(filters.featured ? [{ label: t('catalog.featured'), onRemove: () => update({ featured: false }) }] : []),
    ...(filters.collection ? [{ label: t('catalog.chipShelf').replace('{name}', filters.collection), onRemove: () => update({ collection: '' }) }] : []),
  ]

  return (
    <div className="page catalog-page">
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{t('nav.home')}</Link><span>/</span><span>{t('nav.catalog')}</span>
            {q && <><span>/</span><span className="crumb-current">“{q}”</span></>}
          </nav>
          <div className="page-head-row">
            <div>
              <h1>{q ? t('catalog.searchTitle').replace('{q}', q) : t('catalog.title')}</h1>
              <p>{t('catalog.subtitle')}</p>
            </div>
            <div className="page-head-badge">
              <span className="big-number">{filtered.length}</span>
              <span>{t('catalog.results')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container catalog-layout">
        <aside className="catalog-sidebar">
          <div className="catalog-quick-search">
            <Search size={15} />
            <input value={quickSearch} onChange={(e) => setQuickSearch(e.target.value)} placeholder={t('catalog.searchInside')} aria-label="Cari dalam hasil" />
            {quickSearch && <button type="button" onClick={() => setQuickSearch('')} aria-label="Bersihkan"><X size={14} /></button>}
          </div>
          <FilterPanel filters={filters} onChange={update} onReset={reset} />
        </aside>

        <section className="catalog-main">
          <div className="catalog-toolbar">
            <div className="tabs catalog-tabs">
              <button type="button" className={tab === 'all' && !filters.featured ? 'is-active' : ''} onClick={() => { setTab('all'); if (filters.featured) update({ featured: false }) }}>{t('common.all')}</button>
              <button type="button" className={filters.featured ? 'is-active' : ''} onClick={() => update({ featured: true })}>{t('catalog.featured')}</button>
              <button type="button" className={tab === 'popular' ? 'is-active' : ''} onClick={() => setTab('popular')}>{t('catalog.sort.popular')}</button>
            </div>
            <div className="toolbar-right">
              <button type="button" className="btn btn-outline btn-sm filter-mobile-btn" onClick={() => setFilterOpen(true)}>
                <SlidersHorizontal size={15} /> {t('common.filter')} {activeChips.length > 0 && <span className="filter-count">{activeChips.length}</span>}
              </button>
              <label className="sort-select">
                <span>{t('common.sort')}:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={t('common.sort')}>
                  <option value="popular">{t('catalog.sort.popular')}</option>
                  <option value="newest">{t('catalog.sort.newest')}</option>
                  <option value="title">{t('catalog.sort.title')}</option>
                  <option value="rating">{t('catalog.sort.rating')}</option>
                </select>
                <ChevronDown size={14} />
              </label>
              <div className="view-toggle">
                <button type="button" className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-label={t('catalog.gridView')}><Grid2X2 size={16} /></button>
                <button type="button" className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label={t('catalog.listView')}><List size={17} /></button>
              </div>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="active-filters">
              <span>{t('catalog.activeFilters')}:</span>
              {activeChips.map((chip) => (
                <button key={chip.label} type="button" onClick={chip.onRemove}>{chip.label} <X size={12} /></button>
              ))}
              <button type="button" className="clear-all" onClick={reset}>{t('catalog.clear')}</button>
            </div>
          )}

          {visible.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon"><Search size={26} /></span>
              <h2>{t('catalog.empty')}</h2>
              <p>{t('catalog.emptyHint')}</p>
              <button type="button" className="btn btn-primary" onClick={reset}>{t('common.reset')}</button>
            </div>
          ) : (
            <div className={cx('book-grid catalog-grid', view === 'list' && 'as-list')}>
              {visible.map((book) => <BookCard key={book.id} book={book} layout={view} />)}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Paginasi">
              <button type="button" className="page-btn arrow" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} aria-label="Halaman sebelumnya"><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                .map((n, index, arr) => (
                  <span key={n} className="page-fragment">
                    {index > 0 && arr[index - 1] !== n - 1 && <span className="page-ellipsis">…</span>}
                    <button type="button" className={cx('page-btn', n === safePage && 'is-active')} onClick={() => setPage(n)} aria-current={n === safePage ? 'page' : undefined}>{n}</button>
                  </span>
                ))}
              <button type="button" className="page-btn arrow" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} aria-label="Halaman berikutnya"><ChevronRight size={16} /></button>
              <span className="page-info">{t('catalog.page')} {safePage} / {totalPages}</span>
            </nav>
          )}
        </section>
      </div>

      {filterOpen && (
        <div className="filter-drawer-backdrop" role="dialog" aria-modal="true" aria-label={t('common.filter')}>
          <div className="filter-drawer">
            <FilterPanel filters={filters} onChange={update} onReset={reset} onClose={() => setFilterOpen(false)} />
            <button type="button" className="btn btn-primary btn-block" onClick={() => setFilterOpen(false)}>{t('common.apply')} · {filtered.length}</button>
          </div>
        </div>
      )}
    </div>
  )
}
