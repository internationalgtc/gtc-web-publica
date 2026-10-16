const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'gclid', 'fbclid'] as const
const STORAGE_KEY = 'gtc_utm'
const LANDING_KEY = 'gtc_landing_url'
const REFERRER_KEY = 'gtc_referrer'

/**
 * De dónde venía la persona, si venía de fuera. Es lo ÚNICO que explica al
 * visitante que llega sin UTM — o sea, casi todos: los UTM solo existen si
 * alguien etiquetó el enlace, y quien busca en Google nunca viene etiquetado.
 * Ese tráfico es el que produce el 98% de los clientes ganados de GTC y hasta
 * el 3-sep-2026 llegaba a Nexus sin ningún origen.
 *
 * Si el referrer es del propio dominio, la persona ya estaba dentro: no informa.
 */
function externalReferrer(): string | null {
  if (typeof document === 'undefined' || !document.referrer) return null
  try {
    const from = new URL(document.referrer).hostname.replace(/^www\./, '')
    const self = window.location.hostname.replace(/^www\./, '')
    return from === self ? null : document.referrer
  } catch {
    return null
  }
}

export function captureUTMs(): void {
  const params = new URLSearchParams(window.location.search)
  const hasUtms = UTM_KEYS.some(k => params.has(k))

  if (hasUtms) {
    const utms: Partial<Record<typeof UTM_KEYS[number], string>> = {}
    for (const key of UTM_KEYS) {
      const val = params.get(key)
      if (val) utms[key] = val
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms))
  }

  // Solo el primero de la visita: manda por dónde entró, no dónde terminó.
  if (!sessionStorage.getItem(REFERRER_KEY)) {
    const ref = externalReferrer()
    if (ref) sessionStorage.setItem(REFERRER_KEY, ref)
  }

  if (!sessionStorage.getItem(LANDING_KEY)) {
    sessionStorage.setItem(LANDING_KEY, window.location.href)
  }
}

/** Se manda a Nexus junto con los UTM. `undefined` si la visita no trae origen externo. */
export function getReferrer(): string | undefined {
  try {
    return sessionStorage.getItem(REFERRER_KEY) ?? externalReferrer() ?? undefined
  } catch {
    return undefined
  }
}

export function getUTMs(): Record<string, string | undefined> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    const utms: Partial<Record<string, string>> = stored ? JSON.parse(stored) : {}
    return {
      utm_source: utms['utm_source'],
      utm_medium: utms['utm_medium'],
      utm_campaign: utms['utm_campaign'],
      utm_content: utms['utm_content'],
      gclid: utms['gclid'],
      fbclid: utms['fbclid'],
    }
  } catch {
    return {}
  }
}

export function getLandingUrl(): string {
  return sessionStorage.getItem(LANDING_KEY) ?? window.location.href
}

/**
 * Marca el origen de la visita solo si todavía no tiene uno. Para enlaces
 * internos (el botón de un artículo del blog que viene de Leax): no pisa una
 * campaña de Ads o Meta por la que la persona ya había entrado.
 */
export function marcarOrigenSiNoHay(utms: Partial<Record<typeof UTM_KEYS[number], string>>): void {
  try {
    if (!sessionStorage.getItem(STORAGE_KEY)) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms))
  } catch {
    // Sin almacenamiento (modo privado estricto): el lead llega igual, sin la marca.
  }
}
