import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const navItems = [
  { to: '/',       label: 'Dashboard',  icon: '⊞' },
  { to: '/items',  label: 'Inventory',  icon: '≡' },
  { to: '/manage', label: 'Manage',     icon: '⊙' },
]

export function Sidebar() {
  const { theme, toggle } = useTheme()

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
    }}>

      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          Home
        </p>
        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '2px 0 0 0',
        }}>
          Inventory
        </h1>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1,
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              transition: 'background 150ms ease, color 150ms ease',
              background: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
            })}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '15px',
              width: '20px',
              textAlign: 'center',
              lineHeight: 1,
              flexShrink: 0,
            }}>
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Shortcuts hint */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          margin: 0,
          lineHeight: 1.6,
        }}>
          <kbd style={{
            border: '1px solid var(--border)',
            borderRadius: '3px',
            padding: '1px 5px',
            fontSize: '10px',
          }}>N</kbd>
          {' '}new item
          {' · '}
          <kbd style={{
            border: '1px solid var(--border)',
            borderRadius: '3px',
            padding: '1px 5px',
            fontSize: '10px',
          }}>/</kbd>
          {' '}search
        </p>
      </div>

      {/* Theme toggle */}
      <div style={{
        padding: '10px',
        borderTop: '1px solid var(--border)',
      }}>
        <button
          onClick={toggle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-secondary)',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            width: '20px',
            textAlign: 'center',
            lineHeight: 1,
            flexShrink: 0,
          }}>
            {theme === 'dark' ? '○' : '●'}
          </span>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </div>
  )
}