import { useEffect, useRef, useState } from 'react'
import { BookOpen, Eye, EyeOff, Mail, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Logo } from './Logo'

export function AuthModal() {
  const { authOpen, closeAuth, login, t, toast } = useApp()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const firstRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (authOpen) {
      const timer = window.setTimeout(() => firstRef.current?.focus(), 60)
      return () => window.clearTimeout(timer)
    }
  }, [authOpen, mode])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAuth()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeAuth])

  if (!authOpen) return null

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6 || (mode === 'register' && name.trim().length < 2)) {
      setError(t('auth.invalid'))
      return
    }
    login({
      name: mode === 'register' ? name.trim() : email.split('@')[0].replace(/[._-]/g, ' '),
      email,
      joined: new Date().toISOString(),
    })
  }

  const google = () => {
    login({ name: 'Ahmad Fauzi', email: 'ahmad.fauzi@example.com', joined: new Date().toISOString() })
    toast('Masuk dengan Google (demo)')
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={t('auth.title')}>
      <button type="button" className="overlay-scrim" onClick={closeAuth} aria-label={t('common.close')} />
      <div className="auth-modal">
        <button type="button" className="modal-close" onClick={closeAuth} aria-label={t('common.close')}>
          <X size={19} />
        </button>
        <div className="auth-brand"><Logo /></div>
        <span className="auth-icon"><BookOpen size={22} /></span>
        <h2>{mode === 'login' ? t('auth.title') : t('auth.registerTitle')}</h2>
        <p className="auth-sub">{mode === 'login' ? t('auth.subtitle') : t('auth.registerSubtitle')}</p>

        <form onSubmit={submit} noValidate>
          {mode === 'register' && (
            <label className="field">
              <span>{t('auth.name')}</span>
              <input ref={firstRef} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Ahmad Fauzi" />
            </label>
          )}
          <label className="field">
            <span>{t('auth.email')}</span>
            <div className="input-with-icon">
              <Mail size={16} />
              <input
                ref={mode === 'login' ? firstRef : undefined}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="nama@email.com"
              />
            </div>
          </label>
          <label className="field">
            <span>{t('auth.password')}</span>
            <div className="input-with-icon">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
              />
              <button type="button" className="eye-btn" onClick={() => setShow((v) => !v)} aria-label="Tampilkan sandi">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </button>
        </form>

        <div className="auth-divider"><span>{t('auth.or')}</span></div>
        <button type="button" className="btn btn-google btn-block" onClick={google}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
            <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.7-4.9H1.3v3.1A12 12 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.3 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.3a12 12 0 0 0 0 10.7l4-3Z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.7l4 3.1c1-2.8 3.6-5 6.7-5Z" />
          </svg>
          {t('auth.google')}
        </button>
        <button type="button" className="auth-switch" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
          {mode === 'login' ? t('auth.toRegister') : t('auth.toLogin')}
        </button>
        <p className="auth-demo">{t('auth.demo')}</p>
      </div>
    </div>
  )
}
