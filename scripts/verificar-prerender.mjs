// Corta el deploy si el build no prerenderizó. Sin esta guarda el error es mudo:
// el deploy sale "Ready" y el sitio pierde el HTML que lee Google, sin un aviso.
//
// Uso: node scripts/verificar-prerender.mjs [carpeta]
//   por defecto .vercel/output/static (lo que sube deploy:prod);
//   para mirar un build local: node scripts/verificar-prerender.mjs dist
import fs from 'fs'
import path from 'path'

const STATIC = process.argv[2] || '.vercel/output/static'
const BASE = 'https://www.globaltalent-connections.com'
const TITULO_HOME = 'Global Talent Connections | Asistentes Virtuales y Talento Remoto para Empresas'

// Los artículos del blog: se leen los id del mismo archivo del que salen las
// páginas, para que un artículo nuevo no quede fuera de la comprobación.
const blogTs = fs.readFileSync('src/data/blogPosts.ts', 'utf8')
const BLOG = [...blogTs.matchAll(/^\s{4}id:\s*'([^']+)'/gm)].map(m => `blog/${m[1]}`)

// Las rutas que reciben tráfico de buscador y de campañas. '' = la home.
const RUTAS = ['', 'contacto', 'servicios', 'nosotros', 'asistente-virtual', 'calculadora-ahorro', 'blog', 'politica-de-privacidad', ...BLOG]

const errores = []
const leer = f => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null)
const atributo = (html, re) => (html.match(re) || [])[1]

for (const ruta of RUTAS) {
  const url = `/${ruta}`
  const html = leer(path.join(STATIC, ruta, 'index.html'))
  if (!html) { errores.push(`${url}: falta el HTML prerenderizado`); continue }

  // 1. Contenido visible sin JavaScript: el <div id="root"> no puede estar vacío.
  if (/<div id="root"><\/div>/.test(html)) errores.push(`${url}: llega vacío sin JavaScript (#root sin contenido)`)
  if (!/<h1[\s>]/.test(html)) errores.push(`${url}: no tiene <h1> en el HTML`)

  // 2. Título, description y canonical propios.
  const titulo = atributo(html, /<title[^>]*>([^<]*)<\/title>/)
  if (!titulo) errores.push(`${url}: sin <title>`)
  else if (ruta !== '' && titulo === TITULO_HOME) errores.push(`${url}: se guardó con el título de la home`)
  if (!/<meta name="description" content="[^"]+"/.test(html)) errores.push(`${url}: sin meta description`)
  const canonical = atributo(html, /<link rel="canonical" href="([^"]+)"/)
  const esperado = ruta === '' ? `${BASE}/` : `${BASE}/${ruta}`
  if (canonical !== esperado) errores.push(`${url}: canonical «${canonical ?? 'ninguno'}», se esperaba «${esperado}»`)
}

// 3. El esqueleto de la SPA tiene que seguir existiendo aparte: vercel.json
//    manda ahí todas las rutas sin archivo propio.
const spa = leer(path.join(STATIC, 'spa.html'))
if (!spa) errores.push('/spa.html: falta (las rutas sin HTML propio darían 404)')
else if (!/<div id="root"><\/div>/.test(spa)) errores.push('/spa.html: no es el esqueleto vacío de la SPA (¿se copió la home?)')
const p404 = leer(path.join(STATIC, '404.html'))
if (!p404) errores.push('/404.html: falta (las direcciones que no existen darían la página 404 genérica de Vercel)')
else if (!/<div id="root"><\/div>/.test(p404)) errores.push('/404.html: no es el esqueleto vacío de la SPA')

// 4. llms.txt generado en el build.
const llms = leer(path.join(STATIC, 'llms.txt'))
if (!llms || !llms.startsWith('# Global Talent Connections')) errores.push('/llms.txt: falta o no tiene el formato esperado')

if (errores.length) {
  console.error(`\n🔴 El prerender salió incompleto (${STATIC}):`)
  for (const e of errores) console.error(`   - ${e}`)
  console.error('\n   Deployar así publica páginas que el rastreador no ve bien.')
  console.error('   Revisa que Chromium de puppeteer esté instalado (npx puppeteer browsers install chrome)')
  console.error('   y que deploy:prod siga pasando PRERENDER=1.\n')
  process.exit(1)
}

console.log(`✅ prerender OK — ${RUTAS.length} rutas con HTML, título, description y canonical propios en ${STATIC}; spa.html, 404.html y llms.txt presentes`)
