import { useRef, useEffect } from 'react'

export function SearchBar({ value, onChange }) {
  const ref = useRef(null)

  // '/' key focuses the search bar — keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '/') {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="relative flex-1">
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      >
        /
      </span>
      <input
        ref={ref}
        type="text"
        placeholder="Search items..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-8 pr-4 py-2 text-sm border rounded-[var(--radius-md)] bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
        style={{ fontFamily: 'var(--font-sans)' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          ×
        </button>
      )}
    </div>
  )
}