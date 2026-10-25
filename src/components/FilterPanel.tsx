import { useState } from 'react'
import { ChevronDown, RotateCcw, Search, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { authors, categories, categoryCounts, collectionCounts, languages } from '../data'
import { cx } from '../lib/utils'

export interface Filters {
  categories: string[]
  languages: string[]
  era: string
  featured: boolean
  collection: string
  author: string
}

interface Props {
  filters: Filters
  onChange: (next: Partial<Filters>) => void
  onReset: () => void
  onClose?: () => void
}

export function FilterPanel({ filters, onChange, onReset, onClose }: Props) {
  const { t } = useApp()
  const [open, setOpen] = useState<Record<string, boolean>>({ category: true, language: true, era: true, author: false, collection: false })
  const collectionEntries = Object.entries(collectionCounts).sort((a, b) => b[1] - a[1])
  const [authorQuery, setAuthorQuery] = useState('')

  const toggleOpen = (key: string) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  const toggleCategory = (id: string) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id]
    onChange({ categories: next })
  }

  const toggleLanguage = (lang: string) => {
    const next = filters.languages.includes(lang)
      ? filters.languages.filter((l) => l !== lang)
      : [...filters.languages, lang]
    onChange({ languages: next })
  }

  const filteredAuthors = authors.filter((a) => a.toLowerCase().includes(authorQuery.toLowerCase()))

  return (
    <div className="filter-panel">
      <div className="filter-head">
        <h2>{t('catalog.filters')}</h2>
        <div>
          <button type="button" className="filter-reset" onClick={onReset}><RotateCcw size={13} /> {t('common.reset')}</button>
          {onClose && <button type="button" className="icon-btn" onClick={onClose} aria-label={t('common.close')}><X size={18} /></button>}
        </div>
      </div>

      <div className="filter-block">
        <button type="button" className="filter-toggle" onClick={() => toggleOpen('category')} aria-expanded={open.category}>
          {t('catalog.category')} <ChevronDown size={16} className={cx(open.category && 'rotated')} />
        </button>
        {open.category && (
          <div className="filter-options">
            {categories.map((c) => {
              const checked = filters.categories.includes(c.id)
              return (
                <label key={c.id} className={cx('check-row', checked && 'is-checked')}>
                  <input type="checkbox" checked={checked} onChange={() => toggleCategory(c.id)} />
                  <span className="custom-check" aria-hidden="true" />
                  <span className="check-label">{c.name}</span>
                  <em>{categoryCounts[c.id]}</em>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="filter-block">
        <button type="button" className="filter-toggle" onClick={() => toggleOpen('language')} aria-expanded={open.language}>
          {t('catalog.language')} <ChevronDown size={16} className={cx(open.language && 'rotated')} />
        </button>
        {open.language && (
          <div className="filter-options">
            {languages.map((lang) => {
              const checked = filters.languages.includes(lang)
              return (
                <label key={lang} className={cx('check-row', checked && 'is-checked')}>
                  <input type="checkbox" checked={checked} onChange={() => toggleLanguage(lang)} />
                  <span className="custom-check" aria-hidden="true" />
                  <span className="check-label">{lang}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="filter-block">
        <button type="button" className="filter-toggle" onClick={() => toggleOpen('era')} aria-expanded={open.era}>
          {t('catalog.era')} <ChevronDown size={16} className={cx(open.era && 'rotated')} />
        </button>
        {open.era && (
          <div className="era-options">
            {[{ id: 'all', label: t('common.all') }, { id: 'klasik', label: t('common.classic') }, { id: 'modern', label: t('common.modern') }].map((item) => (
              <button
                key={item.id}
                type="button"
                className={cx('chip-option', filters.era === item.id && 'is-active')}
                onClick={() => onChange({ era: item.id })}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="filter-block">
        <button type="button" className="filter-toggle" onClick={() => toggleOpen('author')} aria-expanded={open.author}>
          {t('catalog.author')} <ChevronDown size={16} className={cx(open.author && 'rotated')} />
        </button>
        {open.author && (
          <div className="author-filter">
            <div className="mini-search">
              <Search size={14} />
              <input value={authorQuery} onChange={(e) => setAuthorQuery(e.target.value)} placeholder={t('catalog.searchAuthor')} aria-label={t('catalog.searchAuthor')} />
            </div>
            <div className="author-list">
              <button type="button" className={cx('author-option', !filters.author && 'is-active')} onClick={() => onChange({ author: '' })}>
                {t('common.all')}
              </button>
              {filteredAuthors.map((author) => (
                <button
                  key={author}
                  type="button"
                  className={cx('author-option', filters.author === author && 'is-active')}
                  onClick={() => onChange({ author })}
                >
                  {author}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="filter-block">
        <button type="button" className="filter-toggle" onClick={() => toggleOpen('collection')} aria-expanded={open.collection}>
          {t('catalog.shelfOrigin')} <ChevronDown size={16} className={cx(open.collection && 'rotated')} />
        </button>
        {open.collection && (
          <div className="filter-options">
            {collectionEntries.map(([name, count]) => (
              <button
                key={name}
                type="button"
                className={cx('author-option', filters.collection === name && 'is-active')}
                onClick={() => onChange({ collection: filters.collection === name ? '' : name })}
              >
                {name} <em>{count}</em>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="filter-block filter-feature">
        <label className={cx('check-row', filters.featured && 'is-checked')}>
          <input type="checkbox" checked={filters.featured} onChange={(e) => onChange({ featured: e.target.checked })} />
          <span className="custom-check" aria-hidden="true" />
          <span className="check-label">{t('catalog.featured')}</span>
        </label>
      </div>

      <div className="filter-source">
        <span>PDF</span>
        <p>{t('catalog.available')} · Google Drive</p>
      </div>
    </div>
  )
}
