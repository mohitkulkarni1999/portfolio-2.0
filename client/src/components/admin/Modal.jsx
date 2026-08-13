// Modal.jsx — a pop-up dialog used for the add/edit forms
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-noir/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-onyx border border-white/10 shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-ivory">{title}</h2>
          <button onClick={onClose} className="text-ivory/40 hover:text-ivory transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
