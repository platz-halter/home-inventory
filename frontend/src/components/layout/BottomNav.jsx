import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const navItems = [
  { to: '/',       label: 'Home',      icon: '⊞' },
  { to: '/items',  label: 'Inventory', icon: '≡' },
  { to: '/manage', label: 'Manage',    icon: '⊙' },
]

export function BottomNav() {
  const { theme, toggle } = useTheme()

  return (
    <div
      className="flex items-center border-t"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `
            flex-1 flex flex-col items-center gap-1 py-3 text-xs
            transition-colors duration-150
            ${isActive
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)]'
            }
          `}
        >
          <span className="text-base font-mono">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}

      {/* Theme toggle as last nav item on mobile */}
      <button
        onClick={toggle}
        className="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors"
        style={{ color: 'var(--text-muted)' }}
      >
        <span className="text-base font-mono">{theme === 'dark' ? '○' : '●'}</span>
        <span>Theme</span>
      </button>
    </div>
  )
}