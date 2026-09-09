import { getUTMs, getReferrer, getLandingUrl } from '@/lib/utm'
import { getCountry } from '@/lib/geo'
import { withBudget, BUDGET_MIN } from '@/lib/budget'
import { trackLead } from '@/lib/tracking'

// Única puerta de salida de los formularios de empresas del sitio.
//
// Antes cada página armaba su propio envío: cuatro constantes con la misma URL,
// cuatro payloads distintos (Contacto mandaba tamaño de empresa, la calculadora
// mandaba campañas, la home ninguna de las dos) y cuatro formas de contar la
// conversión. Un cambio en la cocina obligaba a tocar cuatro archivos y era
// imposible saber de qué formulario venía un lead.
const API_URL =
  import.meta.env.VITE_PLATFORM_API_URL ||
  'https://www.globaltalentconnections.online/api/leads/public'

export interface DatosLead {
  company_name: string
  contact_name: string
  contact_email?: string
  contact_phone: string
  /** Perfil que busca la empresa. */
  assistant_type: string
  /** Clave de BUDGET_MIN: 'menos_1200' | '1200_2000' | 'mas_2000'. */
  budget: string
  /** Texto libre de la empresa. */
  description?: string
  company_size?: string
  /** Variante breve para tráfico de anuncios: se contacta por WhatsApp. */
  capture_mode?: 'express'
}

/** Qué formulario lo mandó. Viaja para poder medir cuál convierte. */
export type OrigenFormulario = 'home' | 'contacto' | 'asistente-virtual' | 'calculadora' | 'chatbot'

export async function enviarLead(datos: DatosLead, formulario: OrigenFormulario): Promise<void> {
  const utms = getUTMs()
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      company_name: datos.company_name,
      contact_name: datos.contact_name,
      contact_email: datos.contact_email || undefined,
      contact_phone: datos.contact_phone,
      assistant_type: datos.assistant_type,
      company_size: datos.company_size || undefined,
      // La cocina guarda el presupuesto como número en budget_min y el texto
      // dentro de la descripción: así se lee en la ficha sin abrir nada.
      description: withBudget(datos.description, datos.budget),
      budget_option: BUDGET_MIN[datos.budget],
      source: 'web_formulario',
      ...utms,
      // De qué formulario vino. `formulario` lo usará Nexus cuando acepte el
      // campo; mientras tanto viaja en utm_content, que sí se guarda hoy, y
      // solo cuando la visita no trae uno propio de campaña.
      formulario,
      capture_mode: datos.capture_mode,
      utm_content: utms.utm_content || `form:${formulario}`,
      referrer: getReferrer(),
      landing_url: getLandingUrl(),
      country: getCountry(),
    }),
  })
  if (!res.ok) throw new Error(`La solicitud no se pudo enviar (${res.status})`)
  trackLead(formulario)
}
