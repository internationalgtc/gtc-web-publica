/// <reference types="vite/client" />

interface Window {
  /** Lo inyecta @prerenderer/renderer-puppeteer (vite.config.ts, inject): en el prerender no se anima nada. */
  __PRERENDER_INJECTED?: { prerender?: boolean; vacantes?: unknown }
  /** Lo deja el build en index.html (vite.config.ts, vacantesEnHtml). */
  __GTC_VACANTES?: unknown
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
  // Definida en index.html: carga GTM, GA4/Ads, LinkedIn y Meta. Solo tras aceptar cookies.
  __gtcCargarMedicion?: () => void
}
