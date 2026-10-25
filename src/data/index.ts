import catalog from './catalog.json'
import type { Book, Category, CategoryId } from '../types'

const raw = catalog as unknown as {
  categories: Record<CategoryId, Omit<Category, 'id'>>
  books: Book[]
  collections: Record<string, number>
}

export const categories: Category[] = (Object.keys(raw.categories) as CategoryId[]).map((id) => ({
  id,
  ...raw.categories[id],
}))

export const books: Book[] = raw.books

export const collectionCounts = raw.collections

export const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<CategoryId, Category>

export const featuredBooks = books.filter((b) => b.featured)

export const categoryCounts = categories.reduce<Record<string, number>>((acc, c) => {
  acc[c.id] = books.filter((b) => b.category === c.id).length
  return acc
}, {})

export const authors = Array.from(new Set(books.map((b) => b.author))).sort((a, b) => a.localeCompare(b))

export const languages = Array.from(new Set(books.map((b) => b.language)))

export const totalVolumes = books.reduce((sum, b) => sum + b.volumes, 0)

export const topReaders = [...books].sort((a, b) => b.readers - a.readers).slice(0, 8)

export function bookBySlug(slug: string) {
  return books.find((b) => b.slug === slug)
}

export function bookById(id: string) {
  return books.find((b) => b.id === id)
}

export function relatedBooks(book: Book, limit = 4) {
  const same = books.filter((b) => b.category === book.category && b.id !== book.id)
  const rest = books.filter((b) => b.category !== book.category && b.id !== book.id)
  return [...same, ...rest].slice(0, limit)
}

export function searchBooks(query: string, limit?: number) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const scored = books
    .map((b) => {
      const title = b.title.toLowerCase()
      const author = b.author.toLowerCase()
      const tags = b.tags.join(' ').toLowerCase()
      const category = categoryMap[b.category].name.toLowerCase()
      const collection = b.collection.toLowerCase()
      let score = 0
      if (title === q) score = 100
      else if (title.startsWith(q)) score = 70
      else if (title.includes(q)) score = 50
      else if (author.includes(q)) score = 35
      else if (tags.includes(q) || b.description.toLowerCase().includes(q)) score = 15
      else if (category.includes(q) || collection.includes(q)) score = 12
      return { b, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.b.readers - a.b.readers)
    .map((x) => x.b)
  return limit ? scored.slice(0, limit) : scored
}

export const popularSearches = [
  'Tafsir',
  'Shahih Bukhari',
  'Fikih Syafi’i',
  'Tasawuf',
  'Bahasa Arab',
  'Sirah Nabi',
]
