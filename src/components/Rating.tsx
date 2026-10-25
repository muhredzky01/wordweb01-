import { Star } from 'lucide-react'

export function Rating({ value, count, size = 13 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="rating" aria-label={`Rating ${value} dari 5`}>
      <span className="stars" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(value) ? 'star filled' : 'star'}
            strokeWidth={2}
          />
        ))}
      </span>
      <b>{value.toFixed(1)}</b>
      {count !== undefined && <span className="rating-count">({count})</span>}
    </span>
  )
}
