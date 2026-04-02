import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'

export function Layout({ children }) {
  useKeyboardShortcuts()   // global shortcuts active on every page

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* Sidebar — hidden on mobile, visible md+ */}
      <aside className="hidden md:flex md:w-56 lg:w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </div>
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNav />
      </nav>
    </div>
  )
}