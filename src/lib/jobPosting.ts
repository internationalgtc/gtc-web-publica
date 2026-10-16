// Construye el structured data JobPosting (schema.org) de una oportunidad.
// Hace elegibles las páginas /empleos/[id] para el recuadro de Google Jobs.
// Docs: https://developers.google.com/search/docs/appearance/structured-data/job-posting
//
// Se mantiene el tipo JobPosting porque es lo que Google indexa en «Empleos»,
// pero con employmentType CONTRACTOR y sin baseSalary: GTC no contrata, los
// profesionales son colaboradores independientes (spec de Ariel, 16-oct-2026).

// El portal vive en su propio subdominio: la URL de la oportunidad va ahí.
const BASE_URL = 'https://empleos.globaltalent-connections.com'
const CORP_URL = 'https://www.globaltalent-connections.com'

// Países de LATAM desde donde se puede postular (audiencia real del sitio según GA4).
const LATAM_COUNTRIES = [
  'Argentina', 'Chile', 'Colombia', 'Venezuela', 'Perú', 'Ecuador', 'México',
  'Uruguay', 'Bolivia', 'Paraguay', 'Guatemala', 'Costa Rica', 'Panamá',
  'República Dominicana', 'Honduras', 'El Salvador', 'Nicaragua',
]

// Google exige una fecha de publicación y una de caducidad. Sale de `opened_at`
// de Nexus cuando la oportunidad viene de la API; si no, de la fecha del build.
const DIAS_VIGENTE = 90
const dia = (d: Date) => d.toISOString().slice(0, 10)
function fechas(openedAt?: string): { datePosted: string; validThrough: string } {
  const desde = openedAt ? new Date(openedAt) : new Date()
  const base = Number.isNaN(desde.getTime()) ? new Date() : desde
  const hasta = new Date(Math.max(base.getTime(), Date.now()) + DIAS_VIGENTE * 86400000)
  return { datePosted: dia(base), validThrough: dia(hasta) }
}

export interface JobForSchema {
  id: string
  title: string
  description: string
  type: string
  requirements?: string[]
  imageUrl?: string
  openedAt?: string
}

export function buildJobPostingSchema(job: JobForSchema) {
  const requirementsHtml = job.requirements?.length
    ? `<p><strong>Qué buscamos:</strong></p><ul>${job.requirements.map((r) => `<li>${r}</li>`).join('')}</ul>`
    : ''
  const descriptionHtml = `<p>${job.description}</p>${requirementsHtml}`

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: descriptionHtml,
    ...fechas(job.openedAt),
    employmentType: 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Global Talent Connections',
      sameAs: CORP_URL,
      logo: `${CORP_URL}/og-image.png`,
    },
    // Trabajo 100% remoto: se marca como teletrabajo + países donde se puede postular.
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: LATAM_COUNTRIES.map((name) => ({
      '@type': 'Country',
      name,
    })),
    identifier: {
      '@type': 'PropertyValue',
      name: 'Global Talent Connections',
      value: job.id,
    },
    url: `${BASE_URL}/empleos/${job.id}`,
    ...(job.imageUrl ? { image: `${BASE_URL}${job.imageUrl}` } : {}),
  }
}
