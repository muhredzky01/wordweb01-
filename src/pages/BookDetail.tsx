import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, BookOpen, BookmarkCheck, BookmarkPlus, Check, ChevronRight,
  Download, ExternalLink, FileText, Heart, Layers, Quote, Share2, Star, Users,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { bookBySlug, categoryMap, relatedBooks } from '../data'
import { BookCover } from '../components/BookCover'
import { BookCard } from '../components/BookCard'
import { Rating } from '../components/Rating'
import { Reveal } from '../components/Reveal'
import { DRIVE_DOWNLOAD, DRIVE_VIEW, cx, numberID, seeded } from '../lib/utils'
import type { Review } from '../types'

type Tab = 'about' | 'volumes' | 'reviews'

const reviewNames = ['Nur Aisyah', 'Fajar Ramadhan', 'Husna Zahira', 'Muhammad Rizal', 'Salma Nabila', 'Aditya Pratama']
const reviewTexts = [
  'Alhamdulillah, naskahnya jelas dan mudah dibaca. Sangat membantu untuk kajian rutin di majelis.',
  'Rujukan yang lengkap. Saya unduh untuk dibaca luring saat perjalanan, kualitas PDF-nya bagus.',
  'Pembahasannya runtut dan dalam. Cocok untuk yang ingin serius mendalami bidang ini.',
  'Terima kasih sudah menyediakan gratis. Semoga menjadi amal jariyah bagi semua yang terlibat.',
  'Saya pakai sebagai bahan ajar di kelas. Peserta didik mudah mengikuti alur pembahasannya.',
]

export function BookDetail() {
  const { slug = '' } = useParams()
  const book = bookBySlug(slug)
  const navigate = useNavigate()
  const { t, favorites, toggleFavorite, shelf, toggleShelf, reviews, addReview, user, toast } = useApp()
  const [tab, setTab] = useState<Tab>('about')
  const [reviewName, setReviewName] = useState(user?.name ?? '')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)

  useEffect(() => {
    if (book) document.title = `${book.title} — Maktabah Kitab`
  }, [book])

  const generatedReviews = useMemo<Review[]>(() => {
    if (!book) return []
    return Array.from({ length: 3 }, (_, i) => {
      const seed = seeded(book.id + i, 0, 9999)
      return {
        id: `${book.id}-g${i}`,
        bookId: book.id,
        name: reviewNames[seed % reviewNames.length],
        rating: 4 + (seed % 2),
        text: reviewTexts[seed % reviewTexts.length],
        date: `2025-0${(seed % 9) + 1}-1${seed % 9}`,
      }
    })
  }, [book])

  if (!book) {
    return (
      <div className="page container empty-state standalone">
        <h1>Kitab tidak ditemukan</h1>
        <p>Kitab yang Anda cari mungkin sudah dipindahkan.</p>
        <Link to="/katalog" className="btn btn-primary">Kembali ke katalog</Link>
      </div>
    )
  }

  const category = categoryMap[book.category]
  const fav = favorites.includes(book.id)
  const saved = shelf.includes(book.id)
  const userReviews = reviews.filter((r) => r.bookId === book.id)
  const allReviews = [...userReviews, ...generatedReviews]
  const related = relatedBooks(book, 4)
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: star === 5 ? 72 : star === 4 ? 21 : star === 3 ? 5 : star === 2 ? 1 : 1,
  }))

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: book.title, text: book.subtitle || book.description, url })
      else {
        await navigator.clipboard.writeText(url)
        toast(t('detail.copied'))
      }
    } catch {
      /* cancelled */
    }
  }

  const submitReview = (event: React.FormEvent) => {
    event.preventDefault()
    if (!reviewName.trim() || reviewText.trim().length < 5) {
      toast('Lengkapi nama dan ulasan Anda.', 'error')
      return
    }
    addReview({
      id: `r-${Date.now()}`,
      bookId: book.id,
      name: reviewName.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toISOString().slice(0, 10),
    })
    setReviewText('')
    toast(t('detail.reviewThanks'))
  }

  return (
    <div className="page detail-page">
      <div className="container">
        <button type="button" className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={15} /> {t('common.back')}</button>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Beranda</Link><span>/</span><Link to="/katalog">Katalog</Link><span>/</span>
          <Link to={`/katalog?category=${book.category}`}>{category.name}</Link><span>/</span>
          <span className="crumb-current">{book.title}</span>
        </nav>

        <div className="detail-top">
          <div className="detail-visual">
            <div className="detail-cover-wrap">
              <BookCover book={book} size="detail" eager />
              <span className="detail-format">PDF</span>
              <button type="button" className={cx('detail-heart', fav && 'is-active')} onClick={() => toggleFavorite(book.id)} aria-label="Favorit" aria-pressed={fav}>
                <Heart size={19} fill={fav ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="detail-mini-stats">
              <div><Layers size={17} /><strong>{book.volumes}</strong><span>{t('common.volumes')}</span></div>
              <div><Users size={17} /><strong>{numberID(book.readers)}</strong><span>{t('detail.readers')}</span></div>
              <div><Star size={17} /><strong>{book.rating.toFixed(1)}</strong><span>{t('detail.rating')}</span></div>
            </div>
          </div>

          <div className="detail-info">
            <div className="detail-eyebrow">
              <span className="cat-badge" style={{ background: category.light, color: category.color }}>{category.name}</span>
              <span className="pill pill-soft">{book.era === 'klasik' ? t('common.classic') : t('common.modern')}</span>
              {book.featured && <span className="pill pill-purple">Pilihan editor</span>}
            </div>
            <h1>{book.title}</h1>
            {book.arabic && <p className="detail-arabic" dir="rtl">{book.arabic}</p>}
            {book.subtitle && <p className="detail-subtitle">{book.subtitle}</p>}
            <p className="detail-author">{t('common.by')} <strong>{book.author}</strong></p>

            <div className="detail-rating-row">
              <Rating value={book.rating} size={16} />
              <span className="rating-note">{numberID(book.readers)} {t('detail.readers')} · {allReviews.length} ulasan</span>
            </div>

            <p className="detail-desc">{book.description}</p>

            <div className="detail-facts">
              <div><span>{t('common.language')}</span><strong>{book.language}</strong></div>
              <div><span>{t('common.category')}</span><strong>{category.name}</strong></div>
              <div><span>{t('common.format')}</span><strong>PDF · {book.volumes > 1 ? `${book.volumes} ${t('common.volumes')}` : '1 file'}</strong></div>
              <div><span>Sumber</span><strong>Google Drive</strong></div>
            </div>

            <div className="detail-actions">
              <Link to={`/baca/${book.slug}`} className="btn btn-primary btn-lg"><BookOpen size={18} /> {t('common.readNow')}</Link>
              <a href={DRIVE_DOWNLOAD(book.driveId)} target="_blank" rel="noreferrer" className="btn btn-outline btn-lg"><Download size={17} /> {t('common.download')}</a>
              <button type="button" className={cx('btn btn-outline btn-lg icon-only-mobile', saved && 'is-saved')} onClick={() => toggleShelf(book.id)}>
                {saved ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />} <span>{saved ? t('common.inShelf') : t('common.save')}</span>
              </button>
              <button type="button" className="btn btn-ghost btn-lg icon-only" onClick={share} aria-label={t('detail.share')}><Share2 size={18} /></button>
            </div>

            <p className="detail-free"><Check size={15} /> Gratis untuk dibaca dan diunduh · {book.volumes > 1 ? `${book.volumes} jilid` : '1 jilid'} PDF</p>
          </div>
        </div>

        <div className="detail-tabs-wrap">
          <div className="detail-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'about'} className={tab === 'about' ? 'is-active' : ''} onClick={() => setTab('about')}>{t('detail.about')}</button>
            <button type="button" role="tab" aria-selected={tab === 'volumes'} className={tab === 'volumes' ? 'is-active' : ''} onClick={() => setTab('volumes')}>{t('detail.volumes')} <em>{book.volumes}</em></button>
            <button type="button" role="tab" aria-selected={tab === 'reviews'} className={tab === 'reviews' ? 'is-active' : ''} onClick={() => setTab('reviews')}>{t('detail.reviews')} <em>{allReviews.length}</em></button>
          </div>

          {tab === 'about' && (
            <div className="detail-tab-body about-grid">
              <div className="prose">
                <h3>Tentang kitab ini</h3>
                <p>{book.description}</p>
                <p>Koleksi ini dirawat dari rak “{book.collection}” di perpustakaan sumber. Berkas PDF dapat dibaca langsung di ruang baca Maktabah atau diunduh untuk kajian luring.</p>
                <blockquote><Quote size={16} /> {t('detail.sourceText')}</blockquote>
                <h3>{t('detail.tags')}</h3>
                <div className="tag-row">
                  {Array.from(new Set([...book.tags, book.language, book.era === 'klasik' ? t('common.classic') : t('common.modern')])).map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <aside className="detail-side-card">
                <h4>{t('detail.details')}</h4>
                <dl>
                  <div><dt>{t('common.author')}</dt><dd>{book.author}</dd></div>
                  <div><dt>{t('common.language')}</dt><dd>{book.language}</dd></div>
                  <div><dt>{t('common.volume')}</dt><dd>{book.volumes} jilid</dd></div>
                  <div><dt>{t('common.era')}</dt><dd>{book.era === 'klasik' ? t('common.classic') : t('common.modern')}</dd></div>
                  <div><dt>Rak asal</dt><dd>{book.collection}</dd></div>
                  <div><dt>ID</dt><dd className="mono">{book.id.toUpperCase()}</dd></div>
                </dl>
                <a href={DRIVE_VIEW(book.driveId)} target="_blank" rel="noreferrer" className="text-link">{t('reader.openDrive')} <ExternalLink size={13} /></a>
              </aside>
            </div>
          )}

          {tab === 'volumes' && (
            <div className="detail-tab-body">
              <div className="volume-list">
                {book.files.map((file, index) => (
                  <div className="volume-row" key={file.id}>
                    <span className="volume-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="volume-icon"><FileText size={18} /></span>
                    <div className="volume-name">
                      <strong>{file.name.replace(/\.pdf$/i, '')}</strong>
                      <small>PDF · Google Drive</small>
                    </div>
                    <Link to={`/baca/${book.slug}?v=${index}`} className="btn btn-soft btn-sm"><BookOpen size={14} /> {t('common.read')}</Link>
                    <a href={DRIVE_DOWNLOAD(file.id)} target="_blank" rel="noreferrer" className="icon-btn" aria-label={`Unduh ${file.name}`}><Download size={16} /></a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="detail-tab-body reviews-wrap">
              <div className="reviews-summary">
                <div className="big-score">
                  <strong>{book.rating.toFixed(1)}</strong>
                  <Rating value={book.rating} size={16} />
                  <span>{allReviews.length} ulasan</span>
                </div>
                <div className="rating-bars">
                  {distribution.map((row) => (
                    <div key={row.star}>
                      <span>{row.star} <Star size={11} fill="currentColor" /></span>
                      <span className="bar"><i style={{ width: `${row.pct}%` }} /></span>
                      <em>{row.pct}%</em>
                    </div>
                  ))}
                </div>
              </div>

              <div className="review-list">
                {allReviews.map((review) => (
                  <article className="review" key={review.id}>
                    <span className="review-avatar">{review.name.slice(0, 1).toUpperCase()}</span>
                    <div>
                      <header><strong>{review.name}</strong><span>{review.date}</span></header>
                      <Rating value={review.rating} />
                      <p>{review.text}</p>
                    </div>
                  </article>
                ))}
              </div>

              <form className="review-form" onSubmit={submitReview}>
                <h3>{t('detail.reviews')}</h3>
                <div className="review-form-row">
                  <label className="field">
                    <span>{t('detail.reviewName')}</span>
                    <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Nama Anda" />
                  </label>
                  <div className="field">
                    <span>Rating</span>
                    <div className="star-picker">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setReviewRating(star)} aria-label={`${star} bintang`}>
                          <Star size={22} fill={star <= reviewRating ? 'currentColor' : 'none'} className={star <= reviewRating ? 'on' : ''} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <label className="field">
                  <span>{t('detail.reviewPlaceholder')}</span>
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={4} placeholder={t('detail.reviewPlaceholder')} />
                </label>
                <button type="submit" className="btn btn-primary">{t('detail.reviewSubmit')} <ArrowRight size={15} /></button>
              </form>
            </div>
          )}
        </div>

        <section className="section related-section">
          <div className="section-head">
            <div><p className="eyebrow"><BookOpen size={15} /> {t('detail.related')}</p><h2>{t('detail.related')}</h2></div>
            <Link to={`/katalog?category=${book.category}`} className="text-link">{t('common.viewAll')} <ChevronRight size={15} /></Link>
          </div>
          <div className="book-grid">
            {related.map((item) => <BookCard key={item.id} book={item} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
