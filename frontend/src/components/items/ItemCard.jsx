import { useState } from 'react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

function FillBar({ level }) {
  if (level == null) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        flex: 1,
        height: '4px',
        borderRadius: '2px',
        background: 'var(--bg-tertiary)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          borderRadius: '2px',
          width: `${level * 100}%`,
          background: 'var(--text-primary)',
        }} />
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

function DetailRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.05em',
        color: 'var(--text-muted)',
        margin: 0,
      }}>
        {label}
      </p>
      {children}
    </div>
  )
}

export function ItemCard({
  item,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onClone,
}) {
  const [expanded, setExpanded] = useState(false)

  const primaryName = item.names.find(n => n.is_primary)?.name
    || item.names[0]?.name
    || 'Unnamed'
  const aliases = item.names.filter(n => !n.is_primary)

  return (
    <div style={{
      border: '1px solid',
      borderColor: selected ? 'var(--border-strong)' : 'var(--border)',
      borderRadius: 'var(--radius-md)',
      background: selected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
      overflow: 'hidden',
      transition: 'border-color 150ms ease, background 150ms ease',
      // Left and right margin so card doesn't touch screen edges
      marginLeft: '2px',
      marginRight: '2px',
    }}>

      {/* ── Card header — always visible ─────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',   // equal padding on both sides
      }}>

        {/* Checkbox — padding keeps it off the left edge */}
        <div style={{ flexShrink: 0, paddingLeft: '2px' }}>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(item.id)}
            onClick={e => e.stopPropagation()}
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

        {/* Name + location — takes remaining space */}
        <div
          style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
          onClick={() => setExpanded(e => !e)}
        >
          <p style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {primaryName}
          </p>
          {item.room && (
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              margin: '2px 0 0 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {item.room.name}
              {item.shelf ? ` · ${item.shelf}` : ''}
            </p>
          )}
        </div>

        {/* Category badges — only on wider mobile screens */}
        {!expanded && item.categories.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '4px',
            flexShrink: 0,
            maxWidth: '120px',
            overflow: 'hidden',
          }}>
            {item.categories.slice(0, 1).map(c => (
              <Badge key={c.id} variant="active">{c.name}</Badge>
            ))}
          </div>
        )}

        {/* Expand toggle — padding keeps it off the right edge */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '16px',
            color: 'var(--text-muted)',
            padding: '4px 6px',     // right padding so it doesn't hug the wall
            marginRight: '-2px',    // optical alignment
            lineHeight: 1,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 200ms ease, color 150ms ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          ∨
        </button>
      </div>

      {/* ── Expanded content ──────────────────────── */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '16px 16px 0 16px',   // no bottom padding — actions have their own
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>

          {/* Aliases */}
          {aliases.length > 0 && (
            <DetailRow label="Also known as">
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                {aliases.map(n => n.name).join(', ')}
              </p>
            </DetailRow>
          )}

          {/* Location */}
          {(item.room || item.shelf || item.level_or_drawer) && (
            <DetailRow label="Location">
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                {[item.room?.name, item.shelf, item.level_or_drawer]
                  .filter(Boolean)
                  .join(' → ')}
              </p>
            </DetailRow>
          )}

          {/* Fill level */}
          {item.fill_level != null && (
            <DetailRow label="Fill level">
              <FillBar level={item.fill_level} />
            </DetailRow>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <DetailRow label="Tags">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {item.tags.map(t => <Badge key={t.id}>{t.name}</Badge>)}
              </div>
            </DetailRow>
          )}

          {/* Categories */}
          {item.categories.length > 0 && (
            <DetailRow label="Categories">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {item.categories.map(c => (
                  <Badge key={c.id} variant="active">{c.name}</Badge>
                ))}
              </div>
            </DetailRow>
          )}

          {/* Comments */}
          {item.comments && (
            <DetailRow label="Comments">
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                {item.comments}
              </p>
            </DetailRow>
          )}

          {/* Image placeholder */}
          <div style={{
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            textAlign: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}>
              ⊕ image (coming soon)
            </span>
          </div>

          {/* Actions — bottom padding here gives space below buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            paddingBottom: '16px',   // space below the action buttons
            paddingTop: '4px',
            borderTop: '1px solid var(--border)',
            marginTop: '4px',
          }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(item)}
              style={{ flex: 1 }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onClone(item.id)}
              style={{ flex: 1 }}
            >
              Clone
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(item.id)}
              style={{ flex: 1 }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}