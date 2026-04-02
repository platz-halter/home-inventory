import { Button } from '../ui/Button'

export function BulkActions({ selectedIds, onDelete, onClear }) {
  if (selectedIds.length === 0) return null

  return (
    <div
      className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-30
                 flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]
                 border shadow-lg"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-strong)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
      }}
    >
      <span
        className="font-mono text-xs"
        style={{ color: 'var(--text-secondary)' }}
      >
        {selectedIds.length} selected
      </span>
      <div className="w-px h-4" style={{ background: 'var(--border)' }} />
      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(selectedIds)}
      >
        Delete selected
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Cancel
      </Button>
    </div>
  )
}