import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

// Entradas del sistema editorial.
//
// CONTENIDO VISIBLE POR DEFECTO (spec de Ariel, 16-oct-2026, PR 4). Antes cada
// bloque nacía con opacity: 0 y aparecía al hacer scroll: Lighthouse medía
// LCP 7,5 s porque no había nada que medir hasta que terminaba la animación,
// y el HTML prerenderizado llevaba 56 bloques invisibles en la portada.
//
// Ahora todo se renderiza visible. La animación es un extra que se aplica solo
// a los bloques que al montar están POR DEBAJO de la primera pantalla: esos se
// ocultan (nadie los ve todavía) y entran cuando el observador los detecta.
// El hero y la primera pantalla nunca se ocultan. Con prefers-reduced-motion
// o en el prerender (navigator.webdriver) no se anima nada.
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const INSTANTANEO = { duration: 0 }

/** true solo si el bloque arranca fuera de la primera pantalla y se puede animar. */
function useAnimable<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const reduced = useReducedMotion()
  const [animable, setAnimable] = useState(false)
  useEffect(() => {
    if (reduced) return
    if (typeof navigator !== 'undefined' && (navigator.webdriver || window.__PRERENDER_INJECTED)) return
    const el = ref.current
    if (!el) return
    if (el.getBoundingClientRect().top > window.innerHeight) setAnimable(true)
  }, [reduced, ref])
  return animable
}

export function Reveal({ children, className, delay = 0, y = 36 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const animable = useAnimable(ref)
  const enVista = useInView(ref, { once: true, margin: '-12% 0px' })
  const oculto = animable && !enVista
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={oculto ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={oculto ? INSTANTANEO : { duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const animable = useAnimable(ref)
  const enVista = useInView(ref, { once: true, margin: '-10% 0px' })
  const oculto = animable && !enVista
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={oculto ? 'hidden' : 'show'}
      variants={{ hidden: { transition: INSTANTANEO }, show: { transition: { staggerChildren: 0.07 } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40, transition: INSTANTANEO },
        show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}
