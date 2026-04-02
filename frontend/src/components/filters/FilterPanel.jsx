function FilterSection({ title, items, selectedIds, onToggle }) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        {title}
      </p>
      <div
        className="flex flex-col rounded-[var(--radius-sm)] overflow-hidden"
        style={{ border: '1px solid var(--border)' }}
      >
        {items.map((item, i) => {
          const checked = selectedIds.includes(item.id)
          return (
            <label
              key={item.id}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer
                         transition-colors text-sm"
              style={{
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                background: checked ? 'var(--bg-tertiary)' : 'transparent',
                color: checked ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.id)}
                className="flex-shrink-0"
                style={{ accentColor: 'var(--accent)' }}
              />
              <span>{item.name}</span>
              {checked && (
                <span
                  className="ml-auto font-mono text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ✓
                </span>
              )}
            </label>
          )
        })}
      </div>
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
    <div
      className="rounded-[var(--radius-md)] p-4 flex flex-col gap-5"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
      }}
    >
      {!hasAny && (
        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          No rooms, tags or categories yet — add them in Manage.
        </p>
      )}

      <FilterSection
        title="Room"
        items={rooms}
        selectedIds={current.roomIds || []}
        onToggle={(id) => toggle('roomIds', id)}
      />
      <FilterSection
        title="Category"
        items={categories}
        selectedIds={current.categoryIds || []}
        onToggle={(id) => toggle('categoryIds', id)}
      />
      <FilterSection
        title="Tag"
        items={tags}
        selectedIds={current.tagIds || []}
        onToggle={(id) => toggle('tagIds', id)}
      />
    </div>
  )
}