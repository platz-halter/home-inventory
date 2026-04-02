import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { itemsApi } from '../api/items'

export function useItems() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters live in the URL — this makes them persistent and shareable
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('category_id') || null
  const tagId = searchParams.get('tag_id') || null
  const roomId = searchParams.get('room_id') || null
  const skip = parseInt(searchParams.get('skip') || '0')
  // Fewer items per page on mobile — detected by window width
  const limit = parseInt(
    searchParams.get('limit') ||
    (window.innerWidth < 768 ? '10' : '50')
  )

  // fetchItems is wrapped in useCallback so it doesn't change on every render
  const fetchItems = useCallback(() => {
    setLoading(true)
    const params = { skip, limit }
    if (search) params.search = search
    if (categoryId) params.category_id = categoryId
    if (tagId) params.tag_id = tagId
    if (roomId) params.room_id = roomId

    itemsApi.getAll(params)
      .then(data => {
        setItems(data.items)
        setTotal(data.total)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [search, categoryId, tagId, roomId, skip, limit])

  useEffect(() => { fetchItems() }, [fetchItems])

  // Filter setters — update URL params, triggers refetch automatically
  const setFilter = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      next.delete('skip') // reset pagination on filter change
      return next
    })
  }

  const clearFilters = () => setSearchParams({})

  // Item actions
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
    // Data
    items, total, loading, error,
    // Active filters
    search, categoryId, tagId, roomId, skip, limit,
    // Filter actions
    setFilter, clearFilters,
    // Item actions
    createItem, updateItem, deleteItem, cloneItem, bulkDelete,
    // Manual refresh
    refresh: fetchItems,
  }
}