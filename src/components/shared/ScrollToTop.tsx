import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Al cambiar de página vuelve arriba. Si la URL trae un ancla (/#proceso desde
// el header o el footer), espera a que la página monte y baja hasta la sección.
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = hash.slice(1)
    let intentos = 0
    const timer = window.setInterval(() => {
      const el = document.getElementById(id)
      intentos += 1
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.clearInterval(timer)
      } else if (intentos > 20) {
        window.clearInterval(timer)
      }
    }, 50)
    return () => window.clearInterval(timer)
  }, [pathname, hash])
  return null
}
