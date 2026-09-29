/// <reference types="vite/client" />

interface Window {
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
  // Definida en index.html: carga GA4/Ads, LinkedIn y Meta. Solo tras aceptar cookies.
  __gtcCargarMedicion?: () => void
}
