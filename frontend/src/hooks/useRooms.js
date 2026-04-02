import { useState, useEffect } from 'react'
import { roomsApi } from '../api/rooms'

// Why no delete option?
// Why no error in other hooks?

export function useRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    roomsApi.getAll()
      .then(setRooms)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const createRoom = async (data) => {
    const room = await roomsApi.create(data)
    setRooms(prev => [...prev, room])
    return room
  }

  return { rooms, loading, error, createRoom }
}