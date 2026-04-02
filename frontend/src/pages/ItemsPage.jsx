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
  const { tags, createTag } = useTags()
  const { categories } = useCategories()
  const isMobile = useIsMobile()

  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [localTags, setLocalTags] = useState([])

  // Keep localTags synced with fetched tags
  useEffect(() => { setLocalTags(tags) }, [tags])

  const [searchParams] = useSearchParams()

  // Handle ?new=true from keyboard shortcut — works on any page
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
    }
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
    <div className="flex flex-col gap-5">

      {/* ── Page header ───────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Inventory
          <span className="ml-2">({total})</span>
        </h1>
      </div>

      {/* ── Search + filter + add in one row ──────── */}
      <div className="flex items-center gap-2">
        <SearchBar
          value={search}
          onChange={val => setFilter('search', val)}
        />
        <Button
          variant={activeFilterCount > 0 ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setShowFilter(f => !f)}
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </Button>
        {/* Add button on same row as search */}
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
        <FilterPanel
          rooms={rooms}
          tags={localTags}
          categories={categories}
          onFilter={setFilter}
          current={{ roomIds, categoryIds, tagIds }}
        />
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
        <p className="text-xs font-mono" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}

      {/* ── Loading ───────────────────────────────── */}
      {loading && (
        <div className="py-16 text-center">
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            Loading...
          </p>
        </div>
      )}

      {/* ── Item list ─────────────────────────────── */}
      {!loading && (
        isMobile ? (
          <div className="flex flex-col gap-2">
            {items.length === 0 && (
              <div className="py-16 text-center">
                <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                  No items found
                </p>
                <p className="font-mono text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Press <kbd className="border border-[var(--border)] px-1 rounded">N</kbd> to add one
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
          <div
            className="overflow-hidden rounded-[var(--radius-md)]"
            style={{ border: '1px solid var(--border)' }}
          >
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

      {/* ── Pagination ────────────────────────────── */}
      {!loading && total > limit && (
        <div className="flex items-center justify-between pt-2">
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {skip + 1}–{Math.min(skip + limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost" size="sm"
              disabled={skip === 0}
              onClick={() => setFilter('skip', Math.max(0, skip - limit))}
            >
              ← Prev
            </Button>
            <Button
              variant="ghost" size="sm"
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