import { useState } from 'react'
import type { Book } from '../types'
import { cx } from '../lib/utils'

interface Props {
  book: Book
  size?: 'card' | 'shelf' | 'detail' | 'mini' | 'hero'
  className?: string
  eager?: boolean
}

export function BookCover({ book, size = 'card', className, eager }: Props) {
  const [failed, setFailed] = useState(false)
  const showImage = book.cover && !failed

  return (
    <div
      className={cx('book-cover', `cover-${size}`, className)}
      style={{ background: `linear-gradient(150deg, ${book.accent[0]}, ${book.accent[1]})` }}
    >
      {showImage ? (
        <img
          src={book.cover as string}
          alt={`Sampul ${book.title}`}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="cover-fallback" dir={book.arabic ? 'rtl' : 'ltr'}>
          <span className="cover-rule" aria-hidden="true" />
          <span className="cover-arabic">{book.arabic || book.title}</span>
          <span className="cover-title">{book.arabic ? book.title : book.author}</span>
          <span className="cover-mark" aria-hidden="true">
            مكتبة
          </span>
        </div>
      )}
      <span className="cover-sheen" aria-hidden="true" />
    </div>
  )
}
