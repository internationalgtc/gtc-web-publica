import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Video a sangre del encabezado (el mismo de la web de empresas). Con
 *  prefers-reduced-motion se queda quieto en el póster. */
export function HeroVideo({ className = 'object-[0%_50%]' }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

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
  }, [reduced])

  return (
    <video
      ref={ref}
      className={`ed-hero-video absolute inset-0 w-full h-full object-cover ${className}`}
      src="/videos/hero-gtc.mp4"
      poster="/videos/hero-gtc-poster.webp"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
