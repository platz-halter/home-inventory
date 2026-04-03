import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'

export function Layout({ children }) {
  useKeyboardShortcuts()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Sidebar — use className only, no conflicting inline display */}
      <aside
        className="hidden md:flex"
        style={{
          width: '220px',
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        minWidth: 0,
        padding: '40px 48px',
        paddingBottom: '80px',
      }}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
        }}
      >
        <BottomNav />
      </nav>
    </div>
  )
}