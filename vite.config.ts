import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { createRequire } from 'module'
import prerender from '@prerenderer/rollup-plugin'

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
  // `PRERENDER` manda sobre la guarda de abajo: '0' lo apaga, '1' lo enciende.
  //
  // El '1' existe por `npm run deploy:prod`, que es el ÚNICO camino que publica
  // el HTML prerenderizado — y que compila con `vercel build` EN LOCAL. Resulta
  // que `vercel build` define VERCEL=1 igual que el build remoto (verificado el
  // 10-sep-2026: con Chromium instalado, imprimía «Chromium no disponible»), así
  // que la guarda apagaba el prerender justo en el camino pensado para activarlo.
  // Efecto medido: producción sirvió durante días el mismo HTML de 6 KB en todas
  // las rutas, incluidas las de tráfico pagado.
  //
  // El build remoto de Vercel nunca define PRERENDER=1, así que sigue protegido.
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
// PAGADO o de buscador: el rastreador tiene que ver el contenido sin ejecutar
// JavaScript. Las rutas con parámetro (/empleos/:id, /blog/:id) quedan fuera a
// propósito: su contenido viene de la API en tiempo real.
// 🔴 La home («/») se deja FUERA a propósito: al prerenderizarla, el plugin
// ELIMINA el `dist/index.html` que genera Vite y el sitio se queda sin home
// (verificado en este repo el 8-sep-2026). Las rutas que reciben el tráfico
// pagado son las de abajo, así que la home no pierde nada.
const RUTAS_PRERENDER = [
  '/asistente-virtual',
  '/calculadora-ahorro',
  '/servicios',
  '/contacto',
  '/nosotros',
  '/blog',
  '/politica-de-privacidad',
  // Retiradas el 8-sep-2026: el portal de candidatos es otro dominio. Se
  // prerenderizan A PROPÓSITO para que el HTML que Google recibe en esas
  // direcciones (que tiene indexadas) traiga el 404 y el `noindex` sin
  // depender de que ejecute JavaScript. No redirigen: no existen.
  '/empleos',
  '/beneficios',
]

export default defineConfig({
  plugins: [
    react(),
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
        renderAfterElementExists: 'h1',
        // Colchón para que react-helmet termine de escribir <title>/<meta>.
        renderAfterTime: 1500,
        maxConcurrentRoutes: 2,
      },
      postProcess(renderedRoute) {
        // El prerender corre en localhost: si algún href absoluto se coló, se
        // devuelve al dominio real para no publicar enlaces a 127.0.0.1.
        renderedRoute.html = renderedRoute.html
          .replace(/https?:\/\/localhost(:\d+)?/g, 'https://globaltalent-connections.com')
          .replace(/https?:\/\/127\.0\.0\.1(:\d+)?/g, 'https://globaltalent-connections.com')
      },
    }),
    ] : []),
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
})
