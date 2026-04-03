import { useState } from 'react'
import { useTags } from '../hooks/useTags'
import { useCategories } from '../hooks/useCategories'
import { useRooms } from '../hooks/useRooms'
import { Button } from '../components/ui/Button'

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
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-secondary)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',   // keeps children inside rounded corners
    }}>

      {/* Section header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          {title}
          <span style={{ marginLeft: '8px' }}>({items.length})</span>
        </h2>
      </div>

      {/* Create input */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '9px 12px',
            fontSize: '14px',
            fontFamily: 'var(--font-sans)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--input-bg)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          onClick={handleCreate}
          disabled={loading || !input.trim()}
          style={{
            // Match the input height exactly
            padding: '9px 12px',        // same as the input
            aspectRatio: '1 / 1',       // makes it a perfect square

            // Visual style
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            flexShrink: 0,

            // Center the + symbol
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            // Typography
            fontSize: '18px',
            lineHeight: 1,
            fontFamily: 'var(--font-mono)',

            // Disabled state
            opacity: loading || !input.trim() ? 0.4 : 1,

            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => {
            if (!loading && input.trim()) {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent-text)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-tertiary)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          aria-label="Add"
        >
          {loading ? '...' : '+'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--danger)',
            margin: 0,
          }}>
            {error}
          </p>
        </div>
      )}

      {/* Item list */}
      <div style={{ flex: 1 }}>
        {items.length === 0 ? (
          <div style={{
            padding: '32px 20px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              margin: 0,
            }}>
              None yet — add one above
            </p>
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                transition: 'background 100ms ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                fontSize: '14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
              }}>
                {item.name}
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '18px',
                  lineHeight: 1,
                  color: 'var(--text-muted)',
                  padding: '0 4px',
                  marginLeft: '12px',
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.target.style.color = 'var(--danger)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                aria-label={`Delete ${item.name}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function ManagePage() {
  const { tags, createTag, deleteTag } = useTags()
  const { categories, createCategory, deleteCategory } = useCategories()
  const { rooms, createRoom, deleteRoom } = useRooms()

  const handleDeleteRoom = async (id) => {
    if (!confirm('Delete this room? Items in this room will become unlocated.')) return
    try {
      await deleteRoom(id)
    } catch (e) {
      alert('Could not delete room: ' + e.message)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Page header */}
      <div>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: '0 0 6px 0',
        }}>
          Manage
        </p>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          Add or remove rooms, categories and tags used across your inventory.
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginTop: '10px',
        }}>
          Press{' '}
          <kbd style={{
            border: '1px solid var(--border)',
            borderRadius: '3px',
            padding: '1px 6px',
            fontSize: '10px',
          }}>
            Enter
          </kbd>
          {' '}to add
        </p>
      </div>

      {/* Three sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        alignItems: 'start',
      }}>
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