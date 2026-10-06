import type { VercelRequest, VercelResponse } from '@vercel/node'
import { LEAX_API, LEAX_WORKSPACE, sitemapDelBlog, type TarjetaLeax } from './_blog-leax.js'

// /blog/sitemap.xml: los artículos que vienen de Leax (piloto SEO, P5). Los
// dos artículos propios siguen en /sitemap.xml. robots.txt anuncia los dos.

const POR_PAGINA = 50
const MAX_PAGINAS = 20

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const articulos: TarjetaLeax[] = []
  try {
    for (let page = 1; page <= MAX_PAGINAS; page++) {
      const url = `${LEAX_API}/api/public/seo-articles?workspace=${encodeURIComponent(LEAX_WORKSPACE)}&page=${page}&perPage=${POR_PAGINA}`
      const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!r.ok) throw new Error(`Leax ${r.status}`)
      const data = await r.json() as { articles?: TarjetaLeax[]; hasMore?: boolean }
      articulos.push(...(data.articles ?? []))
      if (!data.hasMore) break
    }
  } catch {
    // Un sitemap vacío haría creer a Google que no hay artículos: mejor un error que reintenta.
    res.setHeader('Cache-Control', 'no-store')
    res.status(503).send('Sitemap no disponible en este momento.')
    return
  }
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  res.status(200).send(sitemapDelBlog(articulos))
}
