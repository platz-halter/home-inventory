import { useEffect } from 'react'

export function Modal({ isOpen, onClose, title, children, footer }) {
  // Close on Escape key — keyboard shortcut support
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      {/* Modal panel — stop click from closing when clicking inside */}
      <div
        className="card w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2
            id="modal-title"
            className="font-mono text-sm font-medium tracking-wider uppercase text-[var(--text-primary)]"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-lg leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-[var(--border)] flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}