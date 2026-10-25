# Maktabah Kitab — Perpustakaan Kitab Digital

A Bookoe-inspired digital library front-end for the **Maktabah Kitab** collection. The catalog is generated from the two public Google Drive folders supplied with the brief:

- [Maktabah Kitab](https://drive.google.com/drive/folders/1Y4nlYY5Hpy_EyzTLlvHpntygblCIwi_g)
- [Kumpulan buku, kitab & film](https://drive.google.com/drive/folders/1FjqTXSvZEHCd15TUhl0qk_zo0hjh_Xq1)

The crawler in `scripts/` enumerated the public folders and produced **330 unique works / 599 PDF volumes** across 10 fields of study, with real first-page cover thumbnails from Google Drive.

## Stack

- React 18 + TypeScript + Vite
- React Router 6
- Lucide icons
- Hand-written CSS design system (no UI framework), light & dark themes
- `localStorage` for favorites, reading list, progress, notes, reviews, and demo auth

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build
npm run preview   # preview the production build
```

## Features

- **Storefront home**: hero with live search, category grid, editor's picks rail, promo banner, tabbed collection, thematic shelves, leaderboard, newsletter.
- **Catalog**: keyword search, category checkboxes, language, era, author, editor's picks, quick in-results search, sorting, grid/list views, pagination, active-filter chips, mobile filter drawer, URL-synced state.
- **Book detail**: real PDF cover, metadata, description, tags, volume list with per-volume read/download links, ratings & reader reviews (persisted), sharing, related books.
- **Reading room**: embedded Google Drive PDF viewer, volume switcher, reading progress, per-book notes with auto-save, full-screen mode, Drive/download fallbacks.
- **Personal library**: favorites, reading list with progress, continue-reading, completed badges, notes preview, demo sign-in/register with Google demo option.
- **Extras**: instant search overlay (keyboard `/` shortcut), command-style mega menu, cart-style reading-list drawer, toasts, dark mode, ID/EN language switch, 404 page, about/FAQ/contact page, fully responsive layout.

## Catalog generation

The scripts are kept for provenance:

```bash
python3 scripts/crawl3.py          # crawl the public folders (cached HTML in /tmp)
python3 scripts/flatten.py         # flatten PDFs, group volumes
python3 scripts/build_catalog.py   # build raw catalog + category mapping
python3 scripts/finalize_catalog.py # curate featured works -> src/data/catalog.json
python3 scripts/get_covers.py      # download thumbnails -> public/covers
```

`src/data/catalog.json` is committed so the site runs without network access to Drive (only the PDF preview/download actions need Drive).

## Notes

- The PDFs are not re-hosted; every read/download action links to the original Google Drive file.
- Copyright of each work remains with its author and publisher.

## Deployment

The app is a client-side SPA. A `vercel.json` rewrite and `public/_redirects` file are included so deep links such as `/kitab/...` are served through `index.html` on Vercel and Netlify. For other hosts, configure a SPA fallback to `index.html`.
