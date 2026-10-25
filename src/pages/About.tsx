import { useState } from 'react'
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
  ['Apakah semua kitab benar-benar gratis?', 'Ya. Seluruh koleksi dapat dibaca dan diunduh tanpa biaya. Kami tidak memasang iklan atau paywall.'],
  ['Apakah saya perlu membuat akun?', 'Tidak untuk membaca. Akun hanya membantu menyimpan rak baca, favorit, progres, dan catatan secara lokal di perangkat Anda.'],
  ['Dari mana naskah PDF ini berasal?', 'Naskah dihimpun dari folder publik Maktabah Kitab di Google Drive. Tautan sumber tersedia di footer dan pada setiap halaman kitab.'],
  ['Bagaimana jika PDF gagal dimuat?', 'Gunakan tombol “Buka di Google Drive” pada ruang baca. Anda juga bisa mengunduh berkas PDF untuk dibaca luring.'],
  ['Apakah saya boleh membagikan ulang berkasnya?', 'Silakan gunakan untuk belajar dan mengajar. Hak cipta tiap karya tetap milik penulis dan penerbitnya; mohon cantumkan sumber dengan pantas.'],
]

export function About() {
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
            <p className="eyebrow light"><Sparkles size={15} /> Sejak 2025 · Nusantara</p>
            <h1>{t('about.title')}</h1>
            <p>{t('about.lead')}</p>
            <div className="about-hero-actions">
              <Link to="/katalog" className="btn btn-light btn-lg">Jelajahi koleksi <ArrowRight size={17} /></Link>
              <a href="https://drive.google.com/drive/folders/1Y4nlYY5Hpy_EyzTLlvHpntygblCIwi_g" target="_blank" rel="noreferrer" className="btn btn-ghost-light btn-lg">Folder sumber <ExternalLink size={16} /></a>
            </div>
          </div>
          <div className="about-arabic" aria-hidden="true">
            <span>مكتبة</span>
            <small>“Tempat berkumpulnya kitab-kitab”</small>
          </div>
        </div>
      </section>

      <section className="container about-stats">
        <div><strong>{books.length}</strong><span>{t('about.statBooks')}</span></div>
        <div><strong>{totalVolumes}</strong><span>{t('about.statVolumes')}</span></div>
        <div><strong>{categories.length}</strong><span>{t('about.statCategories')}</span></div>
        <div><strong>100%</strong><span>gratis</span></div>
      </section>

      <section className="container section about-story">
        <div className="about-story-copy">
          <p className="eyebrow"><LibraryBig size={15} /> Cerita kami</p>
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
            { icon: BookOpen, title: 'Terbuka', text: 'Tanpa pendaftaran untuk membaca, tanpa biaya untuk mengunduh.' },
            { icon: ShieldCheck, title: 'Terawat', text: 'Metadata dirapikan dan naskah dikelompokkan per bidang ilmu.' },
            { icon: HeartHandshake, title: 'Untuk siapa saja', text: 'Santri, mahasiswa, guru, dan siapa pun yang ingin belajar.' },
            { icon: MapPin, title: 'Akar Nusantara', text: 'Banyak karya ulama Nusantara dan terjemahan berbahasa Indonesia.' },
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
            <p>Belum menemukan jawaban? Kirim pesan lewat formulir di bawah.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <div className={cx('faq-item', openFaq === index && 'is-open')} key={question}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                  {question}<ChevronDown size={17} />
                </button>
                {openFaq === index && <p>{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section" id="kontak">
        <div className="contact-wrap">
          <div className="contact-copy">
            <p className="eyebrow"><Mail size={15} /> Kontak</p>
            <h2>{t('about.contact')}</h2>
            <p>{t('about.contactText')}</p>
            <ul>
              <li><Mail size={15} /> salam@maktabah.id</li>
              <li><MapPin size={15} /> Yogyakarta, Indonesia</li>
              <li><Check size={15} /> Balasan dalam 2–3 hari kerja</li>
            </ul>
          </div>
          {sent ? (
            <div className="contact-success">
              <span><Check size={24} /></span>
              <h3>{t('about.sent')}</h3>
              <button type="button" className="btn btn-outline" onClick={() => setSent(false)}>Kirim pesan lain</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="review-form-row">
                <label className="field"><span>Nama</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" /></label>
                <label className="field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" /></label>
              </div>
              <label className="field"><span>{t('about.message')}</span><textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tulis pesan Anda…" /></label>
              <button type="submit" className="btn btn-primary">{t('about.send')} <ArrowRight size={15} /></button>
            </form>
          )}
        </div>
      </section>

      <section className="container section" id="privasi">
        <div className="legal-grid">
          <article><h3>{t('footer.privacy')}</h3><p>Kami tidak mengumpulkan data pribadi di server. Favorit, rak baca, catatan, dan profil demo disimpan di localStorage peramban Anda dan dapat dihapus kapan saja.</p></article>
          <article id="ketentuan"><h3>{t('footer.terms')}</h3><p>Naskah disediakan untuk belajar dan mengajar. Anda tidak boleh mengklaim kepemilikan atas karya orang lain atau menghapus atribusi penulis dan penerbit.</p></article>
        </div>
      </section>

      <section className="container section"><Newsletter /></section>
    </div>
  )
}
