// Corta con error si lo que se acaba de buildear NO es lo que sirve el dominio.
//
// Por qué existe: el 28-sep-2026 `deploy:prod` salió con código 0 teniendo el deploy
// fallado. Vercel había devuelto «You don't have permission to create a Production
// Deployment for this project», pero lo imprimió como JSON y el CLI igual terminó en 0,
// así que la cadena de `&&` siguió como si todo hubiera salido bien. Durante una hora
// dimos por publicado algo que nunca salió, y el sitio siguió sirviendo el build viejo.
//
// El COORDINACION.md ya pedía «verificar que los cambios están visibles» a mano. Esto es
// esa verificación, hecha sola y capaz de cortar: es el hermano de verificar-prerender,
// que existe por la misma razón —un error mudo que deja el sitio en un estado que nadie
// mira—.
//
// Cómo verifica: compara el chunk fingerprinteado que referencia el index.html recién
// construido contra el que referencia el dominio en vivo. Si el deploy llegó, el nombre
// coincide; si no llegó, el dominio sigue nombrando el anterior. El hash lo pone el
// bundler a partir del contenido, así que no hay forma de que coincida por casualidad.
//
// Uso: node scripts/verificar-publicado.mjs [carpeta]
import fs from 'fs'
import path from 'path'

const STATIC = process.argv[2] || '.vercel/output/static'
const BASE = 'https://www.globaltalent-connections.com'
// El CDN puede tardar unos segundos en servir el deploy nuevo. No son reintentos por las
// dudas: es el tiempo real de propagación, y si pasado eso sigue viejo, es que no llegó.
const INTENTOS = 6
const ESPERA_MS = 5000

const chunkDe = (html) => html.match(/assets\/index-[A-Za-z0-9_.-]+\.js/)?.[0] ?? null

const local = chunkDe(fs.readFileSync(path.join(STATIC, 'index.html'), 'utf8'))
if (!local) {
  console.error(`\n🔴 No se encontró el chunk de la home en ${STATIC}/index.html.`)
  console.error('   Sin eso no hay forma de comprobar si el deploy llegó. Revisa el build.\n')
  process.exit(1)
}

for (let i = 1; i <= INTENTOS; i++) {
  let vivo = null
  try {
    const r = await fetch(`${BASE}/?verificacion=${Date.now()}`, { cache: 'no-store' })
    vivo = chunkDe(await r.text())
  } catch (e) {
    console.log(`   intento ${i}/${INTENTOS}: no se pudo leer el sitio (${e.message})`)
  }
  if (vivo === local) {
    console.log(`✅ publicado — ${BASE} ya sirve ${local}`)
    process.exit(0)
  }
  if (i < INTENTOS) await new Promise((r) => setTimeout(r, ESPERA_MS))
  else {
    console.error('\n🔴 El deploy NO llegó al dominio.')
    console.error(`   construido: ${local}`)
    console.error(`   en vivo:    ${vivo ?? '(no se pudo leer)'}`)
    console.error('\n   El comando puede haber salido con código 0 igual: Vercel devuelve algunos')
    console.error('   errores como JSON sin fallar. Leé la salida de `vercel deploy` de arriba;')
    console.error('   si dice "You don\'t have permission", te falta el rol Member en el equipo.\n')
    process.exit(1)
  }
}
