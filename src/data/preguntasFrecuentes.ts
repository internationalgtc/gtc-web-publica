import { CIFRAS } from './cifras'

/**
 * Preguntas frecuentes — fuente única para la home, /asistente-virtual y los
 * datos estructurados (FAQPage). Cada respuesta repite algo que la web ya dice
 * en otra parte: acá no se afirma nada nuevo.
 */

type Texto = { es: string; en: string }
export type Pregunta = { pregunta: Texto; respuesta: Texto }

const PRECIO: Pregunta = {
  pregunta: { es: '¿Qué incluye el precio de 1.300 €/mes?', en: 'What does the €1,300/month price include?' },
  respuesta: {
    es: 'El servicio que presta nuestro equipo para tu empresa, coordinado por tu responsable de servicio, con informes cada semana y cada mes. Una sola factura mensual, sin costes de puesta en marcha.',
    en: 'The service our team delivers for your company, coordinated by your service manager, with weekly and monthly reports. One monthly invoice, no set-up costs.',
  },
}

const PERMANENCIA: Pregunta = {
  pregunta: { es: '¿Hay permanencia?', en: 'Is there a minimum commitment?' },
  respuesta: {
    es: 'No. Puedes parar el servicio con un preaviso. Si no responde a lo acordado, lo reorganizamos sin coste.',
    en: 'No. You can stop the service with prior notice. If it falls short of what was agreed, we reorganise it at no cost.',
  },
}

const HORARIO: Pregunta = {
  pregunta: { es: '¿En qué horario trabaja?', en: 'What hours do they work?' },
  respuesta: {
    es: 'En horario de España. El servicio se presta dentro de tus herramientas, coordinado con tu equipo.',
    en: 'On Spanish business hours. The service is delivered inside your tools, coordinated with your team.',
  },
}

const PLAZO: Pregunta = {
  pregunta: { es: '¿Cuánto tarda en arrancar?', en: 'How long does it take to start?' },
  respuesta: {
    es: 'En 5 días hábiles desde que definimos contigo qué se delega, te presentamos a quien prestará el servicio, ya evaluado.',
    en: 'Within 5 business days of agreeing with you what to delegate, we introduce who will deliver the service, already assessed.',
  },
}

const REEMPLAZO: Pregunta = {
  pregunta: { es: '¿Qué pasa si el servicio no responde a lo acordado?', en: 'What if the service falls short of what was agreed?' },
  respuesta: {
    es: 'Lo reorganizamos sin coste. Tu responsable de servicio sigue los resultados cada semana, gestiona las incidencias y, si hace falta, cambia a la persona que lo presta.',
    en: 'We reorganise it at no cost. Your service manager tracks results every week, handles any issues and, if needed, changes who delivers it.',
  },
}

const ORIGEN: Pregunta = {
  pregunta: { es: '¿De dónde son los profesionales?', en: 'Where are the professionals based?' },
  respuesta: {
    es: 'De Latinoamérica. Prestan el servicio en remoto, en horario de España.',
    en: 'In Latin America. They deliver the service remotely, on Spanish business hours.',
  },
}

const PERFILES: Pregunta = {
  pregunta: { es: '¿Qué puedo delegar?', en: 'What can I delegate?' },
  respuesta: {
    es: `Servicios en ${CIFRAS.areas} áreas: administración, marketing digital, finanzas y contabilidad, ventas, diseño, automatización e IA, atención al cliente, desarrollo web, comunicación, e-commerce y arquitectura.`,
    en: `Services in ${CIFRAS.areas} areas: administration, digital marketing, finance and accounting, sales, design, automation and AI, customer support, web development, communications, e-commerce and architecture.`,
  },
}

/** Las 7 de la home. */
export const PREGUNTAS_HOME: Pregunta[] = [PRECIO, PLAZO, REEMPLAZO, PERMANENCIA, HORARIO, ORIGEN, PERFILES]

/** Las 4 de /asistente-virtual (landing de Google Ads, solo en español). */
export const PREGUNTAS_LANDING: Pregunta[] = [PRECIO, PERMANENCIA, HORARIO, PLAZO]

/** Datos estructurados FAQPage con exactamente las preguntas que se ven en la página. */
export function esquemaPreguntas(lista: Pregunta[], lang: 'es' | 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: lista.map(({ pregunta, respuesta }) => ({
      '@type': 'Question',
      name: pregunta[lang],
      acceptedAnswer: { '@type': 'Answer', text: respuesta[lang] },
    })),
  }
}
