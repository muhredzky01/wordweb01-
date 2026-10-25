import { Link } from 'react-router-dom'
import { Instagram, Mail, Send, Youtube } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories } from '../data'
import { Logo } from './Logo'
import { Newsletter } from './Newsletter'

export function Footer() {
  const { t } = useApp()
  return (
    <footer className="site-footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <Logo />
          <p>{t('footer.tagline')}</p>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17} /></a>
            <a href="mailto:salam@maktabah.id" aria-label="Email"><Mail size={17} /></a>
            <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram"><Send size={17} /></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>{t('footer.explore')}</h4>
          <Link to="/katalog">{t('nav.catalog')}</Link>
          <Link to="/katalog?tab=featured">{t('catalog.featured')}</Link>
          <Link to="/favorit">{t('nav.favorites')}</Link>
          <Link to="/rak">{t('nav.shelf')}</Link>
        </div>
        <div className="footer-col">
          <h4>{t('footer.popular')}</h4>
          {categories.slice(0, 5).map((c) => (
            <Link key={c.id} to={`/katalog?category=${c.id}`}>{c.name}</Link>
          ))}
        </div>
        <div className="footer-col">
          <h4>{t('footer.about')}</h4>
          <Link to="/tentang">{t('nav.about')}</Link>
          <Link to="/tentang#faq">{t('footer.help')}</Link>
          <Link to="/tentang#kontak">{t('footer.contact')}</Link>
          <a href="https://drive.google.com/drive/folders/1Y4nlYY5Hpy_EyzTLlvHpntygblCIwi_g" target="_blank" rel="noreferrer">{t('footer.source')}</a>
        </div>
        <div className="footer-news">
          <Newsletter compact />
        </div>
      </div>
      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} Maktabah Kitab. {t('footer.rights')}</p>
        <div>
          <Link to="/tentang#privasi">{t('footer.privacy')}</Link>
          <Link to="/tentang#ketentuan">{t('footer.terms')}</Link>
        </div>
      </div>
    </footer>
  )
}
