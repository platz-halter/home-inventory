import { useNavigate } from 'react-router-dom'
import { useStats } from '../hooks/useStats'
import { Button } from '../components/ui/Button'

// Single stat card
function StatCard({ label, value, sub }) {
  return (
    <div className="card p-4 flex flex-col gap-1">
      <p
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </p>
      <p
        className="font-mono text-3xl font-medium"
        style={{ color: 'var(--text-primary)' }}
      >
        {value ?? '—'}
      </p>
      {sub && (
        <p
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

// Quick action button
function QuickAction({ icon, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left flex items-start gap-4 p-5
                 rounded-[var(--radius-md)] w-full transition-colors"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
    >
      {/* Fixed-size icon box — always centered */}
      <div
        className="flex items-center justify-center flex-shrink-0
                   rounded-[var(--radius-sm)] font-mono text-base"
        style={{
          width: '36px',
          height: '36px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          lineHeight: 1,
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 pt-0.5">
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      </div>
    </button>
  )
}

export function HomePage() {
  const { stats, loading } = useStats()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Dashboard
        </p>
        <h1
          className="text-2xl font-medium mt-1"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
        >
          Home Inventory
        </h1>
      </div>

      {/* Stats grid */}
      <div>
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Overview
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            label="Items"
            value={loading ? '...' : stats?.total_items}
          />
          <StatCard
            label="Rooms"
            value={loading ? '...' : stats?.total_rooms}
          />
          <StatCard
            label="Categories"
            value={loading ? '...' : stats?.total_categories}
          />
          <StatCard
            label="Tags"
            value={loading ? '...' : stats?.total_tags}
          />
          {!loading && stats?.unlocated_items > 0 && (
            <StatCard
              label="Unlocated"
              value={stats.unlocated_items}
              sub="items with no room"
            />
          )}
          {!loading && stats?.low_fill_items > 0 && (
            <StatCard
              label="Running low"
              value={stats.low_fill_items}
              sub="items below 25% fill"
            />
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Quick actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAction
            icon="+"
            label="Add item"
            description="Add a new item to your inventory"
            onClick={() => navigate('/items?new=true')}
          />
          <QuickAction
            icon="≡"
            label="View inventory"
            description="Browse, search and filter all items"
            onClick={() => navigate('/items')}
          />
          <QuickAction
            icon="⊙"
            label="Manage"
            description="Add or remove rooms, tags and categories"
            onClick={() => navigate('/manage')}
          />
          <QuickAction
            icon="?"
            label="Keyboard shortcuts"
            description={`N — new item · / — search · Esc — close`}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Keyboard hint at bottom */}
      <p
        className="font-mono text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        Press{' '}
        <span className="border border-[var(--border)] px-1 rounded">N</span>
        {' '}anywhere to add a new item
      </p>
    </div>
  )
}