import { Badge } from '../ui/Badge'

export function ActiveFilterChips({
  search, categoryId, tagId, roomId,
  categories, tags, rooms,
  onRemove, onClearAll
}) {
  const chips = []

  if (search) chips.push({
    key: 'search',
    label: `"${search}"`,
  })
  if (categoryId) {
    const cat = categories.find(c => c.id === parseInt(categoryId))
    chips.push({ key: 'category_id', label: `Category: ${cat?.name || categoryId}` })
  }
  if (tagId) {
    const tag = tags.find(t => t.id === parseInt(tagId))
    chips.push({ key: 'tag_id', label: `Tag: ${tag?.name || tagId}` })
  }
  if (roomId) {
    const room = rooms.find(r => r.id === parseInt(roomId))
    chips.push({ key: 'room_id', label: `Room: ${room?.name || roomId}` })
  }

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
          onRemove={() => onRemove(chip.key)}
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