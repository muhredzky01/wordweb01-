export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ')

export const numberID = (n: number) => new Intl.NumberFormat('id-ID').format(n)

export const percent = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 100)

export function slugToTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function hash(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export function seeded(input: string, min: number, max: number) {
  return min + (hash(input) % (max - min + 1))
}

export const DRIVE_VIEW = (id: string) => `https://drive.google.com/file/d/${id}/view`
export const DRIVE_PREVIEW = (id: string) => `https://drive.google.com/file/d/${id}/preview`
export const DRIVE_DOWNLOAD = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`

export function fileSize(volumes: number) {
  return `${(volumes * 6.4).toFixed(1)} MB`
}

export function readingTime(volumes: number) {
  const minutes = volumes * 210
  return minutes > 600 ? `${Math.round(minutes / 60)} jam` : `${minutes} menit`
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
