// Corta el deploy si el build no prerenderizó. Sin esta guarda el error es mudo:
// el deploy sale "Ready" y el portal pierde el HTML que lee Google.
//
// Uso: node scripts/verificar-prerender.mjs [carpeta]   (por defecto .vercel/output/static)
import fs from 'fs'
import path from 'path'

const STATIC = process.argv[2] || '.vercel/output/static'
const BASE = 'https://empleos.globaltalent-connections.com'
const TITULO_HOME = 'Colabora en remoto desde Latinoamérica | Global Talent Connections'

const leer = f => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null)
const atributo = (html, re) => (html.match(re) || [])[1]
const errores = []

// Las rutas salen del sitemap que generó el mismo build: una sola lista.
const sitemap = leer(path.join(STATIC, 'sitemap.xml'))
if (!sitemap) { console.error('🔴 falta sitemap.xml en el build'); process.exit(1) }
const RUTAS = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(BASE, '') || '/')
const oportunidades = RUTAS.filter(r => r.startsWith('/empleos/')).length
if (oportunidades === 0) errores.push('el sitemap no lista ninguna oportunidad (¿la API de Nexus no respondió en el build?)')

for (const ruta of RUTAS) {
  const html = leer(path.join(STATIC, ruta === '/' ? 'index.html' : path.join(ruta.slice(1), 'index.html')))
  if (!html) { errores.push(`${ruta}: falta el HTML prerenderizado`); continue }
  if (/<div id="root"><\/div>/.test(html)) errores.push(`${ruta}: llega vacío sin JavaScript (#root sin contenido)`)
  if (!/<h1[\s>]/.test(html)) errores.push(`${ruta}: no tiene <h1> en el HTML`)
  const titulo = atributo(html, /<title[^>]*>([^<]*)<\/title>/)
  if (!titulo) errores.push(`${ruta}: sin <title>`)
  else if (ruta !== '/' && titulo === TITULO_HOME) errores.push(`${ruta}: se guardó con el título de la home`)
  if (!/<meta name="description" content="[^"]+"/.test(html)) errores.push(`${ruta}: sin meta description`)
  const canonical = atributo(html, /<link rel="canonical" href="([^"]+)"/)
  const esperado = ruta === '/' ? `${BASE}/` : `${BASE}${ruta}`
  if (canonical !== esperado) errores.push(`${ruta}: canonical «${canonical ?? 'ninguno'}», se esperaba «${esperado}»`)
  if (ruta.startsWith('/empleos/') && !/"@type":"JobPosting"/.test(html)) errores.push(`${ruta}: sin JobPosting en el HTML`)
}

const spa = leer(path.join(STATIC, 'spa.html'))
if (!spa) errores.push('/spa.html: falta (las rutas sin HTML propio darían 404)')
else if (!/<div id="root"><\/div>/.test(spa)) errores.push('/spa.html: no es el esqueleto vacío de la SPA')
if (!leer(path.join(STATIC, '404.html'))) errores.push('/404.html: falta')

if (errores.length) {
  console.error(`\n🔴 El prerender salió incompleto (${STATIC}):`)
  for (const e of errores) console.error(`   - ${e}`)
  console.error('\n   Revisa que Chromium de puppeteer esté instalado (npx puppeteer browsers install chrome)')
  console.error('   y que deploy:prod siga pasando PRERENDER=1.\n')
  process.exit(1)
}
console.log(`✅ prerender OK — ${RUTAS.length} rutas con HTML, título, description y canonical propios (${oportunidades} oportunidades con JobPosting); spa.html y 404.html presentes`)
