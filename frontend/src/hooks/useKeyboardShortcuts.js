import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      // Don't fire shortcuts when typing in an input
      const tag = document.activeElement?.tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return

      switch (e.key) {
        case 'n':
        case 'N':
          // N — open new item form
          navigate('/items?new=true')
          break
        case '?':
          // ? — show shortcuts modal (we'll add this later)
          console.log('shortcuts modal')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])
}