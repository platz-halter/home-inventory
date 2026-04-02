// Used for tags and categories throughout the app
export function Badge({ children, onRemove, variant = 'default' }) {
  const base = `
    inline-flex items-center gap-1
    px-2 py-0.5 text-xs font-mono
    border rounded-[var(--radius-sm)]
    transition-colors duration-150
  `
  const variants = {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border)]',
    active:  'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]',
  }

  return (
    <span className={`${base} ${variants[variant]}`}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:text-[var(--danger)] transition-colors"
          aria-label={`Remove ${children}`}
        >
          ×
        </button>
      )}
    </span>
  )
}