import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const navItems = [
  { to: '/',        label: 'Dashboard',  icon: '⊞' },
  { to: '/items',   label: 'Inventory',  icon: '≡' },
  { to: '/manage',  label: 'Manage',     icon: '⊙' },
]

export function Sidebar() {
  const { theme, toggle } = useTheme()

  return (
    <div
      className="w-full h-screen sticky top-0 flex flex-col border-r"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      {/* Logo — with proper left padding */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <span
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Home
        </span>
        <h1
          className="font-mono text-sm font-medium mt-0.5"
          style={{ color: 'var(--text-primary)' }}
        >
          Inventory
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]
              text-sm transition-colors duration-150
              ${isActive
                ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {/* Icon centered in fixed width box */}
            <span
              className="font-mono text-base flex items-center justify-center"
              style={{ width: '20px', lineHeight: 1 }}
            >
              {icon}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Shortcut hint */}
      <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          <kbd className="border border-[var(--border)] px-1.5 py-0.5 rounded text-xs">N</kbd>
          {' '}new item
          {' · '}
          <kbd className="border border-[var(--border)] px-1.5 py-0.5 rounded text-xs">/</kbd>
          {' '}search
        </p>
      </div>

      {/* Theme toggle */}
      <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]
                     text-sm transition-colors hover:bg-[var(--bg-tertiary)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span
            className="font-mono text-base flex items-center justify-center"
            style={{ width: '20px', lineHeight: 1 }}
          >
            {theme === 'dark' ? '○' : '●'}
          </span>
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </div>
  )
}