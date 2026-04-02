import { useState, useEffect } from 'react'
import { tagsApi } from '../api/tags'

export function useTags() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tagsApi.getAll()
      .then(setTags)
      .finally(() => setLoading(false))
  }, [])

  const createTag = async (data) => {
    const tag = await tagsApi.create(data)
    setTags(prev => [...prev, tag])
    return tag
  }

  const deleteTag = async (id) => {
    await tagsApi.delete(id)
    setTags(prev => prev.filter(t => t.id !== id))
  }

  return { tags, loading, createTag, deleteTag }
}