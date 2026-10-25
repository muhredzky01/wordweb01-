import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const { t } = useApp()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(true)
      return
    }
    setError(false)
    setDone(true)
    setEmail('')
  }

  return (
    <div className={compact ? 'newsletter newsletter-compact' : 'newsletter'}>
      <div>
        <h3>{t('home.newsletterTitle')}</h3>
        {!compact && <p>{t('home.newsletterText')}</p>}
      </div>
      {done ? (
        <p className="newsletter-done"><Check size={17} /> {t('home.newsletterDone')}</p>
      ) : (
        <form onSubmit={submit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('home.newsletterPlaceholder')}
            aria-label={t('home.newsletterPlaceholder')}
            className={error ? 'has-error' : ''}
          />
          <button type="submit" className="btn btn-dark">{t('home.newsletterBtn')} <ArrowRight size={15} /></button>
        </form>
      )}
      {error && <p className="form-error">{t('newsletter.invalid')}</p>}
    </div>
  )
}
