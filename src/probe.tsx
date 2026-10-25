import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink } from 'react-router-dom'
import { Heart, Search } from 'lucide-react'
import './styles/global.css'
import { AppProvider } from './context/AppContext'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Logo } from './components/Logo'
import { BookCard } from './components/BookCard'
import { BookCover } from './components/BookCover'
import { books } from './data'

const mode = new URLSearchParams(location.search).get('mode') ?? 'hello'

function Probe() {
  if (mode === 'hello') return <div className="container section"><h1>Hello Maktabah</h1><p>Ini halaman uji.</p></div>
  if (mode === 'provider') return <AppProvider><div className="container section">Provider okay</div></AppProvider>
  if (mode === 'logo') return <AppProvider><BrowserRouter><div className="site-header"><div className="header-inner"><Logo /></div></div></BrowserRouter></AppProvider>
  if (mode === 'home_nh') return <AppProvider><BrowserRouter><style>{'.hero{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home_nv') return <AppProvider><BrowserRouter><style>{'.hero-visual{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home_nrail') return <AppProvider><BrowserRouter><style>{'.book-rail{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home_ncat') return <AppProvider><BrowserRouter><style>{'.category-grid{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home_npromo') return <AppProvider><BrowserRouter><style>{'.promo-banner{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home_ncoll') return <AppProvider><BrowserRouter><style>{'.collection-grid{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home_nsplit') return <AppProvider><BrowserRouter><style>{'.split-highlight{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home_ncomm') return <AppProvider><BrowserRouter><style>{'.community-banner{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home_nnews') return <AppProvider><BrowserRouter><style>{'.newsletter{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home_nbooks') return <AppProvider><BrowserRouter><style>{'.book-grid{display:none!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'home') return <AppProvider><BrowserRouter><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'homefix') return <AppProvider><BrowserRouter><style>{'.hero-search,.header-inner,.hero-inner,.hero-copy,.newsletter{min-width:0!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'homeall') return <AppProvider><BrowserRouter><style>{'*{min-width:0!important}'}</style><Header /><Home /></BrowserRouter></AppProvider>
  if (mode === 'navlink') return <AppProvider><BrowserRouter><nav className="header-nav"><NavLink to="/" end>Beranda</NavLink><NavLink to="/katalog">Katalog</NavLink><NavLink to="/rak">Rak</NavLink><NavLink to="/tentang">Tentang</NavLink><button className="nav-search-link"><Search size={14} /> Cari</button><span className="nav-note">599 PDF</span></nav></BrowserRouter></AppProvider>
  if (mode === 'hl11') return <div className="header-inner"><style>{'.header-search{flex:0 1 440px!important}'}</style><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div></div>
  if (mode === 'hl12') return <div className="header-inner"><style>{'.header-search{flex:1!important;min-width:0!important}'}</style><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div></div>
  if (mode === 'hl13') return <div className="header-inner"><style>{'.header-search{flex:1!important;width:0!important}'}</style><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div></div>
  if (mode === 'hl14') return <div className="header-inner"><style>{'.header-search svg{display:none!important}'}</style><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div></div>
  if (mode === 'hl6') return <div className="header-inner"><Logo /><div className="header-search"><input placeholder="Cari" /></div></div>
  if (mode === 'hl7') return <div className="header-inner"><style>{'.header-search{flex:none!important;width:300px!important;max-width:300px!important}'}</style><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div></div>
  if (mode === 'hl8') return <form className="header-inner"><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div></form>
  if (mode === 'hl9') return <div className="header-inner"><Logo /><div><input placeholder="Cari" /></div></div>
  if (mode === 'hl10') return <div className="header-inner"><Logo /><div className="header-search">Cari kitab</div></div>
  if (mode === 'hl1') return <AppProvider><BrowserRouter><header className="site-header"><div className="header-inner"><Logo /></div></header></BrowserRouter></AppProvider>
  if (mode === 'hl2') return <AppProvider><BrowserRouter><header className="site-header"><div className="header-inner"><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div></div></header></BrowserRouter></AppProvider>
  if (mode === 'hl3') return <AppProvider><BrowserRouter><header className="site-header"><div className="header-inner"><Logo /><div className="header-actions"><button className="icon-btn"><Heart size={19} /></button></div></div></header></BrowserRouter></AppProvider>
  if (mode === 'hl4') return <AppProvider><BrowserRouter><div className="header-inner"><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div><div className="header-actions"><button className="icon-btn"><Heart size={19} /></button></div></div></BrowserRouter></AppProvider>
  if (mode === 'hl5') return <AppProvider><BrowserRouter><header className="site-header"><div className="header-inner"><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div><div className="header-actions"><button className="icon-btn"><Heart size={19} /></button></div></div><nav className="header-nav"><Link to="/">Beranda</Link></nav></header></BrowserRouter></AppProvider>
  if (mode === 'headerlite') return <AppProvider><BrowserRouter><header className="site-header"><div className="header-inner"><Logo /><div className="header-search"><Search size={18} /><input placeholder="Cari" /></div><div className="header-actions"><button className="icon-btn"><Heart size={19} /></button><button className="btn btn-primary btn-sm">Masuk</button></div></div><nav className="header-nav"><Link to="/">Beranda</Link><Link to="/katalog">Katalog</Link></nav></header></BrowserRouter></AppProvider>
  if (mode === 'header') return <AppProvider><BrowserRouter><Header /></BrowserRouter></AppProvider>
  if (mode === 'headerx') return <AppProvider><BrowserRouter><style>{'.site-header{position:static!important;backdrop-filter:none!important;background:var(--surface)!important}'}</style><Header /></BrowserRouter></AppProvider>
  if (mode === 'searchbar') return <div className="container section"><form className="header-search"><Search size={18} /><input placeholder="Cari" /><kbd>/</kbd></form></div>
  if (mode === 'actions') return <div className="container section"><div className="header-actions"><button className="icon-btn"><Heart size={19} /></button><span className="count-bubble">2</span><button className="lang-switch">ID</button><button className="btn btn-primary btn-sm">Masuk</button></div></div>
  if (mode === 'nav') return <nav className="header-nav"><a href="#">Beranda</a><a href="#">Katalog</a><span className="nav-note">599 PDF</span></nav>
  if (mode === 'cover') return <div className="container section"><div style={{ width: 240 }}><BookCover book={books[0]} /></div></div>
  if (mode === 'cards') return <div className="container section"><div className="book-grid">{books.slice(0, 8).map((b) => <BookCard key={b.id} book={b} />)}</div></div>
  return <div>unknown</div>
}

createRoot(document.getElementById('root')!).render(<Probe />)

// extra probes appended via separate component below
