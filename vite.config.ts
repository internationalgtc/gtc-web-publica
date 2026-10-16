import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { createRequire } from 'module'
import prerender from '@prerenderer/rollup-plugin'

// ─── Prerender del portal (spec de Ariel, 16-oct-2026, PR 5) ─────────────────
//
// Antes cada ruta devolvía el mismo index.html de 6 KB con un <div id="root">
// vacío: las oportunidades no existían para Google. Ahora el build guarda el
// HTML ya pintado de las rutas fijas Y de cada oportunidad viva, leyendo la
// misma API que usa la web (/api/public/vacantes). Las oportunidades cambian
// solas desde Nexus, por eso el build se dispara todos los días
// (.github/workflows/publicar-portal-diario.yml) además de en cada PR.
//
// El prerender necesita un Chromium REAL (puppeteer). En el build remoto de
// Vercel no está, así que se publica la SPA; para que el HTML llegue hay que
// compilar en local o en el runner y subir el resultado: `npm run deploy:prod`.
// Misma guarda y mismas razones que en la web de empresas (rama main).
function hayChromium(): boolean {
  if (process.env.PRERENDER === '0') return false
  if (process.env.PRERENDER !== '1' && process.env.VERCEL) return false
  try {
    const require = createRequire(import.meta.url)
    require.resolve('puppeteer')
    const cache = process.env.PUPPETEER_CACHE_DIR || path.join(os.homedir(), '.cache', 'puppeteer')
    return fs.existsSync(path.join(cache, 'chrome'))
  } catch {
    return false
  }
}

const BASE = 'https://empleos.globaltalent-connections.com'
const API = 'https://www.globaltalentconnections.online/api/public/vacantes'
const HOME_PRERENDER = '_home-prerender.html'

// Artículos del portal (src/data/articulosCandidatos.ts): se leen por regex
// para no importar código de la app en la config.
const ARTICULOS = [...fs.readFileSync(path.resolve(__dirname, 'src/data/articulosCandidatos.ts'), 'utf8').matchAll(/^\s+id:\s*'([^']+)'/gm)].map(m => m[1])

const RUTAS_FIJAS = ['/', '/empleos', '/areas', '/politica-de-privacidad', ...ARTICULOS.map(id => `/blog/${id}`)]

interface Oportunidad { slug: string; lastmod: string }
type CuerpoApi = { data?: Array<{ id: string; public_slug?: string | null; opened_at?: string | null }>; etiquetas?: Record<string, string> }

/** La API de Nexus, leída UNA vez en el build: alimenta las rutas a prerenderizar,
 *  el sitemap y (inyectada) las páginas durante el prerender, porque desde
 *  localhost el navegador bloquea la API por CORS. */
async function leerApi(): Promise<CuerpoApi | null> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 15000)
    const res = await fetch(API, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
    clearTimeout(t)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as CuerpoApi
  } catch (e) {
    console.warn(`[prerender] no se pudo leer ${API}: ${(e as Error).message}. Se prerenderizan solo las rutas fijas.`)
    return null
  }
}

function oportunidades(cuerpo: CuerpoApi | null): Oportunidad[] {
  const vistas = new Set<string>()
  const salida: Oportunidad[] = []
  for (const v of cuerpo?.data ?? []) {
    const slug = v.public_slug || v.id
    if (vistas.has(slug)) continue
    vistas.add(slug)
    salida.push({ slug, lastmod: (v.opened_at ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10) })
  }
  return salida
}

function separarHomeDeLaSpa(): Plugin {
  return {
    name: 'gtc-separar-home-de-la-spa',
    apply: 'build',
    writeBundle(options) {
      const dir = options.dir ?? path.resolve(__dirname, 'dist')
      const index = path.join(dir, 'index.html')
      const home = path.join(dir, HOME_PRERENDER)
      // El esqueleto de la SPA vive en spa.html (destino del rewrite de vercel.json)
      // y en 404.html; la home prerenderizada ocupa index.html recién después.
      fs.copyFileSync(index, path.join(dir, 'spa.html'))
      fs.copyFileSync(index, path.join(dir, '404.html'))
      if (fs.existsSync(home)) fs.renameSync(home, index)
    },
  }
}

/** sitemap.xml con las rutas fijas y las oportunidades vivas (lastmod = opened_at). */
function sitemap(vivas: Oportunidad[]): Plugin {
  const hoy = new Date().toISOString().slice(0, 10)
  const url = (loc: string, lastmod: string, changefreq: string, priority: string) =>
    `  <url>\n    <loc>${BASE}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  const filas = [
    url('/', hoy, 'daily', '1.0'),
    url('/empleos', hoy, 'daily', '0.9'),
    ...vivas.map(o => url(`/empleos/${o.slug}`, o.lastmod, 'weekly', '0.8')),
    url('/areas', hoy, 'weekly', '0.7'),
    ...ARTICULOS.map(id => url(`/blog/${id}`, hoy, 'monthly', '0.5')),
    url('/politica-de-privacidad', hoy, 'yearly', '0.2'),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generado en el build (vite.config.ts): rutas fijas + oportunidades vivas de Nexus. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas.join('\n')}\n</urlset>\n`
  return {
    name: 'gtc-sitemap-portal',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
    },
  }
}

// El CSS principal va en línea en el HTML: la hoja externa bloqueaba el primer
// pintado ~450 ms en móvil (Lighthouse 12, 16-oct-2026). Las hojas de los
// chunks diferidos siguen como archivos.
function cssEnLinea(): Plugin {
  return {
    name: 'gtc-css-en-linea',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset' || typeof html.source !== 'string') return
      const m = html.source.match(/<link rel="stylesheet"[^>]*href="\/(assets\/index-[^"]+\.css)"[^>]*>/)
      if (!m) return
      const hoja = bundle[m[1]]
      if (!hoja || hoja.type !== 'asset') return
      html.source = html.source.replace(m[0], `<style>${String(hoja.source)}</style>`)
      delete bundle[m[1]]
    },
  }
}

export default defineConfig(async () => {
  const PRERENDER_ACTIVO = hayChromium()
  // Las oportunidades se leen siempre (el sitemap las necesita aunque no haya Chromium).
  const cuerpo = await leerApi()
  const vivas = oportunidades(cuerpo)
  const rutas = [...RUTAS_FIJAS, ...vivas.map(o => `/empleos/${o.slug}`)]
  if (!PRERENDER_ACTIVO) console.warn('[prerender] Chromium no disponible: se compila la SPA sin HTML prerenderizado.')
  else console.log(`[prerender] ${rutas.length} rutas (${vivas.length} oportunidades vivas)`)

  return {
    plugins: [
      react(),
      cssEnLinea(),
      ...(PRERENDER_ACTIVO ? [
        prerender({
          routes: rutas,
          renderer: '@prerenderer/renderer-puppeteer',
          rendererOptions: {
            // window.__PRERENDER_INJECTED: las entradas (EditorialReveal,
            // useScrollReveal) no ocultan nada cuando ven esta marca.
            inject: { prerender: true, vacantes: cuerpo ?? undefined },
            // Se espera al canonical: lo escribe react-helmet desde el componente SEO
            // de cada página, y la ficha lo pinta recién cuando la API respondió.
            // Esperar al <h1> no alcanzaba: el snapshot salía sin description, sin
            // canonical y sin JobPosting (medido el 16-oct-2026).
            renderAfterElementExists: 'link[rel="canonical"]',
            renderAfterTime: 1500,
            maxConcurrentRoutes: 2,
          },
          postProcess(renderedRoute) {
            if (renderedRoute.route === '/') renderedRoute.outputPath = HOME_PRERENDER
            renderedRoute.html = renderedRoute.html
              .replace(/https?:\/\/localhost(:\d+)?/g, BASE)
              .replace(/https?:\/\/127\.0\.0\.1(:\d+)?/g, BASE)
          },
        }),
      ] : []),
      sitemap(vivas),
      separarHomeDeLaSpa(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 8080,
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react'
            if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
            if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'vendor-i18n'
            if (id.includes('node_modules/@tanstack')) return 'vendor-query'
          },
        },
      },
    },
  }
})
