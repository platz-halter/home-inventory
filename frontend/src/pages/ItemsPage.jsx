import { useState } from 'react'
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
    search, categoryId, tagId, roomId, skip, limit,
    setFilter, clearFilters,
    createItem, updateItem, deleteItem, cloneItem, bulkDelete,
  } = useItems()

  const { rooms } = useRooms()
  const { tags } = useTags()
  const { categories } = useCategories()

  const isMobile = useIsMobile()

  // Modal state
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [showFilter, setShowFilter] = useState(false)

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState([])

  const [searchParams] = useSearchParams()

  // Open form if ?new=true in URL (from keyboard shortcut)
  useState(() => {
    if (searchParams.get('new') === 'true') setShowForm(true)
  })

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

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

  const activeFilterCount = [search, categoryId, tagId, roomId]
    .filter(Boolean).length

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Inventory
          <span className="ml-2" style={{ color: 'var(--text-muted)' }}>
            ({total})
          </span>
        </h1>
        <Button onClick={() => setShowForm(true)} size="sm">
          + New item
        </Button>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-2">
        <SearchBar
          value={search}
          onChange={val => setFilter('search', val)}
        />
        <Button
          variant={activeFilterCount > 0 ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setShowFilter(f => !f)}
        >
          Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </Button>
      </div>

      {/* Filter panel — toggleable */}
      {showFilter && (
        <FilterPanel
          rooms={rooms}
          tags={tags}
          categories={categories}
          onFilter={setFilter}
          current={{ roomId, categoryId, tagId }}
        />
      )}

      {/* Active filter chips */}
      <ActiveFilterChips
        search={search}
        categoryId={categoryId}
        tagId={tagId}
        roomId={roomId}
        categories={categories}
        tags={tags}
        rooms={rooms}
        onRemove={(key) => setFilter(key, null)}
        onClearAll={clearFilters}
      />

      {/* Error */}
      {error && (
        <p
          className="text-xs font-mono"
          style={{ color: 'var(--danger)' }}
        >
          {error}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <p
          className="text-xs font-mono py-8 text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          Loading...
        </p>
      )}

      {/* Item list — table on desktop, cards on mobile */}
      {!loading && (
        isMobile ? (
          <div className="flex flex-col gap-2">
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
          <div className="card overflow-hidden">
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

      {/* Pagination */}
      {!loading && total > limit && (
        <div className="flex items-center justify-between">
          <p
            className="font-mono text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {skip + 1}–{Math.min(skip + limit, total)} of {total}
          </p>
          <div className="flex gap-2">
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

      {/* Bulk actions bar */}
      <BulkActions
        selectedIds={selectedIds}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedIds([])}
      />

      {/* Add / Edit modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editItem ? 'Edit item' : 'New item'}
        footer={null}  // Footer is inside ItemForm
      >
        <ItemForm
          initial={editItem}
          rooms={rooms}
          tags={tags}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          submitLabel={editItem ? 'Save changes' : 'Add item'}
          showAddAnother={!editItem}
          onSubmitAndAnother={() => setShowForm(true)}
        />
      </Modal>
    </div>
  )
}