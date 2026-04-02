import { useState, useEffect } from 'react'
import { categoriesApi } from '../api/categories'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoriesApi.getAll()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  const createCategory = async (data) => {
    const category = await categoriesApi.create(data)
    setCategories(prev => [...prev, category])
    return category
  }

  const deleteCategory = async (id) => {
    await categoriesApi.delete(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return { categories, loading, createCategory, deleteCategory }
}