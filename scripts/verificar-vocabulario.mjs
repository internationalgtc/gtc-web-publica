#!/usr/bin/env node
// Guardia de vocabulario del portal de candidatos (auditoría legal Garrigues,
// archivo de Antonio del 15-oct-2026; spec de Ariel del 16-oct-2026, PR 2).
//
// GTC presta un servicio gestionado: no contrata, no selecciona ni cede
// personas. Lo que ve un candidato no puede sonar a relación laboral. La lista
// de términos es la misma que usa Nexus (src/config/vocabulario-servicio.ts,
// copiada acá: sin tildes, se aplica en minúsculas) más lo que el portal suma.
//
// Mira SOLO texto: literales de string y texto de JSX. Los identificadores,
// rutas y claves sin espacios no cuentan. De translations.ts revisa únicamente
// las claves que el portal usa (las de la web de empresas no se enrutan acá).
//
// Uso: node scripts/verificar-vocabulario.mjs   → sale con 1 si hay hallazgos.
import fs from 'fs'
import path from 'path'

const RAIZ = process.cwd()

// --- Lista única de Nexus (grupos) + lo que el portal suma -------------------
const PROHIBIDO = {
  nomina: [/\bnominas?\b/, /\bsalari(?:o|os|al|ales)\b/, /\bsueldos?\b/, /\bseguridad social\b/, /\bremuneraci(?:on|ones)\b/],
  contratacion: [
    /\bcontrat(?:ar|a|an|as|ado|ados|ada|adas|amos|aremos|ando|e|es|en)\b/,
    /\bcontrataci(?:on|ones)\b/,
    /\bcontrato laboral\b/,
    /\bempleados?\b/,
    /\bplantilla\b(?! de (?:correo|mensaje|email|whatsapp|meta|texto))/,
  ],
  jornada: [/\bjornadas?\b/, /\bhorario laboral\b/, /\bhoras trabajadas\b/, /\bprofesional dedicado en tu horario\b/, /\bproductividad\b/],
  vacante: [
    /\bvacantes?\b/,
    /\bpuestos?\b(?! en (?:marcha|contacto|funcionamiento|valor)\b)(?! a punto\b)/,
    /\boferta(?:s)? de (?:empleo|trabajo)\b/,
    /\bpostul(?:ar|arse|acion|aciones|ante|antes|a|an|ate|arme)\b/,
    /\bbusca(?:r|ndo)? (?:empleo|trabajo)\b/,
  ],
  supervision: [/\bsupervis(?:or|ora|ores|oras)\b/, /\bjefes?\b/, /\bsancion(?:es)?\b/, /\bdespidos?\b/],
  seleccion: [/\bcandidatos? (?:finalistas?|para tu empresa)\b/, /\belige(?:s)? a tu\b/, /\bentrevistas? y eliges\b/, /\bproceso de seleccion\b/, /\breclutad(?:or|ora|ores|oras)\b/],
  // Lo que suma el portal (tabla de la sección 4 del spec): empleo y relación laboral.
  portal: [/\bempleos?\b/, /\brelacion laboral\b/, /\baplicaci(?:on|ones)\b(?= en minutos)/],
  // Inglés: lo mismo que ve un candidato con el idioma cambiado.
  ingles: [/\bsalary\b/, /\bjobs?\b/, /\bhir(?:e|es|ed|ing)\b/, /\bemployees?\b/, /\bpayroll\b/, /\bvacanc(?:y|ies)\b/, /\bapply\b/, /\bemployment\b/],
}

// --- Qué se revisa -------------------------------------------------------------
const ARCHIVOS = [
  'index.html',
  'src/pages/HomeCandidatos.tsx',
  'src/pages/Empleos.tsx',
  'src/pages/DetallesDeEmpleo.tsx',
  'src/pages/Areas.tsx',
  'src/pages/ArticuloCandidatos.tsx',
  'src/pages/NotFound.tsx',
  'src/pages/PoliticaPrivacidad.tsx',
  'src/components/portal/VacantesPortal.tsx',
  'src/components/portal/TuSeguridad.tsx',
  'src/components/portal/HeroVideo.tsx',
  'src/components/portal/textosVacante.ts',
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/shared/SEO.tsx',
  'src/components/shared/AvisoCookies.tsx',
  'src/lib/jobPosting.ts',
  'src/lib/vacantes-nexus.ts',
  'src/lib/nexus.ts',
  'src/data/jobs.ts',
]
const TRANSLATIONS = 'src/lib/translations.ts'

/**
 * Textos que quedan a propósito, con el porqué y la fecha. Agregar acá es una
 * decisión que se le cuenta a Antonio, no un atajo para que pase la prueba.
 */
const EXCEPCIONES = [
  // Planilla de Antonio, filas T37/T46/T47 y T32: dependen de W6 (decidir si la
  // base de talento cubre encargos de GTC o búsquedas de clientes). 16-oct-2026.
  { clave: 'areas_label', motivo: 'T37 · W6' },
  { clave: 'areas_sin_area', motivo: 'T47 · W6' },
  { clave: 'areas_intro', motivo: 'T46 · W6' },
  { clave: 'emp_cta_areas', motivo: 'T37 · W6' },
  { clave: 'cand_cta_general', motivo: 'T32 · W6' },
  { clave: 'cand_general_nota', motivo: 'T32 · W6' },
  { archivo: 'src/pages/Areas.tsx', motivo: 'T46 · W6 (título y descripción de /areas)' },
  // Fila T09: «Trabajando en clientes hoy» describe la operativa actual; el
  // texto nuevo solo es verdad cuando termine la asignación exclusiva. 16-oct-2026.
  { clave: 'cand_stat_profesionales_foot', motivo: 'T09 · con la operativa' },
  // Fila T16: el cliente sigue aprobando fichas; publicar el paso 03 nuevo sería falso.
  { clave: 'cand_proc_3_d', motivo: 'T16 · con la operativa' },
  // Fila T28: Calidad mide hoy a la persona (W9).
  { clave: 'cand_com_p', motivo: 'T28 · W9' },
  // Fila T25: coordinadoras de servicio todavía no existen.
  { clave: 'cand_v3_d', motivo: 'T25 · con la operativa' },
  // Política de privacidad: T55/T56/T57 van con la operativa y W7 (candidatos). 16-oct-2026.
  { clave: /^pp_\d+_d$/, motivo: 'T55-T57 · con la operativa / W7' },
  // jobs.ts: el campo `type` guarda «Jornada Completa» como dato; lo que se
  // muestra pasa por disponibilidad() (textosVacante.ts). Las 46 fichas cerradas
  // se retiran con W5 (T45). 16-oct-2026.
  { archivo: 'src/data/jobs.ts', patron: /^\s*type:\s*"[^"]+",?$/m, motivo: 'T39 · dato, no texto mostrado' },
  // Las claves del mapa son los valores crudos de `type`; lo mostrado es el valor.
  { archivo: 'src/components/portal/textosVacante.ts', patron: /^\s*'[^']*':\s*\{ es:/m, motivo: 'T39 · claves del mapa de disponibilidad' },
  // Fichas cerradas (historial) y tablas EN: no se muestran; se retiran con W5 (T45).
  { archivo: 'src/data/jobs.ts', patron: /\/\/ VACANTES INACTIVAS[\s\S]*$/m, motivo: 'T45 · W5 (46 fichas cerradas, no se muestran)' },
]

// --- Extracción de texto -------------------------------------------------------
const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

function textoVisible(fuente) {
  return fuente
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
}

/** Quita los ${…} de un template, aunque lleven llaves anidadas. */
function sinInterpolaciones(t) {
  let out = ''
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '$' && t[i + 1] === '{') {
      let prof = 1; i += 2
      while (i < t.length && prof > 0) { if (t[i] === '{') prof++; else if (t[i] === '}') prof--; i++ }
      i--; out += ' '
    } else out += t[i]
  }
  return out
}

/** Literales de string (sin interpolaciones) y texto suelto de JSX/HTML. */
function textos(fuente) {
  const limpio = textoVisible(fuente)
  const salida = []
  const literal = /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g
  for (const m of limpio.matchAll(literal)) {
    const cuerpo = sinInterpolaciones(m[0].slice(1, -1)).trim()
    if (!/\s/.test(cuerpo) && (/^[@./]/.test(cuerpo) || /^[a-z0-9_\-[\]:/]+$/i.test(cuerpo))) continue
    // Direcciones y rutas (el subdominio empleos. y /empleos/… se quedan: cambiarlos rompe lo indexado)
    if (/^(?:https?:)?\/\/|^\//.test(cuerpo)) continue
    // clases de Tailwind: muchas palabras cortas con guiones, sin frase
    if (/^[\w\s\-\[\]:/!.%()#,>']*$/.test(cuerpo) && /(?:^|\s)(?:flex|grid|text-|bg-|px-|py-|mt-|mb-|gap-|lg:|sm:|md:|w-|h-|ed-)/.test(cuerpo) && !/[a-záéíóúñ]{4,}\s[a-záéíóúñ]{4,}\s[a-záéíóúñ]{3,}/i.test(cuerpo)) continue
    salida.push(cuerpo)
  }
  for (const m of limpio.matchAll(/(?<![=-])>([^<>{}]+)</g)) {
    if (!/;|=>|&&|\)\s*:|\?\s*\(/.test(m[1])) salida.push(m[1])
  }
  return salida
}

function hallazgos(texto, etiqueta) {
  const n = normalizar(texto)
  const out = []
  for (const [grupo, patrones] of Object.entries(PROHIBIDO)) {
    for (const rx of patrones) {
      for (const m of n.matchAll(new RegExp(rx.source, 'g'))) out.push(`${grupo}: «${m[0]}» en ${etiqueta} «${texto.trim().slice(0, 90)}»`)
    }
  }
  return out
}

const leer = (f) => fs.readFileSync(path.join(RAIZ, f), 'utf8')
const errores = []

// 1. Archivos del portal
for (const f of ARCHIVOS) {
  if (!fs.existsSync(path.join(RAIZ, f))) { errores.push(`${f}: no existe (¿cambió de lugar? actualizá la lista)`); continue }
  const exArchivo = EXCEPCIONES.filter((e) => e.archivo === f)
  if (exArchivo.some((e) => !e.patron)) continue // archivo entero exceptuado
  let fuente = leer(f)
  for (const e of exArchivo) if (e.patron) fuente = fuente.replace(new RegExp(e.patron.source, 'gm'), ' ')
  for (const t of textos(fuente)) errores.push(...hallazgos(t, f))
}

// 2. translations.ts: solo las claves que el portal usa
const fuentePortal = ARCHIVOS.filter((f) => f !== 'src/data/jobs.ts' && fs.existsSync(path.join(RAIZ, f))).map(leer).join('\n')
const tr = textoVisible(leer(TRANSLATIONS))
const lineaClave = /^\s+([a-z0-9_]+):\s*\{\s*es:\s*(['"`])((?:(?!\2)[^\\]|\\.)*)\2\s*,\s*en:\s*(['"`])((?:(?!\4)[^\\]|\\.)*)\4/gm
const usada = (k) => {
  if (new RegExp(`['"\`]${k}['"\`]`).test(fuentePortal)) return true
  // claves armadas por plantilla: cand_v${i}_t, cand_proc_${n}_d, cand_mq_${i}…
  const pref = k.replace(/\d+(_[a-z]+)?$/, '')
  return pref !== k && new RegExp('`' + pref + '\\$\\{').test(fuentePortal)
}
const exceptuada = (k) => EXCEPCIONES.some((e) => e.clave && (e.clave instanceof RegExp ? e.clave.test(k) : e.clave === k))
let claves = 0
for (const m of tr.matchAll(lineaClave)) {
  const [, k, , es, , en] = m
  if (!usada(k) || exceptuada(k)) continue
  claves++
  errores.push(...hallazgos(sinInterpolaciones(es), `${TRANSLATIONS} ${k}.es`))
  errores.push(...hallazgos(sinInterpolaciones(en), `${TRANSLATIONS} ${k}.en`))
}

if (errores.length) {
  console.error(`\n🔴 Vocabulario laboral en el portal (${errores.length}):`)
  for (const e of errores) console.error(`   - ${e}`)
  console.error('\n   La lista es la de Nexus (src/config/vocabulario-servicio.ts). Si un texto queda a propósito,')
  console.error('   va en EXCEPCIONES con la fila de la planilla de Antonio y la fecha.\n')
  process.exit(1)
}
console.log(`✅ vocabulario OK — ${ARCHIVOS.length} archivos y ${claves} claves del portal sin vocabulario laboral (${EXCEPCIONES.length} excepciones declaradas)`)
