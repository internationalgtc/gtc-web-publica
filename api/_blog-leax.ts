// Los artículos del blog que vienen de Leax (piloto SEO, pieza P5).
//
// Leax edita y aprueba; esta web publica. La API pública de Leax solo entrega
// lo aprobado para la dirección de cada artículo en ESTA web
// (https://www.globaltalent-connections.com/blog/<slug>), ya saneado.
//
// Por qué se arma el HTML en el servidor: la web es una SPA y los buscadores
// (y los rastreadores de IA) muchas veces no ejecutan JavaScript. La función
// toma el esqueleto de la SPA (`spa.html`), le pone el título, la descripción,
// el canonical y los datos estructurados del artículo, y mete el texto dentro
// de #root. Al cargar, React reemplaza ese contenido por la página con el
// diseño editorial, usando los mismos datos (window.__ARTICULO_LEAX__).
//
// El archivo empieza con «_»: Vercel no lo publica como ruta.

export const BASE_URL = 'https://www.globaltalent-connections.com'
export const LEAX_API = (process.env.LEAX_API_URL ?? 'https://leaxagentic.com').replace(/\/+$/, '')
export const LEAX_WORKSPACE = process.env.LEAX_BLOG_WORKSPACE ?? 'global-talent-connections'

/** Los dos artículos escritos a mano en src/data/blogPosts.ts: no pasan por Leax. */
export const ARTICULOS_PROPIOS = ['roi-talento-remoto', 'futuro-talento-remoto-2026']

export type ArticuloLeax = {
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  body_html: string
  url: string
  publicado_en: string | null
  revision: { id: string; hash: string } | null
  structuredData: Record<string, unknown>
}

export type TarjetaLeax = Pick<ArticuloLeax, 'slug' | 'title' | 'meta_description' | 'url' | 'publicado_en'>

/** Un slug como los que genera Leax: minúsculas, números y guiones. */
export const slugValido = (s: unknown): s is string => typeof s === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= 200

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** JSON dentro de <script>: que un «</script>» del texto no cierre la etiqueta. */
const jsonEnScript = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')

/**
 * ¿El artículo que llegó es para ESTA web? La API ya lo filtra; esto evita
 * publicar con un canonical ajeno si algo cambiara del otro lado.
 */
export const esDeEstaWeb = (a: Pick<ArticuloLeax, 'slug' | 'url'>) => a.url === `${BASE_URL}/blog/${a.slug}`

/** A Contacto, con la marca del artículo (la guarda la SPA solo si la visita no traía otro origen). */
export const enlaceAContacto = (slug: string) =>
  `/contacto?utm_source=blog&utm_medium=articulo&utm_campaign=${encodeURIComponent(slug)}`

function ponerMeta(html: string, atributo: 'name' | 'property', clave: string, valor: string): string {
  const re = new RegExp(`<meta ${atributo}="${clave}" content="[^"]*"\\s*/?>`)
  const etiqueta = `<meta ${atributo}="${clave}" content="${escapar(valor)}" />`
  // Reemplazos con función: un «$» del texto no se interpreta como patrón.
  return re.test(html) ? html.replace(re, () => etiqueta) : html.replace('</head>', () => `  ${etiqueta}\n</head>`)
}

/** El esqueleto de la SPA con el artículo listo para un buscador. */
export function paginaDelArticulo(spa: string, a: ArticuloLeax): string {
  const titulo = a.meta_title || a.title
  const descripcion = a.meta_description ?? ''
  const url = `${BASE_URL}/blog/${a.slug}`
  // La marca va al final, salvo que el título para Google ya la traiga («… | GTC»).
  const enLaPestana = titulo.includes('|') ? titulo : `${titulo} | Global Talent Connections`
  let html = spa.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapar(enLaPestana)}</title>`)
  for (const [atributo, clave, valor] of [
    ['property', 'og:type', 'article'],
    ['property', 'og:url', url],
    ['property', 'og:title', titulo],
    ['property', 'og:description', descripcion],
    ['name', 'twitter:title', titulo],
    ['name', 'twitter:description', descripcion],
  ] as const) {
    if (valor) html = ponerMeta(html, atributo, clave, valor)
  }
  const cabecera = [
    descripcion ? `<meta name="description" content="${escapar(descripcion)}" />` : '',
    `<link rel="canonical" href="${escapar(url)}" />`,
    // Qué versión aprobada de Leax es esta página: para comprobar que la web
    // muestra exactamente lo publicado (spec SEO premium §6.2).
    a.revision ? `<meta name="leax-revision" content="${escapar(`${a.revision.id}:${a.revision.hash}`)}" />` : '',
    `<script type="application/ld+json">${jsonEnScript(a.structuredData)}</script>`,
    `<script>window.__ARTICULO_LEAX__=${jsonEnScript(a)}</script>`,
  ].filter(Boolean).join('\n  ')
  html = html.replace('</head>', () => `  ${cabecera}\n</head>`)

  // Lo que ve un buscador sin JavaScript. El cuerpo ya viene saneado de Leax.
  const contenido = `<main><article>
<p><a href="/blog">Blog</a></p>
<h1>${escapar(a.title)}</h1>
${descripcion ? `<p>${escapar(descripcion)}</p>` : ''}
${a.body_html}
<p><a href="${escapar(enlaceAContacto(a.slug))}">Hablemos</a></p>
</article></main>`
  return html.replace('<div id="root"></div>', () => `<div id="root">${contenido}</div>`)
}

/** El esqueleto de la SPA para un artículo que no existe: la SPA muestra el «no encontrado». */
export function paginaNoEncontrada(spa: string): string {
  return spa.replace('</head>', () => '  <meta name="robots" content="noindex" />\n</head>')
}

/** Sitemap de los artículos que vienen de Leax. */
export function sitemapDelBlog(articulos: TarjetaLeax[]): string {
  const urls = articulos.filter(esDeEstaWeb).map(a => [
    '  <url>',
    `    <loc>${escapar(a.url)}</loc>`,
    a.publicado_en ? `    <lastmod>${escapar(a.publicado_en.slice(0, 10))}</lastmod>` : '',
    '  </url>',
  ].filter(Boolean).join('\n'))
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}
