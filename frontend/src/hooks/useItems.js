import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { itemsApi } from '../api/items'

// Helper — read array of ints from URL param: "1,2,3" → [1,2,3]
const getIds = (params, key) => {
  const val = params.get(key)
  if (!val) return []
  return val.split(',').map(Number).filter(Boolean)
}

// Helper — write array to URL param: [1,2,3] → "1,2,3"
const setIds = (params, key, ids) => {
  if (!ids || ids.length === 0) {
    params.delete(key)
  } else {
    params.set(key, ids.join(','))
  }
}

export function useItems() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const categoryIds = getIds(searchParams, 'category_ids')
  const tagIds = getIds(searchParams, 'tag_ids')
  const roomIds = getIds(searchParams, 'room_ids')
  const skip = parseInt(searchParams.get('skip') || '0')
  const limit = parseInt(
    searchParams.get('limit') ||
    (window.innerWidth < 768 ? '10' : '50')
  )

  const fetchItems = useCallback(() => {
    setLoading(true)
    const params = { skip, limit }
    if (search) params.search = search

    // Backend currently supports single IDs — we filter client-side
    // for multi-select until we extend the backend in a future update
    itemsApi.getAll(params)
      .then(data => {
        let filtered = data.items

        if (categoryIds.length > 0) {
          filtered = filtered.filter(item =>
            item.categories.some(c => categoryIds.includes(c.id))
          )
        }
        if (tagIds.length > 0) {
          filtered = filtered.filter(item =>
            item.tags.some(t => tagIds.includes(t.id))
          )
        }
        if (roomIds.length > 0) {
          filtered = filtered.filter(item =>
            roomIds.includes(item.room_id)
          )
        }

        setItems(filtered)
        setTotal(data.total)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [search, categoryIds.join(','), tagIds.join(','), roomIds.join(','), skip, limit])

  useEffect(() => { fetchItems() }, [fetchItems])

  const setFilter = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (key === 'categoryIds') setIds(next, 'category_ids', value)
      else if (key === 'tagIds') setIds(next, 'tag_ids', value)
      else if (key === 'roomIds') setIds(next, 'room_ids', value)
      else if (value) next.set(key, value)
      else next.delete(key)
      next.delete('skip')
      return next
    })
  }

  const clearFilters = () => setSearchParams({})

  const createItem = async (data) => {
    const item = await itemsApi.create(data)
    fetchItems()
    return item
  }

  const updateItem = async (id, data) => {
    const item = await itemsApi.update(id, data)
    fetchItems()
    return item
  }

  const deleteItem = async (id) => {
    await itemsApi.delete(id)
    fetchItems()
  }

  const cloneItem = async (id) => {
    const item = await itemsApi.clone(id)
    fetchItems()
    return item
  }

  const bulkDelete = async (ids) => {
    await itemsApi.bulkDelete(ids)
    fetchItems()
  }

  return {
    items, total, loading, error,
    search, categoryIds, tagIds, roomIds, skip, limit,
    setFilter, clearFilters,
    createItem, updateItem, deleteItem, cloneItem, bulkDelete,
    refresh: fetchItems,
  }
}