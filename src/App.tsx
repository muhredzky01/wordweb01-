import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { Toasts } from './components/Toasts'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { BookDetail } from './pages/BookDetail'
import { Reader } from './pages/Reader'
import { Favorites } from './pages/Favorites'
import { Shelf } from './pages/Shelf'
import { About } from './pages/About'
import { NotFound } from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="katalog" element={<Catalog />} />
            <Route path="kitab/:slug" element={<BookDetail />} />
            <Route path="favorit" element={<Favorites />} />
            <Route path="rak" element={<Shelf />} />
            <Route path="tentang" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="baca/:slug" element={<Reader />} />
        </Routes>
        <Toasts />
      </BrowserRouter>
    </AppProvider>
  )
}
