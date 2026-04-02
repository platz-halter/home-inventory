import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const navItems = [
  { to: '/',        label: 'Dashboard',   icon: '⊞' },
  { to: '/items',   label: 'Inventory',   icon: '≡' },
  { to: '/manage',  label: 'Manage',      icon: '⊙' },
]

export function Sidebar() {
  const { theme, toggle } = useTheme()

  return (
    <div
      className="w-full h-screen sticky top-0 flex flex-col border-r"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      {/* Logo */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <span
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Home
        </span>
        <h1
          className="font-mono text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          Inventory
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 flex flex-col gap-0.5">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)]
              text-sm transition-colors duration-150
              ${isActive
                ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            <span className="font-mono text-base w-5 text-center">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Keyboard shortcut hint */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="border border-[var(--border)] px-1 rounded">N</span> new item
          {' · '}
          <span className="border border-[var(--border)] px-1 rounded">?</span> shortcuts
        </p>
      </div>

      {/* Theme toggle */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors hover:bg-[var(--bg-tertiary)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span className="font-mono text-base w-5 text-center">
            {theme === 'dark' ? '○' : '●'}
          </span>
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </div>
  )
}