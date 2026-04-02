import { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { tagsApi } from '../../api/tags'

const EMPTY_FORM = {
  names: [''],
  room_id: '',
  shelf: '',
  level_or_drawer: '',
  comments: '',
  fill_level: '',
  tag_ids: [],
  category_ids: [],
}

// Inline tag creator — type to filter existing, Enter to create new
function TagSelector({ allTags, selectedIds, onChange, onTagCreated }) {
  const [input, setInput] = useState('')
  const [creating, setCreating] = useState(false)
  const inputRef = useRef(null)

  const filtered = allTags.filter(t =>
    t.name.toLowerCase().includes(input.toLowerCase())
  )

  const exactMatch = allTags.find(
    t => t.name.toLowerCase() === input.toLowerCase()
  )

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!input.trim()) return

      if (exactMatch) {
        // Select existing tag
        if (!selectedIds.includes(exactMatch.id)) {
          onChange([...selectedIds, exactMatch.id])
        }
        setInput('')
        return
      }

      // Create new tag
      setCreating(true)
      try {
        const newTag = await tagsApi.create({ name: input.trim() })
        onTagCreated(newTag)
        onChange([...selectedIds, newTag.id])
        setInput('')
      } catch (e) {
        console.error('Failed to create tag:', e.message)
      } finally {
        setCreating(false)
      }
    }

    if (e.key === 'Backspace' && input === '' && selectedIds.length > 0) {
      // Remove last selected tag when backspacing on empty input
      onChange(selectedIds.slice(0, -1))
    }
  }

  const toggle = (id) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter(x => x !== id)
        : [...selectedIds, id]
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Selected tags as chips + input in one row */}
      <div
        className="flex flex-wrap gap-1.5 p-2 border rounded-[var(--radius-sm)] min-h-10 cursor-text"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-primary)',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {selectedIds.map(id => {
          const tag = allTags.find(t => t.id === id)
          if (!tag) return null
          return (
            <Badge
              key={id}
              variant="active"
              onRemove={() => toggle(id)}
            >
              {tag.name}
            </Badge>
          )
        })}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedIds.length === 0 ? 'Type to search or create...' : ''}
          className="flex-1 min-w-24 text-sm bg-transparent focus:outline-none"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
          }}
          disabled={creating}
        />
      </div>

      {/* Dropdown of matching existing tags */}
      {input && filtered.length > 0 && (
        <div
          className="card p-1 flex flex-col gap-0.5"
          style={{ maxHeight: '160px', overflowY: 'auto' }}
        >
          {filtered.map(tag => (
            <button
              key={tag.id}
              onClick={() => { toggle(tag.id); setInput('') }}
              className="text-left px-3 py-1.5 text-sm rounded-[var(--radius-sm)] transition-colors"
              style={{
                color: selectedIds.includes(tag.id)
                  ? 'var(--text-muted)'
                  : 'var(--text-primary)',
                background: selectedIds.includes(tag.id)
                  ? 'var(--bg-tertiary)'
                  : 'transparent',
              }}
            >
              {tag.name}
              {selectedIds.includes(tag.id) && (
                <span className="ml-2 font-mono text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Create new tag hint */}
      {input && !exactMatch && (
        <p
          className="text-xs font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          Press{' '}
          <span className="border border-[var(--border)] px-1 rounded">Enter</span>
          {' '}to create tag "{input}"
          {creating && ' — creating...'}
        </p>
      )}
    </div>
  )
}

// Simple category toggle — categories are more structured, no free creation
function CategorySelector({ allCategories, selectedIds, onChange }) {
  const toggle = (id) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter(x => x !== id)
        : [...selectedIds, id]
    )
  }

  if (allCategories.length === 0) {
    return (
      <p
        className="text-xs font-mono"
        style={{ color: 'var(--text-muted)' }}
      >
        No categories yet — add them in the Manage page
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {allCategories.map(c => (
        <Badge
          key={c.id}
          variant={selectedIds.includes(c.id) ? 'active' : 'default'}
          onClick={() => toggle(c.id)}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {c.name}
        </Badge>
      ))}
    </div>
  )
}

export function ItemForm({
  initial = null,
  rooms,
  tags,
  categories,
  onSubmit,
  onCancel,
  submitLabel = 'Add item',
  showAddAnother = false,
  onSubmitAndAnother = null,
  onTagCreated = null,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  // Local copy of tags so newly created ones appear immediately
  const [localTags, setLocalTags] = useState(tags)

  // Keep localTags in sync when parent tags prop changes
  useEffect(() => { setLocalTags(tags) }, [tags])

  useEffect(() => {
    if (initial) {
      setForm({
        names: initial.names.map(n => n.name),
        room_id: initial.room_id ? String(initial.room_id) : '',
        shelf: initial.shelf || '',
        level_or_drawer: initial.level_or_drawer || '',
        comments: initial.comments || '',
        fill_level: initial.fill_level != null
          ? String(initial.fill_level)
          : '',
        tag_ids: initial.tags.map(t => t.id),
        category_ids: initial.categories.map(c => c.id),
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [initial])

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const setName = (i, value) => {
    const names = [...form.names]
    names[i] = value
    set('names', names)
  }
  const addName = () => set('names', [...form.names, ''])
  const removeName = (i) => {
    if (form.names.length === 1) return
    set('names', form.names.filter((_, idx) => idx !== i))
  }

  const handleTagCreated = (newTag) => {
    setLocalTags(prev => [...prev, newTag])
    if (onTagCreated) onTagCreated(newTag)
  }

  const buildPayload = () => ({
    names: form.names.filter(n => n.trim()),
    room_id: form.room_id ? parseInt(form.room_id) : null,
    shelf: form.shelf || null,
    level_or_drawer: form.level_or_drawer || null,
    comments: form.comments || null,
    fill_level: form.fill_level !== '' ? parseFloat(form.fill_level) : null,
    tag_ids: form.tag_ids,
    category_ids: form.category_ids,
  })

  const handleSubmit = async (andAnother = false) => {
    setError(null)
    const payload = buildPayload()
    if (!payload.names.length) {
      setError('At least one name is required')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(payload)
      if (andAnother && onSubmitAndAnother) {
        setForm(EMPTY_FORM)
        onSubmitAndAnother()
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = `
    w-full px-3 py-2.5 text-sm border rounded-[var(--radius-sm)]
    focus:outline-none focus:border-[var(--border-strong)]
    transition-colors
  `

  const inputStyle = {
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border)',
    fontFamily: 'var(--font-sans)',
  }

  const labelClass = `block font-mono text-xs mb-1.5`

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <p
          className="text-xs font-mono px-3 py-2 rounded-[var(--radius-sm)] border"
          style={{
            color: 'var(--danger)',
            borderColor: 'var(--danger)',
            background: 'var(--danger-muted)',
          }}
        >
          {error}
        </p>
      )}

      {/* Names */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-muted)' }}>
          Name(s) *
        </label>
        <div className="flex flex-col gap-2">
          {form.names.map((name, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                value={name}
                onChange={e => setName(i, e.target.value)}
                placeholder={i === 0 ? 'Primary name' : 'Alias'}
                autoFocus={i === 0 && !initial}
              />
              {form.names.length > 1 && (
                <button
                  onClick={() => removeName(i)}
                  className="px-2 transition-colors font-mono"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--danger)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addName}
            className="text-xs font-mono text-left transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            + add alias
          </button>
        </div>
      </div>

      {/* Room */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-muted)' }}>
          Room
        </label>
        <select
          className={inputClass}
          value={form.room_id}
          onChange={e => set('room_id', e.target.value)}
        >
          <option value="">No room</option>
          {rooms.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Shelf + Level */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} style={{ color: 'var(--text-muted)' }}>
            Shelf / Closet
          </label>
          <input
            className={inputClass}
            value={form.shelf}
            onChange={e => set('shelf', e.target.value)}
            placeholder="e.g. Cabinet A"
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: 'var(--text-muted)' }}>
            Level / Drawer
          </label>
          <input
            className={inputClass}
            value={form.level_or_drawer}
            onChange={e => set('level_or_drawer', e.target.value)}
            placeholder="e.g. Top shelf"
          />
        </div>
      </div>

      {/* Fill level */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-muted)' }}>
          Fill level
          {form.fill_level !== '' && (
            <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>
              {Math.round(parseFloat(form.fill_level) * 100)}%
            </span>
          )}
        </label>
        <input
          type="range"
          min="0" max="1" step="0.05"
          value={form.fill_level || 0}
          onChange={e => set('fill_level', e.target.value)}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <div className="flex justify-between mt-1">
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            Empty
          </span>
          <button
            onClick={() => set('fill_level', '')}
            className="font-mono text-xs transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            clear
          </button>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            Full
          </span>
        </div>
      </div>

      {/* Tags — free type + select */}

      <div
        className="flex flex-wrap gap-1.5 px-3 py-2 border rounded-[var(--radius-sm)] cursor-text"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--input-bg)',
          minHeight: '42px',      // matches single input height exactly
          alignItems: 'center',
        }}
        onClick={() => inputRef.current?.focus()}
      ></div>

      {/* Categories — click to toggle */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-muted)' }}>
          Categories
          <span className="ml-2 font-normal" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
            — click to toggle
          </span>
        </label>
        <CategorySelector
          allCategories={categories}
          selectedIds={form.category_ids}
          onChange={(ids) => set('category_ids', ids)}
        />
      </div>

      {/* Comments */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-muted)' }}>
          Comments
        </label>
        <textarea
          className={inputClass}
          value={form.comments}
          onChange={e => set('comments', e.target.value)}
          rows={3}
          placeholder="Any notes..."
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 flex-wrap">
        <Button
          variant="primary"
          onClick={() => handleSubmit(false)}
          disabled={submitting}
        >
          {submitting ? '...' : submitLabel}
        </Button>
        {showAddAnother && (
          <Button
            variant="secondary"
            onClick={() => handleSubmit(true)}
            disabled={submitting}
          >
            Add + another
          </Button>
        )}
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </div>
  )
}