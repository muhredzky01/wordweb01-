import { Check, Info, X, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function Toasts() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`}>
          <span className="toast-icon">
            {toast.tone === 'success' ? <Check size={15} /> : toast.tone === 'error' ? <AlertCircle size={15} /> : <Info size={15} />}
          </span>
          <p>{toast.message}</p>
          <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Tutup notifikasi"><X size={14} /></button>
        </div>
      ))}
    </div>
  )
}
