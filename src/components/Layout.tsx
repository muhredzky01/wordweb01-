import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { SearchOverlay } from './SearchOverlay'
import { AuthModal } from './AuthModal'
import { ShelfDrawer } from './ShelfDrawer'

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  return (
    <>
      <a href="#main" className="skip-link">Lewati ke konten</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <SearchOverlay />
      <AuthModal />
      <ShelfDrawer />
    </>
  )
}
