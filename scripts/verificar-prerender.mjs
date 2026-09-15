// Corta el deploy si el build no prerenderizó. Sin esta guarda el error es mudo:
// el deploy sale "Ready" y el sitio pierde el HTML que lee Google, sin un aviso.
import fs from 'fs'
import path from 'path'

const STATIC = '.vercel/output/static'
// Las rutas que reciben tráfico de buscador y de campañas. La home («/») queda
// fuera a propósito: el plugin de prerender borra el index.html de Vite.
const RUTAS = ['contacto', 'servicios', 'nosotros', 'asistente-virtual', 'calculadora-ahorro']

const faltan = RUTAS.filter(r => !fs.existsSync(path.join(STATIC, r, 'index.html')))

if (faltan.length) {
  console.error(`\n🔴 El build salió SIN prerender: falta ${faltan.map(r => `/${r}`).join(', ')}.`)
  console.error('   Deployar así publica la SPA pelada y el rastreador no ve el contenido.')
  console.error('   Revisá que Chromium de puppeteer esté instalado (npx puppeteer browsers install chrome)')
  console.error('   y que deploy:prod siga pasando PRERENDER=1.\n')
  process.exit(1)
}

console.log(`✅ prerender OK — ${RUTAS.length} rutas con HTML propio en ${STATIC}`)
