export function FilterPanel({ rooms, tags, categories, onFilter, current }) {
  return (
    <div
      className="card p-4 flex flex-col gap-4"
      style={{ minWidth: '200px' }}
    >
      <p
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        Filter
      </p>

      {/* Room filter */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs font-mono"
          style={{ color: 'var(--text-secondary)' }}
        >
          Room
        </label>
        <select
          value={current.roomId || ''}
          onChange={e => onFilter('room_id', e.target.value || null)}
          className="text-sm py-1.5 px-2 border rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)] focus:outline-none"
        >
          <option value="">All rooms</option>
          {rooms.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Category filter */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs font-mono"
          style={{ color: 'var(--text-secondary)' }}
        >
          Category
        </label>
        <select
          value={current.categoryId || ''}
          onChange={e => onFilter('category_id', e.target.value || null)}
          className="text-sm py-1.5 px-2 border rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)] focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Tag filter */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs font-mono"
          style={{ color: 'var(--text-secondary)' }}
        >
          Tag
        </label>
        <select
          value={current.tagId || ''}
          onChange={e => onFilter('tag_id', e.target.value || null)}
          className="text-sm py-1.5 px-2 border rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)] focus:outline-none"
        >
          <option value="">All tags</option>
          {tags.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}