import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

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

export function ItemForm({
  initial = null,    // null = create mode, object = edit mode
  rooms,
  tags,
  categories,
  onSubmit,          // called with form data
  onCancel,
  submitLabel = 'Add item',
  showAddAnother = false,
  onSubmitAndAnother = null,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Populate form when editing an existing item
  useEffect(() => {
    if (initial) {
      setForm({
        names: initial.names.map(n => n.name),
        room_id: initial.room_id || '',
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

  // Name list handlers
  const setName = (i, value) => {
    const names = [...form.names]
    names[i] = value
    set('names', names)
  }
  const addName = () => set('names', [...form.names, ''])
  const removeName = (i) => {
    if (form.names.length === 1) return  // always keep one
    set('names', form.names.filter((_, idx) => idx !== i))
  }

  // Tag / category toggle
  const toggleId = (key, id) => {
    set(key, form[key].includes(id)
      ? form[key].filter(x => x !== id)
      : [...form[key], id]
    )
  }

  const buildPayload = () => ({
    names: form.names.filter(n => n.trim()),
    room_id: form.room_id ? parseInt(form.room_id) : null,
    shelf: form.shelf || null,
    level_or_drawer: form.level_or_drawer || null,
    comments: form.comments || null,
    fill_level: form.fill_level !== ''
      ? parseFloat(form.fill_level)
      : null,
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
    w-full px-3 py-2 text-sm border rounded-[var(--radius-sm)]
    bg-[var(--bg-primary)] text-[var(--text-primary)]
    border-[var(--border)] focus:outline-none focus:border-[var(--border-strong)]
    transition-colors
  `

  const labelClass = `
    block font-mono text-xs mb-1
  `

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <p
          className="text-xs font-mono px-3 py-2 rounded-[var(--radius-sm)] border"
          style={{
            color: 'var(--danger)',
            borderColor: 'var(--danger)',
            background: 'var(--danger-muted)'
          }}
        >
          {error}
        </p>
      )}

      {/* Names — supports multiple */}
      <div>
        <label
          className={labelClass}
          style={{ color: 'var(--text-muted)' }}
        >
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
                  className="px-2 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors font-mono"
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
        <label
          className={labelClass}
          style={{ color: 'var(--text-muted)' }}
        >
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

      {/* Shelf + Level in a row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className={labelClass}
            style={{ color: 'var(--text-muted)' }}
          >
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
          <label
            className={labelClass}
            style={{ color: 'var(--text-muted)' }}
          >
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
        <label
          className={labelClass}
          style={{ color: 'var(--text-muted)' }}
        >
          Fill level
          {form.fill_level !== '' && (
            <span className="ml-2 font-mono" style={{ color: 'var(--text-secondary)' }}>
              {Math.round(parseFloat(form.fill_level) * 100)}%
            </span>
          )}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={form.fill_level || 0}
          onChange={e => set('fill_level', e.target.value)}
          className="w-full accent-[var(--accent)]"
        />
        <div className="flex justify-between mt-1">
          <span
            className="font-mono text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Empty
          </span>
          <button
            onClick={() => set('fill_level', '')}
            className="font-mono text-xs transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            clear
          </button>
          <span
            className="font-mono text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Full
          </span>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <label
            className={labelClass}
            style={{ color: 'var(--text-muted)' }}
          >
            Categories
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => (
              <Badge
                key={c.id}
                variant={form.category_ids.includes(c.id) ? 'active' : 'default'}
                onClick={() => toggleId('category_ids', c.id)}
                style={{ cursor: 'pointer' }}
              >
                {c.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <label
            className={labelClass}
            style={{ color: 'var(--text-muted)' }}
          >
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(t => (
              <Badge
                key={t.id}
                variant={form.tag_ids.includes(t.id) ? 'active' : 'default'}
                onClick={() => toggleId('tag_ids', t.id)}
                style={{ cursor: 'pointer' }}
              >
                {t.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div>
        <label
          className={labelClass}
          style={{ color: 'var(--text-muted)' }}
        >
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

      {/* Form actions */}
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