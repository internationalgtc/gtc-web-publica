import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import prerender from '@prerenderer/rollup-plugin'

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
  '/beneficios',
  '/empleos',
  '/blog',
  '/politica-de-privacidad',
]

export default defineConfig({
  plugins: [
    react(),
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
