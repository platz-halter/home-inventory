import { useState } from 'react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

// Fill level shown as a small visual bar
function FillBar({ level }) {
  if (level == null) return null
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${level * 100}%`,
            background: 'var(--text-primary)'
          }}
        />
      </div>
      <span
        className="font-mono text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {Math.round(level * 100)}%
      </span>
    </div>
  )
}

export function ItemCard({
  item,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onClone
}) {
  const [expanded, setExpanded] = useState(false)
  const primaryName = item.names.find(n => n.is_primary)?.name
    || item.names[0]?.name
    || 'Unnamed'
  const aliases = item.names.filter(n => !n.is_primary)

  return (
    <div
      className="card transition-all duration-150"
      style={{
        borderColor: selected ? 'var(--border-strong)' : 'var(--border)',
        background: selected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
      }}
    >
      {/* Card header — always visible */}
      <div className="flex items-center gap-3 p-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(item.id)}
          onClick={e => e.stopPropagation()}
          className="flex-shrink-0 cursor-pointer"
        />

        {/* Name + location summary */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setExpanded(e => !e)}
        >
          <p
            className="text-sm font-medium truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {primaryName}
          </p>
          {item.room && (
            <p
              className="text-xs truncate"
              style={{ color: 'var(--text-muted)' }}
            >
              {item.room.name}
              {item.shelf ? ` · ${item.shelf}` : ''}
            </p>
          )}
        </div>

        {/* Category badges — collapsed view */}
        {!expanded && item.categories.length > 0 && (
          <div className="hidden sm:flex gap-1 flex-shrink-0">
            {item.categories.slice(0, 2).map(c => (
              <Badge key={c.id}>{c.name}</Badge>
            ))}
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-shrink-0 font-mono text-base transition-transform duration-200"
          style={{
            color: 'var(--text-muted)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          ∨
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div
          className="border-t px-3 pb-3 pt-3 flex flex-col gap-3"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Aliases */}
          {aliases.length > 0 && (
            <div>
              <p
                className="font-mono text-xs mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Also known as
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {aliases.map(n => n.name).join(', ')}
              </p>
            </div>
          )}

          {/* Location details */}
          {(item.room || item.shelf || item.level_or_drawer) && (
            <div>
              <p
                className="font-mono text-xs mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Location
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {[item.room?.name, item.shelf, item.level_or_drawer]
                  .filter(Boolean)
                  .join(' → ')}
              </p>
            </div>
          )}

          {/* Fill level */}
          {item.fill_level != null && (
            <div>
              <p
                className="font-mono text-xs mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Fill level
              </p>
              <FillBar level={item.fill_level} />
            </div>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div>
              <p
                className="font-mono text-xs mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Tags
              </p>
              <div className="flex flex-wrap gap-1">
                {item.tags.map(t => <Badge key={t.id}>{t.name}</Badge>)}
              </div>
            </div>
          )}

          {/* Categories */}
          {item.categories.length > 0 && (
            <div>
              <p
                className="font-mono text-xs mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Categories
              </p>
              <div className="flex flex-wrap gap-1">
                {item.categories.map(c => (
                  <Badge key={c.id} variant="active">{c.name}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {item.comments && (
            <div>
              <p
                className="font-mono text-xs mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Comments
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.comments}
              </p>
            </div>
          )}

          {/* Image placeholder */}
          <div
            className="border border-dashed rounded-[var(--radius-sm)] p-3 flex items-center justify-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              ⊕ image (coming soon)
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>
              Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onClone(item.id)}>
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
        </div>
      )}
    </div>
  )
}