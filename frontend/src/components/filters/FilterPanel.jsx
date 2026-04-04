import { useState, useRef } from 'react'
import { tagsApi } from '../../api/tags'

// Clickable chip — same style as CategorySelector in ItemForm
function ChipSelector({ items, selectedIds, onToggle }) {
  if (items.length === 0) return (
    <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      color: 'var(--text-muted)',
    }}>
      None yet
    </p>
  )

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {items.map(item => {
        const selected = selectedIds.includes(item.id)
        return (
          <span
            key={item.id}
            onClick={() => onToggle(item.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 12px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 150ms ease',
              background: selected ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: selected ? 'var(--accent-text)' : 'var(--text-secondary)',
              borderColor: selected ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {item.name}
          </span>
        )
      })}
    </div>
  )
}

// Tag input — same style as TagSelector in ItemForm
function TagFilterSelector({ allTags, selectedIds, onToggle, onTagCreated }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const filtered = input.trim()
    ? allTags.filter(t => t.name.toLowerCase().includes(input.toLowerCase()))
    : []

  const exactMatch = allTags.find(
    t => t.name.toLowerCase() === input.trim().toLowerCase()
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (exactMatch) {
        onToggle(exactMatch.id)
        setInput('')
      }
    }
    if (e.key === 'Backspace' && input === '' && selectedIds.length > 0) {
      onToggle(selectedIds[selectedIds.length - 1])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Selected tags + input box */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          minHeight: '42px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--input-bg)',
          cursor: 'text',
        }}
      >
        {selectedIds.map(id => {
          const tag = allTags.find(t => t.id === id)
          if (!tag) return null
          return (
            <span
              key={id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                background: 'var(--accent)',
                color: 'var(--accent-text)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--accent)',
              }}
            >
              {tag.name}
              <button
                onClick={(e) => { e.stopPropagation(); onToggle(id) }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: '0 0 0 2px',
                  fontSize: '14px',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                ×
              </button>
            </span>
          )
        })}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedIds.length === 0 ? 'Type to filter by tag...' : ''}
          style={{
            flex: 1,
            minWidth: '120px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'var(--font-sans)',
            padding: 0,
          }}
        />
      </div>

      {/* Dropdown results */}
      {filtered.length > 0 && (
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-secondary)',
          overflow: 'hidden',
          maxHeight: '160px',
          overflowY: 'auto',
        }}>
          {filtered.map((tag, i) => {
            const selected = selectedIds.includes(tag.id)
            return (
              <div
                key={tag.id}
                onClick={() => { onToggle(tag.id); setInput('') }}
                style={{
                  padding: '10px 14px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  background: selected ? 'var(--bg-tertiary)' : 'transparent',
                  color: selected ? 'var(--text-muted)' : 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 100ms ease',
                }}
              >
                {tag.name}
                {selected && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}>
                    ✓
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* No results hint */}
      {input.trim() && filtered.length === 0 && (
        <p style={{
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          No tags match "{input.trim()}"
        </p>
      )}
    </div>
  )
}

// Section wrapper with label
function FilterSection({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        margin: 0,
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

export function FilterPanel({ rooms, tags, categories, onFilter, current }) {
  const toggle = (key, id) => {
    const currentIds = current[key] || []
    const next = currentIds.includes(id)
      ? currentIds.filter(x => x !== id)
      : [...currentIds, id]
    onFilter(key, next.length > 0 ? next : null)
  }

  const hasAny = rooms.length > 0 || tags.length > 0 || categories.length > 0

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-secondary)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        margin: 0,
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border)',
      }}>
        Filter by
      </p>

      {!hasAny && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          No rooms, tags or categories yet — add them in Manage.
        </p>
      )}

      {rooms.length > 0 && (
        <FilterSection title="Room">
          <ChipSelector
            items={rooms}
            selectedIds={current.roomIds || []}
            onToggle={(id) => toggle('roomIds', id)}
          />
        </FilterSection>
      )}

      {categories.length > 0 && (
        <FilterSection title="Category">
          <ChipSelector
            items={categories}
            selectedIds={current.categoryIds || []}
            onToggle={(id) => toggle('categoryIds', id)}
          />
        </FilterSection>
      )}

      {tags.length > 0 && (
        <FilterSection title="Tag">
          <TagFilterSelector
            allTags={tags}
            selectedIds={current.tagIds || []}
            onToggle={(id) => toggle('tagIds', id)}
          />
        </FilterSection>
      )}
    </div>
  )
}