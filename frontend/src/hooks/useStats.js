import { useState, useEffect } from 'react'
import { statsApi } from '../api/stats'

export function useStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    statsApi.get()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading }
}