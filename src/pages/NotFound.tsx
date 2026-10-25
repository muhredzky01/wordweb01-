import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { SearchGlyph } from '../components/Icons'
import { useApp } from '../context/AppContext'

export function NotFound() {
  const { t } = useApp()
  return (
    <div className="page notfound-page">
      <div className="notfound-inner">
        <span className="notfound-num">404</span>
        <span className="notfound-icon"><Compass size={30} /></span>
        <h1>{t('notfound.title')}</h1>
        <p>{t('notfound.text')}</p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary"><ArrowLeft size={16} /> {t('notfound.home')}</Link>
          <Link to="/katalog" className="btn btn-outline"><SearchGlyph /> {t('notfound.catalog')}</Link>
        </div>
      </div>
    </div>
  )
}
