import { useEffect, useRef, useState } from 'react'

// Contenido visible por defecto (spec de Ariel, 16-oct-2026, PR 4): lo que al
// montar ya está en la primera pantalla no se oculta nunca; lo que está por
// debajo entra cuando el observador lo detecta. Sin animación con
// prefers-reduced-motion ni en el prerender (navigator.webdriver).
export function useScrollReveal<T extends HTMLElement>(threshold = 0.05) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof navigator !== 'undefined' && (navigator.webdriver || window.__PRERENDER_INJECTED)) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top <= window.innerHeight) return

    setIsVisible(false)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}
