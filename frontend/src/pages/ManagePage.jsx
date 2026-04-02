import { useState } from 'react'
import { useTags } from '../hooks/useTags'
import { useCategories } from '../hooks/useCategories'
import { useRooms } from '../hooks/useRooms'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

// Reusable section for managing a single resource type
function ManageSection({ title, items, onCreate, onDelete, placeholder }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCreate = async () => {
    const name = input.trim()
    if (!name) return
    setLoading(true)
    setError(null)
    try {
      await onCreate({ name })
      setInput('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this? Items using it will lose this association.')) return
    try {
      await onDelete(id)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleCreate()
  }

  return (
    <div className="card p-4 flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          {title}
          <span className="ml-2">({items.length})</span>
        </h2>
      </div>

      {/* Inline create input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm border rounded-[var(--radius-sm)]
                     bg-[var(--bg-primary)] text-[var(--text-primary)]
                     border-[var(--border)] focus:outline-none
                     focus:border-[var(--border-strong)] transition-colors"
        />
        <Button
          size="sm"
          onClick={handleCreate}
          disabled={loading || !input.trim()}
        >
          {loading ? '...' : 'Add'}
        </Button>
      </div>

      {error && (
        <p
          className="text-xs font-mono"
          style={{ color: 'var(--danger)' }}
        >
          {error}
        </p>
      )}

      {/* Item list */}
      {items.length === 0 ? (
        <p
          className="text-xs font-mono py-4 text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          None yet — add one above
        </p>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2"
            >
              <span
                className="text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.name}
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                className="font-mono text-sm px-2 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.target.style.color = 'var(--danger)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                aria-label={`Delete ${item.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ManagePage() {
  const { tags, createTag, deleteTag } = useTags()
  const { categories, createCategory, deleteCategory } = useCategories()
  const { rooms, createRoom } = useRooms()

  // Rooms don't have a deleteRoom in useRooms yet — we'll note that
  const handleDeleteRoom = async (id) => {
    // Rooms with items can't be deleted safely without cascade handling
    // For now we inform the user — Phase 7 can add this
    alert('Room deletion coming in a future update. Remove all items from the room first.')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Manage
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          Manage rooms, tags, and categories used across your inventory.
        </p>
      </div>

      {/* Keyboard hint */}
      <p
        className="font-mono text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        Press{' '}
        <span className="border border-[var(--border)] px-1 rounded">Enter</span>
        {' '}to add
      </p>

      {/* Three sections — stack on mobile, grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ManageSection
          title="Rooms"
          items={rooms}
          onCreate={createRoom}
          onDelete={handleDeleteRoom}
          placeholder="e.g. Kitchen"
        />
        <ManageSection
          title="Categories"
          items={categories}
          onCreate={createCategory}
          onDelete={deleteCategory}
          placeholder="e.g. Cookware"
        />
        <ManageSection
          title="Tags"
          items={tags}
          onCreate={createTag}
          onDelete={deleteTag}
          placeholder="e.g. fragile"
        />
      </div>
    </div>
  )
}