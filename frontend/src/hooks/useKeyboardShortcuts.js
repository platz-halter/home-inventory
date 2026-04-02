import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export function useKeyboardShortcuts(onNewItem = null) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case 'n':
        case 'N':
          e.preventDefault()
          if (onNewItem) {
            // If caller provided a direct handler, use it
            onNewItem()
          } else if (location.pathname === '/items') {
            // Already on items page — dispatch a custom event
            window.dispatchEvent(new CustomEvent('open-new-item-form'))
          } else {
            navigate('/items?new=true')
          }
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, location, onNewItem])
}