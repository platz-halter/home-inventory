import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'

export function Layout({ children }) {
  useKeyboardShortcuts()

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <aside className="hidden md:flex md:w-56 lg:w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Consistent padding on all sides, never touches edges */}
        <div className="flex-1 px-6 py-6 pb-24 md:px-10 md:py-8 md:pb-8 max-w-6xl w-full">
          {children}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNav />
      </nav>
    </div>
  )
}