import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Cuándo cargar el mp4 del hero: nunca en el prerender ni con
 *  prefers-reduced-motion, nunca en móvil (628 KB que compiten con el LCP), y
 *  en escritorio recién después de `load`. Hasta entonces se ve el póster,
 *  que es una <img> precargada: el LCP es esa imagen, no un video a medio
 *  bajar (spec de Ariel, 16-oct-2026, PR 4; medido LCP 5,3 s → objetivo < 2,5 s). */
function useCargarVideoHero(reduced: boolean | null) {
  const [conVideo, setConVideo] = useState(false)
  useEffect(() => {
    if (reduced) return
    if (typeof window === 'undefined' || window.__PRERENDER_INJECTED || navigator.webdriver) return
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    const arrancar = () => setConVideo(true)
    if (document.readyState === 'complete') {
      const id = window.setTimeout(arrancar, 300)
      return () => window.clearTimeout(id)
    }
    window.addEventListener('load', arrancar, { once: true })
    return () => window.removeEventListener('load', arrancar)
  }, [reduced, conVideo])
  return conVideo
}

/** Video a sangre del encabezado (el mismo de la web de empresas). Con
 *  prefers-reduced-motion se queda quieto en el póster. */
export function HeroVideo({ className = 'object-[0%_50%]' }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const conVideo = useCargarVideoHero(reduced)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    // `muted` como propiedad: sin ella algunos navegadores no lo arrancan solo.
    video.muted = true
    if (reduced) {
      video.pause()
      return
    }
    video.play().catch(() => {})
  }, [reduced, conVideo])

  return (
    <>
    <img
      src="/videos/hero-gtc-poster.webp"
      alt=""
      className={`ed-hero-video absolute inset-0 w-full h-full object-cover ${className}`}
      decoding="async"
      aria-hidden="true"
    />
    {conVideo && (
      <video
        ref={ref}
        className={`ed-hero-video absolute inset-0 w-full h-full object-cover ${className}`}
        src="/videos/hero-gtc.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
    )}
    </>
  )
}
