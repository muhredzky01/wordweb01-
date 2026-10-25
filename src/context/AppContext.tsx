import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { usePersistentState } from '../lib/storage'
import { translate, type Lang } from '../lib/i18n'
import type { Review, User } from '../types'

type Theme = 'light' | 'dark'

type Toast = { id: number; message: string; tone: 'success' | 'info' | 'error' }

interface AppValue {
  theme: Theme
  toggleTheme: () => void
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  favorites: string[]
  shelf: string[]
  progress: Record<string, number>
  notes: Record<string, string>
  reviews: Review[]
  user: User | null
  toggleFavorite: (id: string) => void
  clearFavorites: () => void
  clearShelf: () => void
  toggleShelf: (id: string) => void
  setProgress: (id: string, value: number) => void
  setNote: (id: string, text: string) => void
  addReview: (review: Review) => void
  login: (user: User) => void
  logout: () => void
  toasts: Toast[]
  toast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
  authOpen: boolean
  openAuth: () => void
  closeAuth: () => void
  searchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  shelfOpen: boolean
  openShelf: () => void
  closeShelf: () => void
}

const AppContext = createContext<AppValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = usePersistentState<Theme>('mk-theme', 'light')
  const [lang, setLang] = usePersistentState<Lang>('mk-lang', 'id')
  const [favorites, setFavorites] = usePersistentState<string[]>('mk-favorites', [])
  const [shelf, setShelf] = usePersistentState<string[]>('mk-shelf', [])
  const [progress, setProgressMap] = usePersistentState<Record<string, number>>('mk-progress', {})
  const [notes, setNotesMap] = usePersistentState<Record<string, string>>('mk-notes', {})
  const [reviews, setReviews] = usePersistentState<Review[]>('mk-reviews', [])
  const [user, setUser] = usePersistentState<User | null>('mk-user', null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [authOpen, setAuthOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shelfOpen, setShelfOpen] = useState(false)
  const counter = useRef(0)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    document.body.style.overflow = authOpen || searchOpen || shelfOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [authOpen, searchOpen, shelfOpen])

  const t = useCallback((key: string) => translate(lang, key), [lang])

  const toast = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, message, tone }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 3600)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const exists = prev.includes(id)
        toast(exists ? translate(lang, 'toast.favRemoved') : translate(lang, 'toast.favAdded'), exists ? 'info' : 'success')
        return exists ? prev.filter((x) => x !== id) : [id, ...prev]
      })
    },
    [lang, setFavorites, toast],
  )

  const toggleShelf = useCallback(
    (id: string) => {
      setShelf((prev) => {
        const exists = prev.includes(id)
        toast(exists ? translate(lang, 'detail.removed') : translate(lang, 'detail.added'), exists ? 'info' : 'success')
        return exists ? prev.filter((x) => x !== id) : [id, ...prev]
      })
    },
    [lang, setShelf, toast],
  )

  const setProgress = useCallback(
    (id: string, value: number) => {
      setProgressMap((prev) => ({ ...prev, [id]: Math.min(100, Math.max(0, value)) }))
    },
    [setProgressMap],
  )

  const setNote = useCallback(
    (id: string, text: string) => {
      setNotesMap((prev) => ({ ...prev, [id]: text }))
    },
    [setNotesMap],
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
    toast(translate(lang, 'favorites.clear'), 'info')
  }, [lang, setFavorites, toast])

  const clearShelf = useCallback(() => {
    setShelf([])
    toast(translate(lang, 'shelf.title'), 'info')
  }, [lang, setShelf, toast])

  const addReview = useCallback((review: Review) => setReviews((prev) => [review, ...prev]), [setReviews])

  const login = useCallback(
    (next: User) => {
      setUser(next)
      setAuthOpen(false)
      toast(`${translate(lang, 'auth.welcome')}, ${next.name.split(' ')[0]}!`)
    },
    [lang, setUser, toast],
  )

  const logout = useCallback(() => {
    setUser(null)
    toast(translate(lang, 'common.signOut'), 'info')
  }, [lang, setUser, toast])

  const value = useMemo<AppValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
      lang,
      setLang,
      t,
      favorites,
      shelf,
      progress,
      notes,
      reviews,
      user,
      toggleFavorite,
      clearFavorites,
      clearShelf,
      toggleShelf,
      setProgress,
      setNote,
      addReview,
      login,
      logout,
      toasts,
      toast,
      dismissToast,
      authOpen,
      openAuth: () => setAuthOpen(true),
      closeAuth: () => setAuthOpen(false),
      searchOpen,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      shelfOpen,
      openShelf: () => setShelfOpen(true),
      closeShelf: () => setShelfOpen(false),
    }),
    [theme, setTheme, lang, setLang, t, favorites, shelf, progress, notes, reviews, user, toggleFavorite, clearFavorites, clearShelf, toggleShelf, setProgress, setNote, addReview, login, logout, toasts, toast, dismissToast, authOpen, searchOpen, shelfOpen],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
