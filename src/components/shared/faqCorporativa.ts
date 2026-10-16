// FAQ de la web de empresas (Home y Servicios). Solo las usan paginas que el
// portal de candidatos no enruta; viven aparte para que SEO.tsx no cargue
// vocabulario de la web comercial.
// FAQs para Home y Servicios — apuntan a featured snippets de búsquedas de talento remoto
export const HOME_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es Global Talent Connections?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Global Talent Connections es una empresa especializada en conectar empresas españolas y europeas con profesionales remotos de alto rendimiento de Latinoamérica. Nos encargamos de la selección, gestión y supervisión integral del talento.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto se puede ahorrar contratando talento remoto con GTC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Las empresas que trabajan con Global Talent Connections ahorran hasta un 50% en costes de personal comparado con contrataciones locales en España, manteniendo la misma calidad y rendimiento.',
      },
    },
    {
      '@type': 'Question',
      name: '¿En cuánto tiempo puedo tener a un profesional trabajando?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nuestro proceso de selección dura entre 5 y 10 días hábiles. Una vez seleccionado el candidato, el profesional puede incorporarse de forma inmediata.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué perfiles profesionales puedo contratar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ofrecemos profesionales remotos en administración, marketing digital, desarrollo web, diseño gráfico, finanzas, atención al cliente, inteligencia artificial y más de 10 especialidades.',
      },
    },
  ],
}

export const SERVICIOS_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué servicios ofrece Global Talent Connections?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ofrecemos selección y gestión de talento remoto en más de 10 especialidades: administración, marketing, finanzas, desarrollo web, diseño, atención al cliente, inteligencia artificial, arquitectura, e-commerce, gestión de proyectos y soporte técnico.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo funciona el proceso de selección de GTC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El proceso tiene 4 pasos: búsqueda del perfil ideal, evaluación técnica y cultural de candidatos, presentación de los mejores perfiles a la empresa, e incorporación con supervisión continua durante los primeros meses.',
      },
    },
    {
      '@type': 'Question',
      name: '¿GTC gestiona la relación con el profesional después de la contratación?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Global Talent Connections ofrece gestión y supervisión integral: seguimiento del desempeño, comunicación continua con el profesional y soporte para resolver cualquier incidencia.',
      },
    },
  ],
}
