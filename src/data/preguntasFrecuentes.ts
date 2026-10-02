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
    es: 'El profesional dedicado en tu horario, su contratación y nómina gestionadas por GTC, y el seguimiento del equipo de Calidad. Tú recibes una única factura mensual.',
    en: 'A dedicated professional working your hours, their hiring and payroll handled by GTC, and follow-up from our Quality team. You receive a single monthly invoice.',
  },
}

const PERMANENCIA: Pregunta = {
  pregunta: { es: '¿Hay permanencia?', en: 'Is there a minimum commitment?' },
  respuesta: {
    es: 'No. Puedes parar el servicio con un preaviso. Si el perfil no encaja, lo reemplazamos sin coste.',
    en: 'No. You can stop the service with prior notice. If the profile is not a fit, we replace them at no cost.',
  },
}

const HORARIO: Pregunta = {
  pregunta: { es: '¿En qué horario trabaja?', en: 'What hours do they work?' },
  respuesta: {
    es: 'En el tuyo. Los profesionales trabajan en horario de España, integrados en tus herramientas y tu equipo.',
    en: 'Yours. Our professionals work on Spanish business hours, integrated into your tools and your team.',
  },
}

const PLAZO: Pregunta = {
  pregunta: { es: '¿Cuánto tarda?', en: 'How long does it take?' },
  respuesta: {
    es: 'Recibes los primeros perfiles evaluados en 5 días hábiles desde que definimos el rol contigo.',
    en: 'You receive the first evaluated profiles within 5 business days of defining the role with you.',
  },
}

const REEMPLAZO: Pregunta = {
  pregunta: { es: '¿Qué pasa si el profesional no encaja?', en: 'What if the professional is not a fit?' },
  respuesta: {
    es: 'Lo reemplazamos sin coste. El equipo de Calidad acompaña su desempeño, gestiona las incidencias y activa el reemplazo cuando hace falta.',
    en: 'We replace them at no cost. Our Quality team follows their performance, handles any issues and triggers the replacement when needed.',
  },
}

const ORIGEN: Pregunta = {
  pregunta: { es: '¿De dónde son los profesionales?', en: 'Where are the professionals based?' },
  respuesta: {
    es: 'De Latinoamérica. Trabajan en remoto para tu empresa, en tu horario.',
    en: 'In Latin America. They work remotely for your company, on your hours.',
  },
}

const PERFILES: Pregunta = {
  pregunta: { es: '¿Qué perfiles puedo contratar?', en: 'What profiles can I hire?' },
  respuesta: {
    es: `Profesionales en ${CIFRAS.areas} áreas: administración, marketing digital, finanzas y contabilidad, ventas, diseño, automatización e IA, atención al cliente, desarrollo web, comunicación, e-commerce y arquitectura.`,
    en: `Professionals in ${CIFRAS.areas} areas: administration, digital marketing, finance and accounting, sales, design, automation and AI, customer support, web development, communications, e-commerce and architecture.`,
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
