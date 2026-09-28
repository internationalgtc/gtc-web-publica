/**
 * Teléfono de GTC — FUENTE ÚNICA. Un solo número para llamar y para WhatsApp
 * (decidido por Larisa, 28-sep-2026). Lo usan el pie, /contacto,
 * /asistente-virtual, el chatbot y los datos estructurados.
 */
export const TELEFONO = '+34 689 53 98 96'
/** Formato E.164, para `tel:` y para los datos estructurados. */
export const TELEFONO_E164 = '+34689539896'
export const TEL_LINK = `tel:${TELEFONO_E164}`
export const WHATSAPP_LINK = `https://wa.me/${TELEFONO_E164.slice(1)}`
