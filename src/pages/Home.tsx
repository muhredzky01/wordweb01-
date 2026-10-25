import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BookOpen, BookmarkCheck, ChevronLeft, ChevronRight, Download,
  GraduationCap, LibraryBig, Quote, ShieldCheck, Sparkles, Star,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { books, categories, categoryCounts, collectionCounts, featuredBooks, popularSearches, topReaders, totalVolumes } from '../data'
import { BookCard } from '../components/BookCard'
import { BookCover } from '../components/BookCover'
import { Reveal } from '../components/Reveal'
import { Newsletter } from '../components/Newsletter'
import { Rating } from '../components/Rating'
import { numberID } from '../lib/utils'

type Tab = 'new' | 'popular' | 'all'

export function Home() {
  useEffect(() => { document.title = 'Maktabah Kitab — Perpustakaan Kitab Digital' }, [])
  const { t, user, openAuth, openShelf, shelf } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<Tab>('new')
  const railRef = useRef<HTMLDivElement>(null)

  const heroBooks = featuredBooks.slice(0, 4)
  const picks = featuredBooks.slice(4, 13)

  const tabBooks = (() => {
    if (tab === 'popular') return [...books].sort((a, b) => b.readers - a.readers).slice(0, 8)
    if (tab === 'all') return books.slice(0, 8)
    return [...books].sort((a, b) => b.id.localeCompare(a.id)).slice(-8).reverse()
  })()

  const scrollRail = (dir: number) => {
    railRef.current?.scrollBy({ left: dir * 640, behavior: 'smooth' })
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `/katalog?q=${encodeURIComponent(q)}` : '/katalog')
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="hero-grid-dots" />
          <span className="hero-arabic">مكتبة</span>
        </div>
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="pill pill-light"><Sparkles size={14} /> {t('home.heroBadge')}</span>
            <h1>
              {t('home.heroTitle1')}
              <br />
              <span>{t('home.heroTitle2')}</span>
            </h1>
            <p className="hero-text">{t('home.heroText')}</p>
            <form className="hero-search" onSubmit={submit} role="search">
              <SearchGlyph />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                aria-label={t('home.searchPlaceholder')}
              />
              <button type="submit" className="btn btn-primary">
                {t('common.search')} <ArrowRight size={16} />
              </button>
            </form>
            <div className="hero-popular">
              <span>{t('home.popular')}</span>
              {popularSearches.slice(0, 4).map((term) => (
                <button key={term} type="button" onClick={() => navigate(`/katalog?q=${encodeURIComponent(term)}`)}>
                  {term}
                </button>
              ))}
            </div>
            <div className="hero-stats">
              <div><strong>{books.length}</strong><span>{t('home.statBooks')}</span></div>
              <div><strong>{totalVolumes}</strong><span>{t('home.statVolumes')}</span></div>
              <div><strong>100%</strong><span>{t('home.statFree')}</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-book hero-book-a">
              <Link to={`/kitab/${heroBooks[0]?.slug}`} tabIndex={-1}>
                <BookCover book={heroBooks[0]} size="hero" eager />
              </Link>
            </div>
            <div className="hero-book hero-book-b">
              <Link to={`/kitab/${heroBooks[1]?.slug}`} tabIndex={-1}>
                <BookCover book={heroBooks[1]} size="hero" eager />
              </Link>
            </div>
            <div className="hero-book hero-book-c">
              <Link to={`/kitab/${heroBooks[2]?.slug}`} tabIndex={-1}>
                <BookCover book={heroBooks[2]} size="hero" eager />
              </Link>
            </div>
            <div className="floating-card float-top">
              <span className="float-icon green"><Download size={17} /></span>
              <div><strong>{totalVolumes} jilid PDF</strong><small>{t('home.floatDownload')}</small></div>
            </div>
            <div className="floating-card float-bottom">
              <span className="float-icon amber"><Star size={17} fill="currentColor" /></span>
              <div><strong>4.8 / 5</strong><small>{t('home.floatReaders')}</small></div>
            </div>
            <div className="floating-arabic">
              <span>العلم نور</span>
              <small>{t('home.floatLight')}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-grid">
          <div><span className="trust-icon"><BookOpen size={19} /></span><div><strong>{t('home.trust1Title')}</strong><small>{t('home.trust1Text')}</small></div></div>
          <div><span className="trust-icon"><ShieldCheck size={19} /></span><div><strong>{t('home.trust2Title')}</strong><small>{t('home.trust2Text')}</small></div></div>
          <div><span className="trust-icon"><Download size={19} /></span><div><strong>{t('home.trust3Title')}</strong><small>{t('home.trust3Text')}</small></div></div>
          <div><span className="trust-icon"><BookmarkCheck size={19} /></span><div><strong>{t('home.trust4Title')}</strong><small>{t('home.trust4Text')}</small></div></div>
        </div>
      </section>

      <section className="section container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow"><LibraryBig size={15} /> {t('nav.categories')}</p>
            <h2>{t('home.categories')}</h2>
            <p className="section-sub">{t('home.categoriesSub')}</p>
          </div>
          <Link to="/katalog" className="text-link">{t('common.viewAll')} <ArrowRight size={15} /></Link>
        </Reveal>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 40}>
              <Link
                to={`/katalog?category=${category.id}`}
                className="category-card"
                style={{ ['--cat' as string]: category.color, ['--cat-light' as string]: category.light }}
              >
                <span className="category-glyph" aria-hidden="true">{category.arabic.split(' ')[0]}</span>
                <span className="category-info">
                  <strong>{category.name}</strong>
                  <small>{categoryCounts[category.id]} kitab</small>
                </span>
                <span className="category-arrow"><ArrowRight size={15} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <p className="eyebrow"><Sparkles size={15} /> {t('catalog.featured')}</p>
              <h2>{t('home.editorPicks')}</h2>
              <p className="section-sub">{t('home.editorPicksSub')}</p>
            </div>
            <div className="rail-buttons">
              <button type="button" className="icon-btn round" onClick={() => scrollRail(-1)} aria-label="Sebelumnya"><ChevronLeft size={18} /></button>
              <button type="button" className="icon-btn round" onClick={() => scrollRail(1)} aria-label="Berikutnya"><ChevronRight size={18} /></button>
            </div>
          </Reveal>
          <div className="book-rail" ref={railRef}>
            {picks.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
          <Link to="/katalog?tab=featured" className="rail-all">
            {t('common.viewAll')} {featuredBooks.length} pilihan editor <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="section container">
        <Reveal className="promo-banner">
          <div className="promo-copy">
            <p className="eyebrow light"><GraduationCap size={15} /> {t('home.promoEyebrow')}</p>
            <h2>{t('home.promoTitle')}</h2>
            <p>{t('home.promoText')}</p>
            <Link to="/katalog" className="btn btn-light btn-lg">{t('home.promoBtn')} <ArrowRight size={17} /></Link>
            <span className="promo-foot"><BookOpen size={15} /> {t('home.promoStat')}</span>
          </div>
          <div className="promo-art" aria-hidden="true">
            <span className="promo-circle" />
            {heroBooks.slice(0, 3).map((book, i) => (
              <div className={`promo-book promo-book-${i}`} key={book.id}>
                <BookCover book={book} size="card" />
              </div>
            ))}
            <span className="promo-arabic">اقرأ</span>
          </div>
        </Reveal>
      </section>

      <section className="section container">
        <Reveal className="section-head section-head-tabs">
          <div>
            <p className="eyebrow"><LibraryBig size={15} /> {t('nav.catalog')}</p>
            <h2>{t('home.newest')}</h2>
            <p className="section-sub">{t('home.newestSub')}</p>
          </div>
          <div className="tabs">
            {(['new', 'popular', 'all'] as Tab[]).map((item) => (
              <button key={item} type="button" className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)}>
                {item === 'new' ? t('home.tabs.new') : item === 'popular' ? t('home.tabs.popular') : t('home.tabs.all')}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="book-grid">
          {tabBooks.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
        <div className="center-action">
          <Link to="/katalog" className="btn btn-outline">{t('common.viewAll')} {books.length} kitab <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <p className="eyebrow"><BookmarkCheck size={15} /> {t('home.collections')}</p>
              <h2>{t('home.collections')}</h2>
              <p className="section-sub">{t('home.collectionsSub')}</p>
            </div>
          </Reveal>
          <div className="collection-grid">
            {Object.entries(collectionCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count], index) => (
              <Reveal key={name} delay={index * 30}>
                <Link to={`/katalog?collection=${encodeURIComponent(name)}`} className="collection-card">
                  <span className="collection-count">{count} PDF</span>
                  <strong lang="ar" dir="rtl">{name}</strong>
                  <span className="collection-link">{t('common.explore')} <ArrowRight size={14} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="split-highlight">
          <Reveal className="quote-card">
            <Quote size={30} className="quote-mark" />
            <p className="quote-arabic" dir="rtl">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</p>
            <p className="quote-text">{t('home.quote')}</p>
            <span>{t('home.quoteSource')}</span>
          </Reveal>
          <Reveal className="reader-card" delay={80}>
            <div className="reader-card-head">
              <span className="eyebrow light"><Star size={14} /> {t('home.topReaders')}</span>
              <Link to="/katalog?sort=popular">{t('common.viewAll')} <ArrowRight size={14} /></Link>
            </div>
            <ol className="reader-list">
              {topReaders.slice(0, 4).map((book, index) => (
                <li key={book.id}>
                  <span className="reader-rank">0{index + 1}</span>
                  <Link to={`/kitab/${book.slug}`} className="reader-book">
                    <BookCover book={book} size="mini" />
                    <span><strong>{book.title}</strong><small>{book.author}</small></span>
                  </Link>
                  <span className="reader-count">{numberID(book.readers)}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal className="community-banner">
          <div>
            <p className="eyebrow light"><BookOpen size={15} /> Ruang baca pribadi</p>
            <h2>{user ? t('home.personalWelcome').replace('{name}', user.name.split(' ')[0]) : t('home.personalTitle')}</h2>
            <p>{t('home.personalText')}</p>
          </div>
          <div className="community-actions">
            {user ? (
              <button type="button" className="btn btn-light btn-lg" onClick={openShelf}><BookmarkCheck size={17} /> {t('shelf.open')} ({shelf.length})</button>
            ) : (
              <>
                <button type="button" className="btn btn-light btn-lg" onClick={openAuth}>{t('home.startFree')} <ArrowRight size={17} /></button>
                <Link to="/katalog" className="btn btn-ghost-light btn-lg">{t('home.exploreCatalog')}</Link>
              </>
            )}
          </div>
        </Reveal>
      </section>

      <section className="section container">
        <Newsletter />
      </section>
    </div>
  )
}

function SearchGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
