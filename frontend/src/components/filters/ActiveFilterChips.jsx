import { Badge } from '../ui/Badge'

export function ActiveFilterChips({
  search, categoryIds, tagIds, roomIds,
  categories, tags, rooms,
  onRemove, onClearAll,
}) {
  const chips = []

  if (search) chips.push({ key: 'search', label: `"${search}"` })

  categoryIds.forEach(id => {
    const cat = categories.find(c => c.id === id)
    if (cat) chips.push({ key: `category_${id}`, label: `Category: ${cat.name}`,
      remove: () => onRemove('categoryIds', id) })
  })

  tagIds.forEach(id => {
    const tag = tags.find(t => t.id === id)
    if (tag) chips.push({ key: `tag_${id}`, label: `Tag: ${tag.name}`,
      remove: () => onRemove('tagIds', id) })
  })

  roomIds.forEach(id => {
    const room = rooms.find(r => r.id === id)
    if (room) chips.push({ key: `room_${id}`, label: `Room: ${room.name}`,
      remove: () => onRemove('roomIds', id) })
  })

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="text-xs font-mono"
        style={{ color: 'var(--text-muted)' }}
      >
        Filters:
      </span>
      {chips.map(chip => (
        <Badge
          key={chip.key}
          variant="active"
          onRemove={chip.remove || (() => onRemove('search', null))}
        >
          {chip.label}
        </Badge>
      ))}
      {chips.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs font-mono transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.target.style.color = 'var(--danger)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          clear all
        </button>
      )}
    </div>
  )
}