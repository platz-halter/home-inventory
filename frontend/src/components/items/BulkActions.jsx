import { Button } from '../ui/Button'

export function BulkActions({ selectedIds, onDelete, onClear }) {
  if (selectedIds.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-strong)',
        background: 'var(--bg-secondary)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap',
        minWidth: '320px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          flex: 1,
        }}
      >
        {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
      </span>

      <div
        style={{
          width: '1px',
          height: '20px',
          background: 'var(--border)',
          flexShrink: 0,
        }}
      />

      <Button
        variant="danger"
        size="md"
        onClick={() => onDelete(selectedIds)}
      >
        Delete selected
      </Button>

      <Button variant="ghost" size="md" onClick={onClear}>
        Cancel
      </Button>
    </div>
  )
}