export type CategoryId =
  | 'quran' | 'hadith' | 'fiqh' | 'aqidah' | 'tasawuf'
  | 'sirah' | 'ushul' | 'language' | 'doa' | 'terjemahan'

export interface Category {
  id: CategoryId
  name: string
  arabic: string
  color: string
  light: string
}

export interface Volume {
  name: string
  id: string
}

export interface Book {
  id: string
  slug: string
  title: string
  arabic: string
  subtitle: string
  author: string
  category: CategoryId
  collection: string
  language: string
  volumes: number
  driveId: string
  files: Volume[]
  cover: string | null
  modified: string | null
  rating: number
  readers: number
  featured: boolean
  era: 'klasik' | 'modern'
  tags: string[]
  description: string
  accent: [string, string]
}

export interface User {
  name: string
  email: string
  joined: string
}

export interface Review {
  id: string
  bookId: string
  name: string
  rating: number
  text: string
  date: string
}
