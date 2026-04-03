import { useState } from 'react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

function FillBar({ level }) {
  if (level == null) return (
    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
      —
    </span>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px' }}>
      <div
        style={{
          flex: 1,
          height: '4px',
          borderRadius: '2px',
          background: 'var(--bg-tertiary)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '2px',
            width: `${level * 100}%`,
            background: 'var(--text-primary)',
          }}
        />
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        flexShrink: 0,
      }}>
        {Math.round(level * 100)}%
      </span>
    </div>
  )
}

function SortableTh({ children, sortKey, currentSort, onSort, style = {} }) {
  const active = currentSort?.key === sortKey
  return (
    <th
      onClick={() => onSort(sortKey)}
      style={{
        textAlign: 'left',
        padding: '12px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid var(--border)',
        ...style,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {children}
        {active && (
          <span style={{ fontSize: '10px' }}>
            {currentSort.dir === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </span>
    </th>
  )
}

function StaticTh({ children, style = {} }) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '12px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid var(--border)',
        ...style,
      }}
    >
      {children}
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
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }))
  }

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

  const allSelected = items.length > 0 && items.every(i => selectedIds.includes(i.id))

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-secondary)' }}>
          <tr>
            {/* Checkbox column */}
            <th
              style={{
                width: '48px',
                padding: '0 16px',
                borderBottom: '1px solid var(--border)',
                height: '48px',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onSelectAll(allSelected ? [] : items.map(i => i.id))}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: 'var(--accent)',
                    display: 'block',
                    margin: 0,
                  }}
                />
              </div>
            </th>

            <SortableTh sortKey="name" currentSort={sort} onSort={handleSort}>
              Name
            </SortableTh>

            <SortableTh sortKey="room" currentSort={sort} onSort={handleSort}>
              Location
            </SortableTh>

            <StaticTh>Tags / Categories</StaticTh>

            <SortableTh sortKey="fill" currentSort={sort} onSort={handleSort}>
              Fill
            </SortableTh>

            <StaticTh>Img</StaticTh>

            {/* Spacer — pushes actions to the right */}
            <th
              style={{
                width: '100%',
                borderBottom: '1px solid var(--border)',
              }}
            />

            <StaticTh style={{ textAlign: 'right' }}>Actions</StaticTh>
          </tr>
        </thead>

        <tbody>
          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={8}
                style={{
                  padding: '64px 24px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                No items found
              </td>
            </tr>
          )}

          {sorted.map((item) => {
            const primaryName = item.names.find(n => n.is_primary)?.name
              || item.names[0]?.name
              || 'Unnamed'
            const aliases = item.names.filter(n => !n.is_primary)
            const isSelected = selectedIds.includes(item.id)

            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                  transition: 'background 100ms ease',
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--bg-secondary)'
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent'
                }}
              >
                {/* Checkbox */}
                <td style={{ padding: '0 16px', verticalAlign: 'middle' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelect(item.id)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                        accentColor: 'var(--accent)',
                        display: 'block',
                        margin: 0,
                      }}
                    />
                  </div>
                </td>

                {/* Name */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {primaryName}
                  </p>
                  {aliases.length > 0 && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      margin: '2px 0 0 0',
                    }}>
                      {aliases.map(n => n.name).join(', ')}
                    </p>
                  )}
                </td>

                {/* Location */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    whiteSpace: 'nowrap',
                  }}>
                    {item.room?.name || '—'}
                  </p>
                  {(item.shelf || item.level_or_drawer) && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      margin: '2px 0 0 0',
                      whiteSpace: 'nowrap',
                    }}>
                      {[item.shelf, item.level_or_drawer].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </td>

                {/* Tags / Categories */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {item.categories.map(c => (
                      <Badge key={c.id} variant="active">{c.name}</Badge>
                    ))}
                    {item.tags.map(t => (
                      <Badge key={t.id}>{t.name}</Badge>
                    ))}
                  </div>
                </td>

                {/* Fill level */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <FillBar level={item.fill_level} />
                </td>

                {/* Image placeholder */}
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <button
                    disabled
                    title="Add image (coming soon)"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'not-allowed',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '16px',
                      color: 'var(--text-muted)',
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ⊕
                  </button>
                </td>

                {/* Spacer — absorbs remaining space */}
                <td style={{ width: '100%' }} />

                {/* Actions — always on the right */}
                <td
                  style={{
                    padding: '8px 16px',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onClone(item.id)}
                    >
                      Clone
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}