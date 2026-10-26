import { Helmet } from 'react-helmet-async'
import { CIFRAS } from '@/data/cifras'
import { TELEFONO_E164 } from '@/data/contacto'

interface SEOProps {
  title: string
  description: string
  path?: string
  image?: string
  type?: string
  faqSchema?: object
  keywords?: string
  breadcrumbs?: Array<{ name: string; url: string }>
  /** Pide a los buscadores que NO la indexen (404 y páginas retiradas). */
  noIndex?: boolean

}

const BASE_URL = 'https://www.globaltalent-connections.com'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Global Talent Connections',
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.png`,
  description:
    'Servicios de soporte para empresas en 11 áreas, con un equipo de profesionales en Latinoamérica coordinado por GTC. Tú defines el resultado; nosotros organizamos el trabajo.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    availableLanguage: ['Spanish', 'English'],
  },
  sameAs: [
    'https://www.linkedin.com/company/global-talent-connections-gtc',
    'https://www.instagram.com/globaltalentconnections/',
    'https://www.facebook.com/people/Global-Talent-Connections/61570361473550/',
  ],
}

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Global Talent Connections',
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.png`,
  image: `${BASE_URL}/og-image.png`,
  // Las cifras salen de src/data/cifras.ts, igual que en la home.
  description:
    `Servicios de asistencia virtual gestionada para empresas españolas, con ${CIFRAS.profesionales.enFrase.es} trabajando en ${CIFRAS.empresas.enFrase.es}. Una factura mensual, calidad y continuidad garantizadas.`,
  telephone: TELEFONO_E164,
  email: 'info@globaltalent-connections.com',
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Transferencia bancaria, Stripe',
  areaServed: [
    { '@type': 'Country', name: 'Spain' },
    { '@type': 'Country', name: 'Argentina' },
    { '@type': 'Country', name: 'Mexico' },
    { '@type': 'Country', name: 'Colombia' },
    { '@type': 'Country', name: 'Venezuela' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Alicante',
    addressRegion: 'Comunidad Valenciana',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.3452,
    longitude: -0.4815,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de talento remoto',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asistente Virtual Administrativo' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asistente Virtual de Marketing Digital' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SDR / Representante de Ventas Remoto' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asistente Virtual Financiero' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Soporte al Cliente Remoto' } },
    ],
  },
  sameAs: [
    'https://www.linkedin.com/company/global-talent-connections-gtc',
    'https://www.instagram.com/globaltalentconnections/',
    'https://www.facebook.com/people/Global-Talent-Connections/61570361473550/',
  ],
}

const DEFAULT_KEYWORDS =
  'asistencia virtual gestionada, servicios gestionados para empresas, ' +
  'externalización de tareas administrativas, soporte comercial remoto, Global Talent Connections'

export default function SEO({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  faqSchema,
  keywords,
  breadcrumbs,
  noIndex,
}: SEOProps) {
  const fullTitle = title === 'Home'
    ? 'Global Talent Connections | Servicios de asistencia virtual gestionada para empresas'
    : `${title} | Global Talent Connections`
  const url = `${BASE_URL}${path}`

  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
      ...breadcrumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: crumb.name,
        item: `${BASE_URL}${crumb.url}`,
      })),
    ],
  } : null

  // defer={false}: react-helmet escribe <title>/<meta> en el acto, no en el
  // próximo requestAnimationFrame. En el prerender se renderizan dos páginas a
  // la vez y la que queda en segundo plano no recibe rAF: se guardaba con el
  // título de la home y sin description ni canonical (/nosotros,
  // /asistente-virtual, /politica-de-privacidad, 28-sep-2026).
  return (
    <Helmet defer={false}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, follow" />}
      <meta name="keywords" content={keywords ?? DEFAULT_KEYWORDS} />
      <link rel="canonical" href={url} />

      {/* Hreflang */}
      <link rel="alternate" hrefLang="es" href={url} />
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="es_ES" />
      <meta property="og:site_name" content="Global Talent Connections" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@globaltalentco" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(ORGANIZATION_SCHEMA)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(LOCAL_BUSINESS_SCHEMA)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  )
}
