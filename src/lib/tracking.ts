export function trackLead(source: string) {
  // transport_type: 'beacon' → el evento se envía con navigator.sendBeacon, que
  // sobrevive aunque el navegador se ocupe justo después (p. ej. una descarga o
  // un cierre de pestaña). Sin esto, la calculadora perdía ~85% de sus leads en
  // GA4/Ads: disparaba el evento justo cuando arrancaba la descarga del Excel y
  // el beacon no llegaba a salir.
  // GA4
  window.gtag?.('event', 'generate_lead', { event_category: source, transport_type: 'beacon' })
  // Google Ads propia (721-349-3676): acción "Formulario de contacto web".
  window.gtag?.('event', 'conversion', { send_to: 'AW-18434607978/rA4zCLraxvAcEOqWp9ZE', transport_type: 'beacon' })
  // Meta Pixel
  window.fbq?.('track', 'Lead', { content_name: source })
}

export type CanalContacto = 'whatsapp' | 'telefono' | 'email'

// Clics a los canales directos de contacto. Hasta el 15-sep-2026 no se medían en
// ninguna propiedad de GTC: los tags que los contaban vivían en el contenedor GTM
// de la agencia (GTM-W66STSP6) y apuntaban al WordPress viejo — otro teléfono,
// otro plugin de WhatsApp —, así que en este sitio no disparaban nunca.
// Acá van directo a la propiedad propia (G-J6SJCJ1PK7), que es la que lee Nexus.
//
// `ubicacion` es desde qué parte del sitio salió el clic (chatbot, calculadora…):
// sirve para saber qué página empuja el contacto, no solo cuántos hubo.
export function trackContacto(canal: CanalContacto, ubicacion: string) {
  // beacon: el clic navega fuera (wa.me, la app de teléfono, el cliente de correo)
  // y sin esto el evento se pierde a mitad de camino.
  window.gtag?.('event', `contacto_${canal}`, {
    event_category: 'contacto',
    ubicacion,
    transport_type: 'beacon',
  })
}
