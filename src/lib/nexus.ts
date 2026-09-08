// Nexus es la app donde vive el formulario de postulación. El portal solo manda
// gente ahí: con `?puesto=` para una búsqueda concreta, o sin nada para entrar
// al banco de talento eligiendo un área.
const NEXUS_URL = 'https://www.globaltalentconnections.online'

export function urlPostulacion(puesto?: string, lang?: string): string {
  const params = new URLSearchParams()
  if (puesto) params.set('puesto', puesto)
  if (lang === 'en') params.set('lang', 'en')
  const query = params.toString()
  return `${NEXUS_URL}/postular-express${query ? `?${query}` : ''}`
}
