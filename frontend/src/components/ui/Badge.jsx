export function Badge({ children, onRemove, onClick, variant = 'default', style = {} }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid',
    transition: 'all 150ms ease',
    cursor: onClick || onRemove ? 'pointer' : 'default',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  const variants = {
    default: {
      background: 'var(--bg-tertiary)',
      color: 'var(--text-secondary)',
      borderColor: 'var(--border)',
    },
    active: {
      background: 'var(--accent)',
      color: 'var(--accent-text)',
      borderColor: 'var(--accent)',
    },
  }

  return (
    <span
      style={{ ...base, ...variants[variant], ...style }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(e) } : undefined}
    >
      {children}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          style={{
            background: 'none',
            border: 'none',
            padding: '0 0 0 2px',
            cursor: 'pointer',
            color: 'inherit',
            fontSize: '14px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  )
}