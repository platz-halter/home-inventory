import { useState } from 'react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

function FillBar({ level }) {
  if (level == null) return <span style={{ color: 'var(--text-muted)' }}>—</span>
  return (
    <div className="flex items-center gap-2 min-w-20">
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${level * 100}%`, background: 'var(--text-primary)' }}
        />
      </div>
      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
        {Math.round(level * 100)}%
      </span>
    </div>
  )
}

// Column header with sort support
function Th({ children, sortKey, currentSort, onSort }) {
  const active = currentSort?.key === sortKey
  return (
    <th
      className="text-left py-2 px-3 font-mono text-xs tracking-wider uppercase cursor-pointer select-none"
      style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}
      onClick={() => onSort && onSort(sortKey)}
    >
      <span className="flex items-center gap-1">
        {children}
        {active && (
          <span>{currentSort.dir === 'asc' ? '↑' : '↓'}</span>
        )}
      </span>
    </th>
  )
}

export function ItemTable({
  items,
  selectedIds,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onClone,
}) {
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Client-side sort — server-side sort can be added later
  const sorted = [...items].sort((a, b) => {
    let aVal, bVal
    switch (sort.key) {
      case 'name':
        aVal = a.names.find(n => n.is_primary)?.name || ''
        bVal = b.names.find(n => n.is_primary)?.name || ''
        break
      case 'room':
        aVal = a.room?.name || ''
        bVal = b.room?.name || ''
        break
      case 'fill':
        aVal = a.fill_level ?? -1
        bVal = b.fill_level ?? -1
        break
      default:
        return 0
    }
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sort.dir === 'asc' ? cmp : -cmp
  })

  const allSelected = items.length > 0 &&
    items.every(i => selectedIds.includes(i.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {/* Select all */}
            <th className="py-3 px-4 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onSelectAll(allSelected ? [] : items.map(i => i.id))}
                className="cursor-pointer"
                style={{ accentColor: 'var(--accent)', width: '15px', height: '15px' }}
              />
            </th>
            <Th sortKey="name" currentSort={sort} onSort={handleSort}>
              Name
            </Th>
            <Th sortKey="room" currentSort={sort} onSort={handleSort}>
              Location
            </Th>
            <th
              className="text-left py-2 px-3 font-mono text-xs tracking-wider uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              Tags / Categories
            </th>
            <Th sortKey="fill" currentSort={sort} onSort={handleSort}>
              Fill
            </Th>
            {/* Image placeholder column */}
            <th
              className="text-left py-2 px-3 font-mono text-xs tracking-wider uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              Img
            </th>
            <th className="py-2 px-3" />
          </tr>
        </thead>
        <tbody>
          {sorted.map(item => {
            const primaryName = item.names.find(n => n.is_primary)?.name
              || item.names[0]?.name || 'Unnamed'
            const aliases = item.names.filter(n => !n.is_primary)
            const isSelected = selectedIds.includes(item.id)

            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: isSelected
                    ? 'var(--bg-tertiary)'
                    : 'transparent',
                }}
                className="transition-colors hover:bg-[var(--bg-secondary)]"
              >
                {/* Checkbox */}
                <td className="py-3 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(item.id)}
                    className="cursor-pointer"
                    style={{ accentColor: 'var(--accent)', width: '15px', height: '15px' }}
                  />
                </td>

                {/* Name */}
                <td className="py-3 px-4">
                  <p style={{ color: 'var(--text-primary)' }}>
                    {primaryName}
                  </p>
                  {aliases.length > 0 && (
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {aliases.map(n => n.name).join(', ')}
                    </p>
                  )}
                </td>

                {/* Location */}
                <td className="py-3 px-4">
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {item.room?.name || '—'}
                  </p>
                  {(item.shelf || item.level_or_drawer) && (
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {[item.shelf, item.level_or_drawer]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </td>

                {/* Tags / Categories */}
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {item.categories.map(c => (
                      <Badge key={c.id} variant="active">{c.name}</Badge>
                    ))}
                    {item.tags.map(t => (
                      <Badge key={t.id}>{t.name}</Badge>
                    ))}
                  </div>
                </td>

                {/* Fill level */}
                <td className="py-3 px-4">
                  <FillBar level={item.fill_level} />
                </td>

                {/* Image placeholder */}
                <td className="py-3 px-4">
                  <button
                    className="font-mono text-lg leading-none transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    title="Add image (coming soon)"
                    disabled
                  >
                    ⊕
                  </button>
                </td>

                {/* Row actions */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onClone(item.id)}>
                      Clone
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(item.id)}
                      style={{ minWidth: '64px' }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}

          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="py-16 text-center font-mono text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}