import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '@/hooks/useT'

const CLAVE = 'gtc-cookies'
export const EVENTO_ABRIR_AVISO_COOKIES = 'gtc:abrir-aviso-cookies'

type Eleccion = 'aceptadas' | 'rechazadas'

function leerEleccion(): Eleccion | null {
  try {
    const v = localStorage.getItem(CLAVE)
    return v === 'aceptadas' || v === 'rechazadas' ? v : null
  } catch {
    return null
  }
}

function guardarEleccion(v: Eleccion) {
  try {
    localStorage.setItem(CLAVE, v)
  } catch {
    // Sin almacenamiento el aviso vuelve a salir en la próxima visita: es lo correcto.
  }
}

// Aviso de cookies (LSSI art. 22.2 + guía de cookies de la AEPD): la medición y la
// publicidad (GA4/Ads, LinkedIn, Meta) no se cargan hasta que la persona acepta, y
// rechazar está al mismo nivel que aceptar. Vercel Analytics no usa cookies y queda fuera.
export function AvisoCookies() {
  const t = useT()
  // Visible desde el primer render si no hay elección guardada: así el HTML
  // prerenderizado ya lo trae y no aparece con el JS (era el LCP en móvil,
  // medido el 16-oct-2026). Quien ya eligió lo ve desaparecer al hidratar.
  const [visible, setVisible] = useState(() => (typeof window === 'undefined' ? false : leerEleccion() === null))

  useEffect(() => {
    const abrir = () => setVisible(true)
    window.addEventListener(EVENTO_ABRIR_AVISO_COOKIES, abrir)
    return () => window.removeEventListener(EVENTO_ABRIR_AVISO_COOKIES, abrir)
  }, [])

  const aceptar = () => {
    guardarEleccion('aceptadas')
    window.__gtcCargarMedicion?.()
    setVisible(false)
  }

  const rechazar = () => {
    const habiaAceptado = leerEleccion() === 'aceptadas'
    guardarEleccion('rechazadas')
    setVisible(false)
    // Si ya estaban cargadas, recargar es la única forma de descargarlas.
    if (habiaAceptado) window.location.reload()
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('cookies_titulo')}
      className="fixed inset-x-0 bottom-0 z-[60] bg-cream border-t border-[rgba(6,46,85,.16)] px-6 lg:px-10 py-5"
      style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <p className="font-body text-[14px] leading-relaxed text-ink-soft md:flex-1">
          <span className="text-ink font-bold">{t('cookies_titulo')}. </span>
          {t('cookies_texto')}{' '}
          <Link to="/politica-de-privacidad" className="underline text-ink hover:text-coral">
            {t('cookies_mas_info')}
          </Link>
        </p>
        <div className="flex gap-3 flex-wrap">
          <button type="button" onClick={rechazar} className="ed-btn ed-btn-outline !py-3 !px-6">
            {t('cookies_rechazar')}
          </button>
          <button type="button" onClick={aceptar} className="ed-btn ed-btn-primary !py-3 !px-6">
            {t('cookies_aceptar')}
          </button>
        </div>
      </div>
    </div>
  )
}
