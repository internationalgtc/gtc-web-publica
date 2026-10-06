// Artículos del blog que vienen de Leax (piloto SEO, pieza P5).
//
// Leax solo entrega lo aprobado para la dirección de cada artículo en esta web,
// con el cuerpo ya saneado. El servidor (api/blog-articulo.ts) ya deja el
// artículo en window.__ARTICULO_LEAX__ para no pedirlo dos veces; si no está
// (se llegó navegando dentro de la web), se pide acá.

const LEAX_API = (import.meta.env.VITE_LEAX_API_URL ?? 'https://leaxagentic.com').replace(/\/+$/, '')
const LEAX_WORKSPACE = import.meta.env.VITE_LEAX_BLOG_WORKSPACE ?? 'global-talent-connections'
const BASE_URL = 'https://www.globaltalent-connections.com'

export type ArticuloLeax = {
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  body_html: string
  url: string
  publicado_en: string | null
}

export type TarjetaLeax = Pick<ArticuloLeax, 'slug' | 'title' | 'meta_description' | 'url' | 'publicado_en'>

declare global {
  interface Window {
    __ARTICULO_LEAX__?: ArticuloLeax
  }
}

const api = (consulta: string) => `${LEAX_API}/api/public/seo-articles?workspace=${encodeURIComponent(LEAX_WORKSPACE)}&${consulta}`

/** Solo lo que es de esta web: la API ya lo filtra, esto no confía a ciegas. */
const deEstaWeb = (a: { slug: string; url: string }) => a.url === `${BASE_URL}/blog/${a.slug}`

/** `null` = Leax no lo tiene para esta web (el «no encontrado» de siempre). Lanza si Leax no responde. */
export async function articuloDeLeax(slug: string): Promise<ArticuloLeax | null> {
  const precargado = window.__ARTICULO_LEAX__
  if (precargado?.slug === slug) return precargado
  const r = await fetch(api(`slug=${encodeURIComponent(slug)}`))
  if (r.status === 404) return null
  if (!r.ok) throw new Error(`Leax ${r.status}`)
  const { article } = (await r.json()) as { article?: ArticuloLeax }
  return article && deEstaWeb(article) ? article : null
}

/** Los últimos artículos de Leax para esta web (la portada del blog muestra hasta 50). */
export async function articulosDeLeax(): Promise<TarjetaLeax[]> {
  const r = await fetch(api('page=1&perPage=50'))
  if (!r.ok) throw new Error(`Leax ${r.status}`)
  const { articles } = (await r.json()) as { articles?: TarjetaLeax[] }
  return (articles ?? []).filter(deEstaWeb)
}

/** A Contacto con la marca del artículo. */
export const enlaceAContacto = (slug: string) =>
  `/contacto?utm_source=blog&utm_medium=articulo&utm_campaign=${encodeURIComponent(slug)}`
