import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { createRequire } from 'module'
import { execFileSync } from 'child_process'
import prerender from '@prerenderer/rollup-plugin'
import type { Plugin } from 'vite'
import { blogPosts } from './src/data/blogPosts'
import { generarLlmsTxt } from './scripts/llms'
import { ARTICULOS_PROPIOS } from './api/_blog-leax'

// La función del blog (api/blog-articulo.ts) deja pasar a la SPA los artículos
// escritos a mano y pide el resto a Leax. Si se suma uno acá y no allá, la
// función lo buscaría en Leax y daría 404: el build no sigue.
{
  const propios = blogPosts.map(p => p.id).sort().join(',')
  if (propios !== [...ARTICULOS_PROPIOS].sort().join(',')) {
    throw new Error(`api/_blog-leax.ts ARTICULOS_PROPIOS (${ARTICULOS_PROPIOS.join(', ')}) no coincide con src/data/blogPosts.ts (${propios}).`)
  }
}

// 🔴 El prerender necesita un Chromium REAL y solo se activa si está instalado
// en la máquina que compila.
//
// Por qué: en el build remoto de Vercel, puppeteer se queda descargando Chromium
// y el deploy se cuelga — medido el 8-sep-2026: 14 min en estado UNKNOWN, sin
// logs, cuando un build normal de esta web tarda 18 s. Con esta guarda, un build
// sin Chromium NO falla: publica la SPA de siempre, exactamente como hasta hoy.
//
// ⇒ Para que el HTML prerenderizado llegue a producción hay que compilar EN LOCAL
//   y subir el resultado ya compilado:  npm run deploy:prod
// 🔑 NO usar `puppeteer.executablePath()`: en puppeteer 24 devuelve una Promise,
// y `vite.config` tiene que decidir de forma SÍNCRONA si añade el plugin. Se
// mira directamente la caché de navegadores, que es donde puppeteer los instala.
function hayChromium(): boolean {
  // El runtime de build de Vercel no incluye las librerías del sistema que
  // necesita Chromium. Aunque encuentre una caché parcial de Puppeteer, lanzar
  // el navegador falla y bloquea el deploy. En Vercel se publica la SPA; el
  // prerender se conserva para builds locales que se suban precompilados.
  // PRERENDER=1 fuerza el prerender aunque `VERCEL` esté definido. Hace falta
  // porque `vercel build` LOCAL también setea VERCEL=1: sin esta salida, el
  // propio `npm run deploy:prod` publicaba la SPA pelada — `.vercel/output/static`
  // con solo `index.html`, sin /contacto, /servicios, /nosotros… que es justo el
  // HTML que lee Google (medido el 15-sep-2026). El build REMOTO de Vercel sigue
  // protegido: allá nadie define PRERENDER.
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

const PRERENDER_ACTIVO = hayChromium()
if (!PRERENDER_ACTIVO) {
  console.warn('[prerender] Chromium no disponible: se compila la SPA sin HTML prerenderizado.')
}

// Rutas que se guardan como HTML ya renderizado. Son las que reciben tráfico
// PAGADO o de buscador: el rastreador (y los de IA, que casi nunca ejecutan
// JavaScript) tiene que ver el contenido sin ejecutar JavaScript.
//
// 🔴 LA HOME («/») — cómo entra sin romper el sitio (28-sep-2026)
// Si el plugin guarda «/» en `index.html`, PISA el esqueleto de la SPA que
// genera Vite (el 8-sep-2026 el sitio se quedó sin home por eso). Por eso:
//   1. el HTML de la home se guarda aparte, en HOME_PRERENDER (ver postProcess);
//   2. `separarHomeDeLaSpa` (abajo) copia el esqueleto a `spa.html` y recién
//      después pone la home prerenderizada en `index.html`;
//   3. `vercel.json` manda las rutas sin archivo propio a `/spa.html`, NO a
//      `/index.html`: así ninguna otra dirección recibe el HTML de la home.
// Sin Chromium (build remoto de Vercel) no hay HOME_PRERENDER: `index.html`
// queda como esqueleto y `spa.html` es una copia idéntica. Nada se rompe.
//
// Los artículos del blog salen de src/data/blogPosts.ts (no de una API), así
// que también se prerenderizan.
const HOME_PRERENDER = '_home-prerender.html'
const RUTAS_BLOG = blogPosts.map(p => `/blog/${p.id}`)
const RUTAS_PRERENDER = [
  '/',
  '/asistente-virtual',
  // /calculadora-ahorro se apagó el 14-oct-2026 (auditoría Garrigues, T02):
  // redirige a /servicios, no hay HTML que prerenderizar.
  '/servicios',
  '/contacto',
  '/nosotros',
  '/que-es-gtc',
  '/blog',
  '/politica-de-privacidad',
  // /empleos, /empleos/:id y /beneficios ya no se prerenderizan: desde el
  // 28-sep-2026 redirigen a la portada (vercel.json). NO al portal de
  // candidatos: Ariel, 8-sep-2026, «que no quede linkeada, que no exista,
  // que no redirija» (ver src/App.tsx).
  ...RUTAS_BLOG,
]

function separarHomeDeLaSpa(): Plugin {
  return {
    name: 'gtc-separar-home-de-la-spa',
    apply: 'build',
    writeBundle(options) {
      const dir = options.dir ?? path.resolve(__dirname, 'dist')
      const index = path.join(dir, 'index.html')
      const home = path.join(dir, HOME_PRERENDER)
      // Siempre: el esqueleto de la SPA en spa.html (destino del rewrite).
      fs.copyFileSync(index, path.join(dir, 'spa.html'))
      // Y en 404.html: Vercel lo sirve con estado 404 a toda dirección que no
      // existe (vercel.json ya no reescribe «todo» a la SPA). Como es la misma
      // SPA, React muestra la página «no encontrada» con su noindex.
      fs.copyFileSync(index, path.join(dir, '404.html'))
      if (fs.existsSync(home)) fs.renameSync(home, index)
    },
  }
}

// sitemap.xml se genera en el build con el último commit que tocó cada página
// (o translations.ts, que las alimenta a todas). Antes era un archivo a mano
// con todas las fechas en junio.
function sitemapXml(): Plugin {
  const BASE = 'https://www.globaltalent-connections.com'
  const fecha = (archivos: string[]) => {
    const fechas = archivos.map(a => {
      try { return execFileSync('git', ['log', '-1', '--format=%cs', '--', a], { cwd: __dirname, encoding: 'utf8' }).trim() } catch { return '' }
    }).filter(Boolean)
    return fechas.sort().at(-1) ?? new Date().toISOString().slice(0, 10)
  }
  const T = 'src/lib/translations.ts'
  const paginas: Array<[string, string[], string, string]> = [
    ['/', ['src/pages/Index.tsx', T, 'src/data/cifras.ts'], 'weekly', '1.0'],
    ['/servicios', ['src/pages/Servicios.tsx', T], 'monthly', '0.9'],
    ['/asistente-virtual', ['src/pages/AsistenteVirtual.tsx', T], 'monthly', '0.8'],
    ['/nosotros', ['src/pages/Nosotros.tsx', 'src/data/equipo.ts', T], 'monthly', '0.7'],
    ['/que-es-gtc', ['src/pages/QueEsGtc.tsx', 'src/data/queEsGtc.ts', T], 'monthly', '0.7'],
    ['/contacto', ['src/pages/Contacto.tsx', T], 'monthly', '0.8'],
    ['/blog', ['src/pages/Blog.tsx', 'src/data/blogPosts.ts'], 'weekly', '0.6'],
    ...blogPosts.map(p => [`/blog/${p.id}`, ['src/data/blogPosts.ts'], 'monthly', '0.5'] as [string, string[], string, string]),
    ['/politica-de-privacidad', ['src/pages/PoliticaPrivacidad.tsx', T], 'yearly', '0.3'],
  ]
  const filas = paginas.map(([ruta, archivos, freq, prio]) =>
    `  <url>\n    <loc>${BASE}${ruta}</loc>\n    <lastmod>${fecha(archivos)}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generado en el build (vite.config.ts): lastmod = último commit de cada página. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas.join('\n')}\n</urlset>\n`
  return {
    name: 'gtc-sitemap-xml',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
    },
  }
}

// /llms.txt se genera en el build con los mismos textos y cifras de la web.
function llmsTxt(): Plugin {
  return {
    name: 'gtc-llms-txt',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: generarLlmsTxt() })
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

export default defineConfig({
  plugins: [
    react(),
    cssEnLinea(),
    ...(PRERENDER_ACTIVO ? [
    // Antes, TODA ruta devolvía el mismo index.html de 6 KB con un <div id="root">
    // vacío: el contenido lo pintaba React en el navegador. Google Ads puntúa la
    // «experiencia de la página de destino» comparándola con los demás anunciantes
    // de esa búsqueda, y esa nota mueve el CPC. Ahora cada ruta se guarda con su
    // HTML ya pintado; React hidrata encima y el usuario ve exactamente lo mismo.
    prerender({
      routes: RUTAS_PRERENDER,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        // 🔑 NO basta con esperar a que React monte (`#root > *`): en ese instante
        // el <title> y las meta de react-helmet todavía no se han aplicado y el
        // snapshot sale con el título genérico y sin <h1>. Se espera al <h1>, que
        // solo existe cuando la página ya pintó su contenido real.
        // window.__PRERENDER_INJECTED: las entradas (EditorialReveal, useScrollReveal)
        // no ocultan nada cuando ven esta marca. Sin ella el HTML prerenderizado
        // salía con 65 bloques en opacity: 0 (medido el 16-oct-2026).
        inject: { prerender: true },
        renderAfterElementExists: 'h1',
        // Colchón para que react-helmet termine de escribir <title>/<meta>.
        renderAfterTime: 1500,
        maxConcurrentRoutes: 2,
      },
      postProcess(renderedRoute) {
        // La home NO se escribe en index.html (ver HOME_PRERENDER arriba).
        if (renderedRoute.route === '/') renderedRoute.outputPath = HOME_PRERENDER
        // El prerender corre en localhost: si algún href absoluto se coló, se
        // devuelve al dominio real para no publicar enlaces a 127.0.0.1.
        renderedRoute.html = renderedRoute.html
          .replace(/<html([^>]*)\sclass="fuentes-listas"/, '<html$1')
          .replace(/https?:\/\/localhost(:\d+)?/g, 'https://globaltalent-connections.com')
          .replace(/https?:\/\/127\.0\.0\.1(:\d+)?/g, 'https://globaltalent-connections.com')
      },
    }),
    ] : []),
    llmsTxt(),
    sitemapXml(),
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
    // Sin <link rel="modulepreload">: los chunks de JS salían con prioridad alta a la
    // vez que el póster del hero (LCP) y lo retrasaban ~2 s en móvil lento
    // (Lighthouse 12, 16-oct-2026). Los carga el módulo de entrada cuando ejecuta.
    modulePreload: false,
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
})
