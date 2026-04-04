import { useNavigate } from 'react-router-dom'
import { useStats } from '../hooks/useStats'
import { Button } from '../components/ui/Button'

// Single stat card
function StatCard({ label, value, sub }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-secondary)',
      padding: '20px 24px',          // generous left/right padding
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        margin: 0,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '32px',
        fontWeight: 500,
        color: 'var(--text-primary)',
        margin: 0,
        lineHeight: 1.1,
      }}>
        {value ?? '—'}
      </p>
      {sub && (
        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
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
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
      style={{
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',    // center vertically — not flex-start
        gap: '16px',
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        width: '100%',
        cursor: 'pointer',
        transition: 'background 150ms ease',
      }}
    >
      {/* Icon box — exact size, no extra line height */}
      <div
        style={{
          width: '36px',
          height: '36px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-mono)',
          fontSize: '16px',
          lineHeight: '1',          // collapse extra line height
          color: 'var(--text-secondary)',
        }}
      >
        {icon}
      </div>

      {/* Text — vertically centered by parent alignItems: center */}
      <div>
        <p style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '2px',
        }}>
          {label}
        </p>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
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