export function trackLead(source: string) {
  // transport_type: 'beacon' → el evento se envía con navigator.sendBeacon, que
  // sobrevive aunque el navegador se ocupe justo después (p. ej. una descarga o
  // un cierre de pestaña). Sin esto, la calculadora perdía ~85% de sus leads en
  // GA4/Ads: disparaba el evento justo cuando arrancaba la descarga del Excel y
  // el beacon no llegaba a salir.
  // GA4
  window.gtag?.('event', 'generate_lead', { event_category: source, transport_type: 'beacon' })
  // Google Ads — acción de conversión de FORMULARIO/LEAD (AW-18022609299/<label>).
  // La etiqueta se obtuvo del contenedor GTM (GTM-W66STSP6); los tags de GTM no
  // disparan en este sitio React (sus triggers son del sitio WordPress viejo:
  // form_submit nativo / JoinChat / clic-a-teléfono), así que disparamos la
  // conversión directo acá. Antes iba sin label → Ads no la contaba.
  window.gtag?.('event', 'conversion', { send_to: 'AW-18022609299/e2oZCKrri5McEJPj7JFD', transport_type: 'beacon' })
  // Cuenta nueva de Google Ads (721-349-3676, sep-2026): misma conversión, etiqueta propia.
  window.gtag?.('event', 'conversion', { send_to: 'AW-18434607978/rA4zCLraxvAcEOqWp9ZE', transport_type: 'beacon' })
  // Meta Pixel
  window.fbq?.('track', 'Lead', { content_name: source })
}
