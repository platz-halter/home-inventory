import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import { useRooms } from '../hooks/useRooms'
import { useTags } from '../hooks/useTags'
import { useCategories } from '../hooks/useCategories'
import { ItemTable } from '../components/items/ItemTable'
import { ItemCard } from '../components/items/ItemCard'
import { ItemForm } from '../components/items/ItemForm'
import { BulkActions } from '../components/items/BulkActions'
import { SearchBar } from '../components/filters/SearchBar'
import { FilterPanel } from '../components/filters/FilterPanel'
import { ActiveFilterChips } from '../components/filters/ActiveFilterChips'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { useIsMobile } from '../hooks/useIsMobile'

export function ItemsPage() {
  const {
    items, total, loading, error,
    search, categoryIds, tagIds, roomIds, skip, limit,
    setFilter, clearFilters,
    createItem, updateItem, deleteItem, cloneItem, bulkDelete,
  } = useItems()

  const { rooms } = useRooms()
  const { tags } = useTags()
  const { categories } = useCategories()
  const isMobile = useIsMobile()

  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [localTags, setLocalTags] = useState([])

  useEffect(() => { setLocalTags(tags) }, [tags])

  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('new') === 'true') setShowForm(true)
  }, [searchParams])

  useEffect(() => {
    const handler = () => setShowForm(true)
    window.addEventListener('open-new-item-form', handler)
    return () => window.removeEventListener('open-new-item-form', handler)
  }, [])

  const handleSelect = (id) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  const handleEdit = (item) => {
    setEditItem(item)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditItem(null)
  }

  const handleSubmit = async (data) => {
    if (editItem) {
      await updateItem(editItem.id, data)
    } else {
      await createItem(data)
    }
    handleCloseForm()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    await deleteItem(id)
    setSelectedIds(prev => prev.filter(x => x !== id))
  }

  const handleBulkDelete = async (ids) => {
    if (!confirm(`Delete ${ids.length} items?`)) return
    await bulkDelete(ids)
    setSelectedIds([])
  }

  const handleTagCreated = (newTag) => {
    setLocalTags(prev => [...prev, newTag])
  }

  const activeFilterCount = [
    search, ...categoryIds, ...tagIds, ...roomIds
  ].filter(Boolean).length

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      // Extra horizontal breathing room inside the layout padding
      paddingLeft: '8px',
      paddingRight: '8px',
    }}>

      {/* ── Page header ───────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          Inventory
          <span style={{ marginLeft: '8px' }}>({total})</span>
        </h1>
      </div>

      {/* ── Search + Filter + New Item ────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{ flex: 1 }}>
          <SearchBar
            value={search}
            onChange={val => setFilter('search', val)}
          />
        </div>

        <Button
          variant={activeFilterCount > 0 ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setShowFilter(f => !f)}
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </Button>

        <Button
          size="sm"
          onClick={() => setShowForm(true)}
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          + New item
        </Button>
      </div>

      {/* ── Filter panel ──────────────────────────── */}
      {showFilter && (
        <div style={{ marginTop: '-8px' }}>
          <FilterPanel
            rooms={rooms}
            tags={localTags}
            categories={categories}
            onFilter={setFilter}
            current={{ roomIds, categoryIds, tagIds }}
          />
        </div>
      )}

      {/* ── Active filter chips ───────────────────── */}
      <ActiveFilterChips
        search={search}
        categoryIds={categoryIds}
        tagIds={tagIds}
        roomIds={roomIds}
        categories={categories}
        tags={localTags}
        rooms={rooms}
        onRemove={(key, id) => {
          if (key === 'search') setFilter('search', null)
          else {
            const current = key === 'categoryIds' ? categoryIds
              : key === 'tagIds' ? tagIds : roomIds
            setFilter(key, current.filter(x => x !== id))
          }
        }}
        onClearAll={clearFilters}
      />

      {/* ── Error ─────────────────────────────────── */}
      {error && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--danger)',
          margin: 0,
        }}>
          {error}
        </p>
      )}

      {/* ── Loading ───────────────────────────────── */}
      {loading && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            Loading...
          </p>
        </div>
      )}

      {/* ── Item list ─────────────────────────────── */}
      {!loading && (
        isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.length === 0 && (
              <div style={{ padding: '64px 0', textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  margin: '0 0 8px 0',
                }}>
                  No items found
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  margin: 0,
                }}>
                  Press N to add one
                </p>
              </div>
            )}
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                selected={selectedIds.includes(item.id)}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClone={cloneItem}
              />
            ))}
          </div>
        ) : (
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <ItemTable
              items={items}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={setSelectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClone={cloneItem}
            />
          </div>
        )
      )}

      {/* ── Empty state (desktop) ─────────────────── */}
      {!loading && items.length === 0 && !isMobile && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: '0 0 8px 0',
          }}>
            No items found
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            Press{' '}
            <kbd style={{
              border: '1px solid var(--border)',
              borderRadius: '3px',
              padding: '1px 6px',
              fontSize: '11px',
            }}>
              N
            </kbd>
            {' '}to add your first item
          </p>
        </div>
      )}

      {/* ── Pagination ────────────────────────────── */}
      {!loading && total > limit && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid var(--border)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            {skip + 1}–{Math.min(skip + limit, total)} of {total}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="ghost"
              size="sm"
              disabled={skip === 0}
              onClick={() => setFilter('skip', Math.max(0, skip - limit))}
            >
              ← Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={skip + limit >= total}
              onClick={() => setFilter('skip', skip + limit)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* ── Bulk actions ──────────────────────────── */}
      <BulkActions
        selectedIds={selectedIds}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedIds([])}
      />

      {/* ── Add / Edit modal ──────────────────────── */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editItem ? 'Edit item' : 'New item'}
      >
        <ItemForm
          initial={editItem}
          rooms={rooms}
          tags={localTags}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          submitLabel={editItem ? 'Save changes' : 'Add item'}
          showAddAnother={!editItem}
          onSubmitAndAnother={() => setShowForm(true)}
          onTagCreated={handleTagCreated}
        />
      </Modal>
    </div>
  )
}