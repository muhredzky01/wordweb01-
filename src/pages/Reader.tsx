import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, BookOpen, Check, ChevronLeft, ChevronRight, Download, ExternalLink,
  Expand, FileText, Loader2, NotebookPen, Save,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { bookBySlug } from '../data'
import { DRIVE_DOWNLOAD, DRIVE_PREVIEW, DRIVE_VIEW, cx } from '../lib/utils'

export function Reader() {
  const { slug = '' } = useParams()
  const book = bookBySlug(slug)
  const [params, setParams] = useSearchParams()
  const { t, notes, setNote, progress, setProgress, toast, user } = useApp()
  const [loading, setLoading] = useState(true)
  const [noteDraft, setNoteDraft] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)
  const rawVolume = Number(params.get('v') ?? 0)
  const safeVolume = Number.isFinite(rawVolume) ? rawVolume : 0
  const volumeIndex = Math.min(Math.max(0, safeVolume), Math.max(0, (book?.files.length ?? 1) - 1))

  useEffect(() => {
    if (book) {
      document.title = `Baca ${book.title} — Maktabah Kitab`
      setNoteDraft(notes[book.id] ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id])

  useEffect(() => {
    setLoading(true)
  }, [book?.id, volumeIndex])

  const value = book ? progress[book.id] ?? 0 : 0

  const noteTimer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(noteTimer.current), [])

  if (!book) {
    return (
      <div className="page container empty-state standalone">
        <h1>{t('reader.notFound')}</h1>
        <Link to="/katalog" className="btn btn-primary">{t('reader.backCatalog')}</Link>
      </div>
    )
  }

  const volume = book.files[volumeIndex]
  const setVolume = (index: number) => {
    const next = new URLSearchParams(params)
    next.set('v', String(index))
    setParams(next)
    setLoading(true)
  }

  const saveNote = (text: string) => {
    setNoteDraft(text)
    window.clearTimeout(noteTimer.current)
    noteTimer.current = window.setTimeout(() => {
      setNote(book.id, text)
      setSavedFlash(true)
      window.setTimeout(() => setSavedFlash(false), 1600)
    }, 600)
  }

  const fullscreen = () => {
    const el = document.getElementById('reader-frame-wrap')
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen?.()
  }

  return (
    <div className="reader-page">
      <h1 className="sr-only">Baca {book.title}</h1>
      <div className="reader-topbar">
        <div className="reader-topbar-inner">
          <Link to={`/kitab/${book.slug}`} className="back-link light"><ArrowLeft size={15} /> {t('reader.back')}</Link>
          <div className="reader-title">
            <span className="reader-mini-cover"><img src={book.cover ?? ''} alt="" /></span>
            <div>
              <strong>{book.title}</strong>
              <small>{book.author} · {t('common.volume')} {volumeIndex + 1}/{book.volumes}</small>
            </div>
          </div>
          <div className="reader-actions">
            <a href={DRIVE_VIEW(volume.id)} target="_blank" rel="noreferrer" className="btn btn-ghost-light btn-sm"><ExternalLink size={15} /> Drive</a>
            <a href={DRIVE_DOWNLOAD(volume.id)} target="_blank" rel="noreferrer" className="btn btn-light btn-sm"><Download size={15} /> PDF</a>
            <button type="button" className="icon-btn light" onClick={fullscreen} aria-label={t('reader.fullscreen')}><Expand size={17} /></button>
          </div>
        </div>
      </div>

      <div className="reader-body">
        <aside className="reader-sidebar">
          <div className="reader-progress-card">
            <div className="reader-progress-head">
              <span><BookOpen size={15} /> {t('reader.progress')}</span>
              <strong>{value}%</strong>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={value}
              onChange={(e) => setProgress(book.id, Number(e.target.value))}
              aria-label={t('reader.progress')}
            />
            <button type="button" className="btn btn-soft btn-sm btn-block" onClick={() => { setProgress(book.id, 100); toast(t('reader.markedDone')) }}>
              <Check size={14} /> {t('reader.markDone')}
            </button>
          </div>

          <div className="reader-volume-list">
            <p className="reader-side-label"><FileText size={14} /> {t('reader.volume')}</p>
            {book.files.map((file, index) => (
              <button
                key={file.id}
                type="button"
                className={cx('reader-volume', index === volumeIndex && 'is-active')}
                onClick={() => setVolume(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <em>{file.name.replace(/\.pdf$/i, '')}</em>
                {index === volumeIndex && <i className="playing" />}
              </button>
            ))}
          </div>

          <div className="reader-note-card">
            <p className="reader-side-label"><NotebookPen size={14} /> {t('reader.note')}</p>
            <textarea
              value={noteDraft}
              onChange={(e) => saveNote(e.target.value)}
              rows={6}
              placeholder={t('reader.notePlaceholder')}
            />
            <span className={cx('note-status', savedFlash && 'is-visible')}><Save size={12} /> {t('reader.saved')}</span>
          </div>
        </aside>

        <div className="reader-main">
          <div className="reader-toolbar">
            <div className="reader-nav">
              <button type="button" className="btn btn-ghost btn-sm" disabled={volumeIndex === 0} onClick={() => setVolume(volumeIndex - 1)}>
                <ChevronLeft size={15} /> {t('reader.prev')}
              </button>
              <span>{t('reader.volumeOf').replace('{n}', String(volumeIndex + 1)).replace('{total}', String(book.volumes))}</span>
              <button type="button" className="btn btn-ghost btn-sm" disabled={volumeIndex === book.files.length - 1} onClick={() => setVolume(volumeIndex + 1)}>
                {t('reader.next')} <ChevronRight size={15} />
              </button>
            </div>
            {!user && <span className="reader-note-login">{t('reader.loginNote')}</span>}
          </div>

          <div className="reader-frame-wrap" id="reader-frame-wrap">
            {loading && (
              <div className="reader-loading">
                <Loader2 size={28} className="spin" />
                <p>{t('reader.loading')}</p>
              </div>
            )}
            <iframe
              key={volume.id}
              title={`${book.title} — ${volume.name}`}
              src={DRIVE_PREVIEW(volume.id)}
              onLoad={() => setLoading(false)}
              allow="autoplay"
            />
            <div className="reader-frame-fallback">
              <span>{t('reader.previewIssue')}</span>
              <a href={DRIVE_VIEW(volume.id)} target="_blank" rel="noreferrer">{t('reader.openDrive')} <ExternalLink size={12} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
