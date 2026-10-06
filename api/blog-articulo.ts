import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ARTICULOS_PROPIOS, LEAX_API, LEAX_WORKSPACE, esDeEstaWeb, paginaDelArticulo, paginaNoEncontrada, slugValido, type ArticuloLeax } from './_blog-leax.js'

// /blog/<slug> para los artículos que vienen de Leax (piloto SEO, P5). Ver _blog-leax.ts.
//
// - Los dos artículos propios (src/data/blogPosts.ts) y lo que no parezca un
//   slug van a la SPA tal cual, como siempre.
// - Leax no lo tiene aprobado para esta web → 404 con noindex; la SPA muestra
//   «Artículo no encontrado».
// - Leax no responde → 503 sin caché: la SPA lo vuelve a pedir desde el navegador.

const ESPERA_MS = 8000

async function esqueletoDeLaSpa(req: VercelRequest): Promise<string | null> {
  // `spa.html` es un archivo estático del mismo despliegue (lo genera el build).
  const host = req.headers['x-forwarded-host'] ?? req.headers.host
  if (typeof host !== 'string') return null
  const cabeceras: Record<string, string> = {}
  // En las vistas previas protegidas, la función entra con el secreto de Vercel si existe.
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) cabeceras['x-vercel-protection-bypass'] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  try {
    const r = await fetch(`https://${host}/spa.html`, { headers: cabeceras, signal: AbortSignal.timeout(ESPERA_MS) })
    return r.ok ? await r.text() : null
  } catch {
    return null
  }
}

async function articuloDeLeax(slug: string): Promise<ArticuloLeax | 'no_existe' | 'error'> {
  const url = `${LEAX_API}/api/public/seo-articles?workspace=${encodeURIComponent(LEAX_WORKSPACE)}&slug=${encodeURIComponent(slug)}`
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(ESPERA_MS) })
    if (r.status === 404) return 'no_existe'
    if (!r.ok) return 'error'
    const data = await r.json() as { article?: ArticuloLeax }
    return data.article ?? 'error'
  } catch {
    return 'error'
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug
  const spa = await esqueletoDeLaSpa(req)
  if (!spa) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(503).send('El blog no está disponible en este momento. Vuelve a intentarlo en un minuto.')
    return
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (!slugValido(slug) || ARTICULOS_PROPIOS.includes(slug)) {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    res.status(200).send(spa)
    return
  }

  const articulo = await articuloDeLeax(slug)
  if (articulo === 'error') {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Retry-After', '60')
    res.status(503).send(spa)
    return
  }
  if (articulo === 'no_existe' || !esDeEstaWeb(articulo)) {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    res.status(404).send(paginaNoEncontrada(spa))
    return
  }
  // 5 min en la CDN, igual que la API de Leax: publicar se ve en minutos, no en el acto.
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  res.status(200).send(paginaDelArticulo(spa, articulo))
}
