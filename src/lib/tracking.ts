// Medición del portal de candidatos: SOLO Google Analytics 4 (G-J6SJCJ1PK7).
//
// Hasta el 16-oct-2026 esta rama cargaba el GTM de la agencia y
// mandaba la conversión de formulario a la cuenta de Google Ads de la agencia
// . En `main` eso se corrigió el 15-sep-2026 (PR #31) y nunca
// llegó acá. Además, en el portal no va NINGUNA conversión de Ads: los candidatos
// no son el público de las campañas y contar cada postulación como conversión
// ensucia la optimización. Spec de Ariel del 16-oct-2026, PR 1.

/**
 * Clic en «Postularme»: el candidato salta al formulario de Nexus
 * (globaltalentconnections.online/postular-express), o sea a otro dominio.
 * Sin este evento no se sabe cuántos saltan ni cuántos llegan.
 *
 * `slug` identifica la oportunidad (public_slug de Nexus o el id local);
 * `ubicacion` dice desde qué pantalla salió el clic (ficha, listado, áreas…).
 */
export function trackPostulacion(slug: string | undefined, ubicacion: string) {
  // beacon: el clic navega a otro dominio y sin esto el evento se pierde.
  window.gtag?.('event', 'candidato_postula', {
    slug: slug ?? '(sin slug)',
    ubicacion,
    transport_type: 'beacon',
  })
}

/**
 * Páginas heredadas de la web de empresas que siguen en esta rama sin ruta
 * (Index, Contacto, CalculadoraAhorro, ChatWidget). No se muestran en el
 * portal; se conserva solo para que compile. Sin conversión de Ads.
 */
export function trackLead(source: string) {
  window.gtag?.('event', 'generate_lead', { event_category: source, transport_type: 'beacon' })
}

export type CanalContacto = 'whatsapp' | 'telefono' | 'email'

/** Clic a un canal directo de contacto. Solo lo usan páginas heredadas de la
 *  web de empresas que el portal no enruta; se conserva para que compilen. */
export function trackContacto(canal: CanalContacto, ubicacion: string) {
  window.gtag?.('event', `contacto_${canal}`, { event_category: 'contacto', ubicacion, transport_type: 'beacon' })
}
