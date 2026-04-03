import { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/Button'
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

function TagSelector({ allTags, selectedIds, onChange, onTagCreated }) {
  const [input, setInput] = useState('')
  const [creating, setCreating] = useState(false)
  const inputRef = useRef(null)   // ← inputRef lives HERE inside TagSelector

  const filtered = input.trim()
    ? allTags.filter(t => t.name.toLowerCase().includes(input.toLowerCase()))
    : []

  const exactMatch = allTags.find(
    t => t.name.toLowerCase() === input.trim().toLowerCase()
  )

  const toggleTag = (id) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter(x => x !== id)
        : [...selectedIds, id]
    )
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = input.trim()
      if (!val) return
      if (exactMatch) {
        toggleTag(exactMatch.id)
        setInput('')
        return
      }
      setCreating(true)
      try {
        const newTag = await tagsApi.create({ name: val })
        onTagCreated(newTag)
        onChange([...selectedIds, newTag.id])
        setInput('')
      } catch (err) {
        console.error('Tag creation failed:', err.message)
      } finally {
        setCreating(false)
      }
    }
    if (e.key === 'Backspace' && input === '' && selectedIds.length > 0) {
      onChange(selectedIds.slice(0, -1))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Selected tags + input combined */}
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
                onClick={(e) => { e.stopPropagation(); toggleTag(id) }}
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
          placeholder={selectedIds.length === 0 ? 'Type to search or press Enter to create...' : ''}
          disabled={creating}
          style={{
            flex: 1,
            minWidth: '140px',
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

      {/* Dropdown — only when typing */}
      {filtered.length > 0 && (
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            overflow: 'hidden',
            maxHeight: '180px',
            overflowY: 'auto',
          }}
        >
          {filtered.map((tag, i) => {
            const selected = selectedIds.includes(tag.id)
            return (
              <div
                key={tag.id}
                onClick={() => { toggleTag(tag.id); setInput('') }}
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
                }}
              >
                {tag.name}
                {selected && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}>
                    ✓ selected
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create hint */}
      {input.trim() && !exactMatch && (
        <p style={{
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}>
          Press{' '}
          <kbd style={{
            border: '1px solid var(--border)',
            borderRadius: '3px',
            padding: '1px 5px',
            fontSize: '11px',
          }}>
            Enter
          </kbd>
          {' '}to create "{input.trim()}"
          {creating && ' — creating...'}
        </p>
      )}
    </div>
  )
}

function CategorySelector({ allCategories, selectedIds, onChange }) {
  if (allCategories.length === 0) {
    return (
      <p style={{
        fontSize: '12px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
      }}>
        No categories yet — add them in Manage
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {allCategories.map(c => {
        const selected = selectedIds.includes(c.id)
        return (
          <span
            key={c.id}
            onClick={() => {
              onChange(
                selected
                  ? selectedIds.filter(x => x !== c.id)
                  : [...selectedIds, c.id]
              )
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
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
            {c.name}
          </span>
        )
      })}
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
  const [localTags, setLocalTags] = useState(tags)

  useEffect(() => { setLocalTags(tags) }, [tags])

  useEffect(() => {
    if (initial) {
      setForm({
        names: initial.names.map(n => n.name),
        room_id: initial.room_id ? String(initial.room_id) : '',
        shelf: initial.shelf || '',
        level_or_drawer: initial.level_or_drawer || '',
        comments: initial.comments || '',
        fill_level: initial.fill_level != null ? String(initial.fill_level) : '',
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

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'border-color 150ms ease',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    letterSpacing: '0.05em',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' , padding: '0 1rem', boxSizing:'border-box'}}>

      {/* Error */}
      {error && (
        <p style={{
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--danger)',
          color: 'var(--danger)',
          background: 'var(--danger-muted)',
        }}>
          {error}
        </p>
      )}

      {/* Names */}
      <div>
        <label style={labelStyle}>Name(s) *</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {form.names.map((name, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                value={name}
                onChange={e => setName(i, e.target.value)}
                placeholder={i === 0 ? 'Primary name' : 'Alias'}
                autoFocus={i === 0 && !initial}
                style={inputStyle}
              />
              {form.names.length > 1 && (
                <button
                  onClick={() => removeName(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '18px',
                    color: 'var(--text-muted)',
                    padding: '0 4px',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
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
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              textAlign: 'left',
              padding: 0,
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            + add alias
          </button>
        </div>
      </div>

      {/* Room */}
      <div>
        <label style={labelStyle}>Room</label>
        <select
          value={form.room_id}
          onChange={e => set('room_id', e.target.value)}
          style={inputStyle}
        >
          <option value="">No room</option>
          {rooms.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Shelf + Level */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Shelf / Closet</label>
          <input
            value={form.shelf}
            onChange={e => set('shelf', e.target.value)}
            placeholder="e.g. Cabinet A"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Level / Drawer</label>
          <input
            value={form.level_or_drawer}
            onChange={e => set('level_or_drawer', e.target.value)}
            placeholder="e.g. Top shelf"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Fill level */}
      <div>
        <label style={labelStyle}>
          Fill level
          {form.fill_level !== '' && (
            <span style={{ marginLeft: '8px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
              {Math.round(parseFloat(form.fill_level) * 100)}%
            </span>
          )}
        </label>
        <input
          type="range"
          min="0" max="1" step="0.05"
          value={form.fill_level || 0}
          onChange={e => set('fill_level', e.target.value)}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            Empty
          </span>
          <button
            onClick={() => set('fill_level', '')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            clear
          </button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            Full
          </span>
        </div>
      </div>

      {/* Tags — THIS is where TagSelector is actually rendered */}
      <div>
        <label style={labelStyle}>
          Tags
          <span style={{ marginLeft: '8px', fontFamily: 'var(--font-sans)', fontWeight: 'normal' }}>
            — type to search or create
          </span>
        </label>
        <TagSelector
          allTags={localTags}
          selectedIds={form.tag_ids}
          onChange={(ids) => set('tag_ids', ids)}
          onTagCreated={handleTagCreated}
        />
      </div>

      {/* Categories */}
      <div>
        <label style={labelStyle}>
          Categories
          <span style={{ marginLeft: '8px', fontFamily: 'var(--font-sans)', fontWeight: 'normal' }}>
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
        <label style={labelStyle}>Comments</label>
        <textarea
          value={form.comments}
          onChange={e => set('comments', e.target.value)}
          rows={3}
          placeholder="Any notes..."
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px' }}>
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