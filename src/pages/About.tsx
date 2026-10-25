import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Check, ChevronDown, ExternalLink, HeartHandshake, LibraryBig,
  Mail, MapPin, ShieldCheck, Sparkles,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { books, categories, totalVolumes } from '../data'
import { Newsletter } from '../components/Newsletter'
import { cx } from '../lib/utils'

const faqs = [
  ['about.faq1Q', 'about.faq1A'],
  ['about.faq2Q', 'about.faq2A'],
  ['about.faq3Q', 'about.faq3A'],
  ['about.faq4Q', 'about.faq4A'],
  ['about.faq5Q', 'about.faq5A'],
]

export function About() {
  useEffect(() => { document.title = 'Tentang — Maktabah Kitab' }, [])
  const { t, toast } = useApp()
  const [openFaq, setOpenFaq] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.trim().length < 10) {
      toast('Lengkapi nama, email, dan pesan minimal 10 karakter.', 'error')
      return
    }
    setSent(true)
    setName(''); setEmail(''); setMessage('')
    toast(t('about.sent'))
  }

  return (
    <div className="page about-page">
      <section className="about-hero">
        <div className="container about-hero-inner">
          <div>
            <p className="eyebrow light"><Sparkles size={15} /> {t('about.eyebrow')}</p>
            <h1>{t('about.title')}</h1>
            <p>{t('about.lead')}</p>
            <div className="about-hero-actions">
              <Link to="/katalog" className="btn btn-light btn-lg">{t('about.explore')} <ArrowRight size={17} /></Link>
              <a href="https://drive.google.com/drive/folders/1Y4nlYY5Hpy_EyzTLlvHpntygblCIwi_g" target="_blank" rel="noreferrer" className="btn btn-ghost-light btn-lg">{t('about.sourceBtn')} <ExternalLink size={16} /></a>
            </div>
          </div>
          <div className="about-arabic" aria-hidden="true">
            <span>مكتبة</span>
            <small>{t('about.arabicCaption')}</small>
          </div>
        </div>
      </section>

      <section className="container about-stats">
        <div><strong>{books.length}</strong><span>{t('about.statBooks')}</span></div>
        <div><strong>{totalVolumes}</strong><span>{t('about.statVolumes')}</span></div>
        <div><strong>{categories.length}</strong><span>{t('about.statCategories')}</span></div>
        <div><strong>100%</strong><span>{t('about.free')}</span></div>
      </section>

      <section className="container section about-story">
        <div className="about-story-copy">
          <p className="eyebrow"><LibraryBig size={15} /> {t('about.storyEyebrow')}</p>
          <h2>{t('about.storyTitle')}</h2>
          <p>{t('about.story1')}</p>
          <p>{t('about.story2')}</p>
          <div className="about-source-box">
            <h3><ShieldCheck size={17} /> {t('about.source')}</h3>
            <p>{t('about.sourceText')}</p>
            <div className="source-links">
              <a href="https://drive.google.com/drive/folders/1Y4nlYY5Hpy_EyzTLlvHpntygblCIwi_g" target="_blank" rel="noreferrer">Maktabah Kitab · Google Drive <ExternalLink size={13} /></a>
              <a href="https://drive.google.com/drive/folders/1FjqTXSvZEHCd15TUhl0qk_zo0hjh_Xq1" target="_blank" rel="noreferrer">Kumpulan buku & kitab <ExternalLink size={13} /></a>
            </div>
          </div>
        </div>
        <div className="about-values">
          {[
            { icon: BookOpen, title: t('about.value1Title'), text: t('about.value1Text') },
            { icon: ShieldCheck, title: t('about.value2Title'), text: t('about.value2Text') },
            { icon: HeartHandshake, title: t('about.value3Title'), text: t('about.value3Text') },
            { icon: MapPin, title: t('about.value4Title'), text: t('about.value4Text') },
          ].map((item) => (
            <div className="value-card" key={item.title}>
              <span><item.icon size={19} /></span>
              <div><strong>{item.title}</strong><p>{item.text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-tinted" id="faq">
        <div className="container faq-wrap">
          <div className="faq-intro">
            <p className="eyebrow"><Sparkles size={15} /> FAQ</p>
            <h2>{t('about.faq')}</h2>
            <p>{t('about.faqMore')}</p>
          </div>
          <div className="faq-list">
            {faqs.map(([qKey, aKey], index) => (
              <div className={cx('faq-item', openFaq === index && 'is-open')} key={qKey}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                  {t(qKey)}<ChevronDown size={17} />
                </button>
                {openFaq === index && <p>{t(aKey)}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section" id="kontak">
        <div className="contact-wrap">
          <div className="contact-copy">
            <p className="eyebrow"><Mail size={15} /> {t('about.contactEyebrow')}</p>
            <h2>{t('about.contact')}</h2>
            <p>{t('about.contactText')}</p>
            <ul>
              <li><Mail size={15} /> salam@maktabah.id</li>
              <li><MapPin size={15} /> Yogyakarta, Indonesia</li>
              <li><Check size={15} /> {t('about.contactResponse')}</li>
            </ul>
          </div>
          {sent ? (
            <div className="contact-success">
              <span><Check size={24} /></span>
              <h3>{t('about.sent')}</h3>
              <button type="button" className="btn btn-outline" onClick={() => setSent(false)}>{t('about.contactAnother')}</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="review-form-row">
                <label className="field"><span>{t('about.contactName')}</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" /></label>
                <label className="field"><span>{t('about.contactEmail')}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" /></label>
              </div>
              <label className="field"><span>{t('about.message')}</span><textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('about.contactPlaceholder')} /></label>
              <button type="submit" className="btn btn-primary">{t('about.send')} <ArrowRight size={15} /></button>
            </form>
          )}
        </div>
      </section>

      <section className="container section" id="privasi">
        <div className="legal-grid">
          <article><h3>{t('footer.privacy')}</h3><p>{t('about.privacyText')}</p></article>
          <article id="ketentuan"><h3>{t('footer.terms')}</h3><p>{t('about.termsText')}</p></article>
        </div>
      </section>

      <section className="container section"><Newsletter /></section>
    </div>
  )
}
