import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { itemsApi } from '../api/items'

const getIds = (params, key) => {
  const val = params.get(key)
  if (!val) return []
  return val.split(',').map(Number).filter(Boolean)
}

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

    // Build params — pass everything to backend
    const params = { skip, limit }
    if (search) params.search = search
    // Send as comma-separated strings matching the backend query param
    if (categoryIds.length > 0) params.category_ids = categoryIds.join(',')
    if (tagIds.length > 0) params.tag_ids = tagIds.join(',')
    if (roomIds.length > 0) params.room_ids = roomIds.join(',')

    itemsApi.getAll(params)
      .then(data => {
        setItems(data.items)
        setTotal(data.total)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [
    search,
    categoryIds.join(','),
    tagIds.join(','),
    roomIds.join(','),
    skip,
    limit,
  ])

  useEffect(() => { fetchItems() }, [fetchItems])

  const setFilter = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)

      if (key === 'categoryIds') setIds(next, 'category_ids', value)
      else if (key === 'tagIds') setIds(next, 'tag_ids', value)
      else if (key === 'roomIds') setIds(next, 'room_ids', value)
      else if (value !== null && value !== undefined && value !== '') {
        next.set(key, value)
      } else {
        next.delete(key)
      }

      // Reset pagination when changing filters, not when changing page
      if (key !== 'skip') next.delete('skip')
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