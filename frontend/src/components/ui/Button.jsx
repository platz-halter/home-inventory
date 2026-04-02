// variants: 'primary' | 'secondary' | 'ghost' | 'danger'
// sizes: 'sm' | 'md' | 'lg'

const styles = {
  base: `
    inline-flex items-center justify-center gap-2
    font-medium cursor-pointer border
    transition-all duration-150
    disabled:opacity-40 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `,
  variants: {
    primary: `
      bg-[var(--accent)] text-[var(--accent-text)]
      border-[var(--accent)]
      hover:opacity-80
      focus:ring-[var(--accent)]
    `,
    secondary: `
      bg-transparent text-[var(--text-primary)]
      border-[var(--border-strong)]
      hover:bg-[var(--bg-tertiary)]
      focus:ring-[var(--border-strong)]
    `,
    ghost: `
      bg-transparent text-[var(--text-secondary)]
      border-transparent
      hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]
      focus:ring-[var(--border)]
    `,
    danger: `
      bg-transparent text-[var(--danger)]
      border-[var(--danger)]
      hover:bg-[var(--danger-muted)]
      focus:ring-[var(--danger)]
    `,
  },
  sizes: {
    sm: 'px-3 py-1.5 text-xs rounded-[var(--radius-sm)]',
    md: 'px-4 py-2 text-sm rounded-[var(--radius-md)]',
    lg: 'px-6 py-3 text-base rounded-[var(--radius-md)]',
  },
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`${styles.base} ${styles.variants[variant]} ${styles.sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}