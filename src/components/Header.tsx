import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  BookMarked, ChevronDown, Heart, LogOut, Menu, Moon, Search, Sun, User, X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories, categoryCounts, searchBooks } from '../data'
import { BookCover } from './BookCover'
import { Logo } from './Logo'
import { cx } from '../lib/utils'

export function Header() {
  const { t, lang, setLang, theme, toggleTheme, favorites, shelf, user, logout, openAuth, openSearch, openShelf } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const suggestions = query.trim().length > 1 ? searchBooks(query, 5) : []

  useEffect(() => {
    setMenuOpen(false)
    setMobileOpen(false)
    setUserOpen(false)
    setFocused(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
      if (userRef.current && !userRef.current.contains(event.target as Node)) setUserOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setMobileOpen(false)
        setUserOpen(false)
        setFocused(false)
      }
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const goAllResults = () => {
    const q = query.trim()
    if (!q) {
      openSearch()
      return
    }
    navigate(`/katalog?q=${encodeURIComponent(q)}`)
    setQuery('')
    setFocused(false)
  }

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    goAllResults()
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="icon-btn mobile-only" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
          <Menu size={21} />
        </button>
        <Logo />

        <div className="header-menu" ref={menuRef}>
          <button
            type="button"
            className={cx('menu-trigger', menuOpen && 'is-open')}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <Menu size={16} />
            {t('nav.menu')}
            <ChevronDown size={14} className="chev" />
          </button>
          {menuOpen && (
            <div className="mega-menu" role="menu">
              <div className="mega-col">
                <p className="mega-label">{t('nav.catalog')}</p>
                <Link to="/katalog" role="menuitem">{t('common.all')} · 330</Link>
                <Link to="/katalog?tab=featured" role="menuitem">{t('catalog.featured')}</Link>
                <Link to="/katalog?sort=popular" role="menuitem">{t('catalog.sort.popular')}</Link>
                <Link to="/favorit" role="menuitem">{t('nav.favorites')}</Link>
                <Link to="/rak" role="menuitem">{t('nav.shelf')}</Link>
              </div>
              <div className="mega-col mega-categories">
                <p className="mega-label">{t('nav.categories')}</p>
                <div className="mega-grid">
                  {categories.map((c) => (
                    <Link key={c.id} to={`/katalog?category=${c.id}`} role="menuitem">
                      <span className="dot" style={{ background: c.color }} />
                      {c.name}
                      <em>{categoryCounts[c.id]}</em>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mega-quote">
                <span className="arabic">اطلبوا العلم من المهد إلى اللحد</span>
                <p>“Tuntutlah ilmu dari buaian hingga liang lahat.”</p>
              </div>
            </div>
          )}
        </div>

        <form className="header-search" onSubmit={submitSearch} role="search">
          <Search size={18} className="search-icon" aria-hidden="true" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={t('search.placeholder')}
            aria-label={t('common.search')}
          />
          {query && (
            <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label="Bersihkan pencarian">
              <X size={15} />
            </button>
          )}
          <kbd>/</kbd>
          {focused && query.trim().length > 1 && (
            <div className="search-suggest">
              {suggestions.length === 0 ? (
                <div className="suggest-empty">{t('search.noResults')}</div>
              ) : (
                suggestions.map((b) => (
                  <Link key={b.id} to={`/kitab/${b.slug}`} className="suggest-item">
                    <BookCover book={b} size="mini" />
                    <span>
                      <strong>{b.title}</strong>
                      <small>{b.author}</small>
                    </span>
                  </Link>
                ))
              )}
              <button type="button" className="suggest-all" onClick={goAllResults}>
                {t('search.all')} <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </form>

        <div className="header-actions">
          <button type="button" className="icon-btn mobile-search" onClick={openSearch} aria-label={t('common.search')}>
            <Search size={19} />
          </button>
          <button type="button" className="icon-btn hide-sm" onClick={toggleTheme} aria-label={theme === 'light' ? 'Mode gelap' : 'Mode terang'}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link to="/favorit" className="icon-btn badge-wrap" aria-label={`${t('nav.favorites')} (${favorites.length})`}>
            <Heart size={19} />
            {favorites.length > 0 && <span className="count-bubble">{favorites.length}</span>}
          </Link>
          <button type="button" className="icon-btn badge-wrap hide-sm" onClick={openShelf} aria-label={`${t('nav.shelf')} (${shelf.length})`}>
            <BookMarked size={19} />
            {shelf.length > 0 && <span className="count-bubble">{shelf.length}</span>}
          </button>
          <button
            type="button"
            className="lang-switch"
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            aria-label="Ganti bahasa"
          >
            {lang.toUpperCase()}
          </button>

          {user ? (
            <div className="user-menu" ref={userRef}>
              <button type="button" className="avatar-btn" onClick={() => setUserOpen((v) => !v)} aria-expanded={userOpen}>
                {user.name.slice(0, 1).toUpperCase()}
              </button>
              {userOpen && (
                <div className="user-pop">
                  <div className="user-pop-head">
                    <span className="avatar-lg">{user.name.slice(0, 1).toUpperCase()}</span>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>
                  <Link to="/favorit"><Heart size={15} /> {t('nav.favorites')}</Link>
                  <Link to="/rak"><BookMarked size={15} /> {t('nav.shelf')}</Link>
                  <Link to="/tentang"><User size={15} /> {t('common.profile')}</Link>
                  <button type="button" onClick={logout}><LogOut size={15} /> {t('common.signOut')}</button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="btn btn-primary btn-sm header-login" onClick={openAuth}>
              <User size={15} /> {t('common.signIn')}
            </button>
          )}
        </div>
      </div>

      <nav className="header-nav" aria-label="Navigasi utama">
        <NavLink to="/" end>{t('nav.home')}</NavLink>
        <NavLink to="/katalog">{t('nav.catalog')}</NavLink>
        <NavLink to="/katalog?tab=featured">{t('catalog.featured')}</NavLink>
        <NavLink to="/rak">{t('nav.shelf')}</NavLink>
        <NavLink to="/tentang">{t('nav.about')}</NavLink>
        <button type="button" className="nav-search-link" onClick={openSearch}>
          <Search size={14} /> {t('common.search')}
        </button>
        <span className="nav-note">599 PDF · {t('common.free')}</span>
      </nav>

      {mobileOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <aside className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <Logo />
              <button type="button" className="icon-btn" onClick={() => setMobileOpen(false)} aria-label={t('common.close')}>
                <X size={20} />
              </button>
            </div>
            <Link to="/" className="mobile-link">{t('nav.home')}</Link>
            <Link to="/katalog" className="mobile-link">{t('nav.catalog')}</Link>
            <Link to="/favorit" className="mobile-link">{t('nav.favorites')} <em>{favorites.length}</em></Link>
            <Link to="/rak" className="mobile-link">{t('nav.shelf')} <em>{shelf.length}</em></Link>
            <Link to="/tentang" className="mobile-link">{t('nav.about')}</Link>
            <p className="drawer-label">{t('nav.categories')}</p>
            <div className="mobile-cats">
              {categories.map((c) => (
                <Link key={c.id} to={`/katalog?category=${c.id}`}>
                  <span className="dot" style={{ background: c.color }} /> {c.name}
                </Link>
              ))}
            </div>
            <div className="drawer-foot">
              <button type="button" className="btn btn-primary btn-block" onClick={() => { setMobileOpen(false); user ? openShelf() : openAuth() }}>
                {user ? t('shelf.open') : t('common.signIn')}
              </button>
              <button type="button" className="btn btn-ghost btn-block" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} {theme === 'light' ? 'Mode gelap' : 'Mode terang'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}
