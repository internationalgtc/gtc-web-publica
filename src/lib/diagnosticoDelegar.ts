import type { ServicioGestionado, ServicioId } from '../data/serviciosGestionados'

/**
 * Diagnóstico «¿Qué deberías delegar?» (/diagnostico-delegar). Lógica pura:
 * sin React, sin red y sin imports de valores, para que la pruebe
 * scripts/verificar-diagnostico.mjs con Node.
 *
 * Mecánica tomada de Get Staffed Up (matriz de 4) y de The Virtual Hub (horas y
 * euros), sobre los doce servicios del menú comercial:
 *
 *               │ te quita mucho tiempo │ te quita poco
 *   ────────────┼───────────────────────┼──────────────────
 *   sin tu      │ DELEGA PRIMERO        │ AGRÚPALO Y DELEGA
 *   criterio    │ (se libera entero)    │ (se libera entero)
 *   ────────────┼───────────────────────┼──────────────────
 *   con tu      │ REPÁRTELO             │ QUÉDATELO
 *   criterio    │ (se libera la mitad)  │ (no se libera)
 *
 * Las horas que la persona dice dedicar a lo marcado se reparten entre esas
 * tareas: las que «quitan mucho tiempo» pesan el doble. Es una estimación con
 * sus respuestas, no un presupuesto: la página lo dice así.
 */

export type Cuadrante = 'primero' | 'agrupar' | 'repartir' | 'quedarte'

export const CUADRANTES: readonly Cuadrante[] = ['primero', 'agrupar', 'repartir', 'quedarte']

/** Qué parte de las horas de una tarea se libera según su cuadrante. */
const LIBERA: Record<Cuadrante, number> = { primero: 1, agrupar: 1, repartir: 0.5, quedarte: 0 }

/** Semanas por mes (52 / 12). */
export const SEMANAS_MES = 4.33

export const OPCIONES_HORAS_DUENO = ['menos-40', '40-50', '50-60', 'mas-60'] as const
export type HorasDueno = (typeof OPCIONES_HORAS_DUENO)[number]

export const OPCIONES_HORAS_TAREAS = [5, 10, 15, 20, 30, 40] as const
export const OPCIONES_VALOR_HORA = [30, 50, 75, 100, 150] as const
export const VALOR_HORA_POR_DEFECTO = 50

export const OPCIONES_DESTINO = ['vender', 'clientes', 'dirigir', 'descansar'] as const
export type Destino = (typeof OPCIONES_DESTINO)[number]

export interface Respuestas {
  horasDueno: HorasDueno | null
  /** Lo que todavía hace la persona (ids de servicio). */
  tareas: ServicioId[]
  /** De lo marcado, lo que necesita de verdad su criterio. */
  criterio: ServicioId[]
  /** De lo marcado, lo que más tiempo le quita. */
  tiempo: ServicioId[]
  /** Horas por semana que se van en todo lo marcado. */
  horasTareas: number | null
  /** Euros que vale una hora suya dedicada a vender o a dirigir. */
  valorHora: number | null
  destino: Destino | null
}

export const RESPUESTAS_VACIAS: Respuestas = {
  horasDueno: null,
  tareas: [],
  criterio: [],
  tiempo: [],
  horasTareas: null,
  valorHora: null,
  destino: null,
}

export function cuadranteDe(id: ServicioId, r: Respuestas): Cuadrante {
  const conCriterio = r.criterio.includes(id)
  const muchoTiempo = r.tiempo.includes(id)
  if (!conCriterio) return muchoTiempo ? 'primero' : 'agrupar'
  return muchoTiempo ? 'repartir' : 'quedarte'
}

export interface Resultado {
  porCuadrante: Record<Cuadrante, ServicioId[]>
  /** Horas por semana que se liberan, redondeadas a la media hora. */
  horasSemana: number
  /** Valor al mes de esas horas, redondeado a la decena de euros. */
  valorMes: number
  /** Hasta tres servicios para empezar, en orden de prioridad. */
  recomendados: ServicioGestionado[]
  /** El precio desde más bajo de los recomendados (null si no hay). */
  desdeMinimo: number | null
}

const redondear = (n: number, paso: number) => Math.round(n / paso) * paso

export function calcular(r: Respuestas, servicios: readonly ServicioGestionado[]): Resultado {
  // Solo cuenta lo marcado en el paso 2: si después desmarcó una tarea, sus
  // casillas de criterio o tiempo ya no valen.
  const tareas = servicios.filter(s => r.tareas.includes(s.id)).map(s => s.id)
  const porCuadrante: Record<Cuadrante, ServicioId[]> = { primero: [], agrupar: [], repartir: [], quedarte: [] }
  for (const id of tareas) porCuadrante[cuadranteDe(id, r)].push(id)

  const peso = (id: ServicioId) => (r.tiempo.includes(id) ? 2 : 1)
  const pesoTotal = tareas.reduce((acc, id) => acc + peso(id), 0)
  const horas = r.horasTareas ?? 0
  const liberadas = pesoTotal === 0
    ? 0
    : tareas.reduce((acc, id) => acc + (horas * peso(id)) / pesoTotal * LIBERA[cuadranteDe(id, r)], 0)

  const horasSemana = redondear(liberadas, 0.5)
  const valorHora = r.valorHora ?? VALOR_HORA_POR_DEFECTO
  const valorMes = redondear(horasSemana * SEMANAS_MES * valorHora, 10)

  const orden: Cuadrante[] = ['primero', 'agrupar', 'repartir']
  const ids = orden.flatMap(c => porCuadrante[c]).slice(0, 3)
  const recomendados = ids
    .map(id => servicios.find(s => s.id === id))
    .filter((s): s is ServicioGestionado => Boolean(s))
  const desdeMinimo = recomendados.length ? Math.min(...recomendados.map(s => s.desde)) : null

  return { porCuadrante, horasSemana, valorMes, recomendados, desdeMinimo }
}

const ETIQUETA_CUADRANTE: Record<Cuadrante, string> = {
  primero: 'Delega primero',
  agrupar: 'Agrúpalo y delega',
  repartir: 'Repártelo (prepara otro, decides tú)',
  quedarte: 'Quédatelo',
}

const ETIQUETA_DESTINO: Record<Destino, string> = {
  vender: 'vender más',
  clientes: 'atender mejor a sus clientes',
  dirigir: 'dirigir y planificar',
  descansar: 'descansar',
}

const ETIQUETA_HORAS_DUENO: Record<HorasDueno, string> = {
  'menos-40': 'menos de 40 h',
  '40-50': 'entre 40 y 50 h',
  '50-60': 'entre 50 y 60 h',
  'mas-60': 'más de 60 h',
}

/** «1.300 €» / «€1,300». En español el punto va siempre, también con cuatro
 *  cifras (es-ES lo omite por defecto y el menú escribe «1.300 €»). */
export function euros(n: number, lang: 'es' | 'en' = 'es'): string {
  const miles = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.')
  return lang === 'en' ? `€${miles}` : `${miles} €`
}

/** Horas con coma decimal en español: «7,5». */
export function horas(n: number, lang: 'es' | 'en' = 'es'): string {
  return n.toLocaleString(lang === 'en' ? 'en-GB' : 'es-ES', { maximumFractionDigits: 1 })
}

/**
 * El resultado en texto, para que viaje con la solicitud a Nexus (lo lee el
 * equipo comercial, siempre en español). Va delante del mensaje de la persona.
 */
export function resumenParaSolicitud(r: Respuestas, res: Resultado, servicios: readonly ServicioGestionado[]): string {
  const nombre = (id: ServicioId) => servicios.find(s => s.id === id)?.nombre.es ?? id
  const lineas = ['Diagnóstico «¿Qué deberías delegar?» (web):']
  if (r.horasDueno) lineas.push(`- Trabaja ${ETIQUETA_HORAS_DUENO[r.horasDueno]} a la semana.`)
  for (const c of CUADRANTES) {
    if (res.porCuadrante[c].length) lineas.push(`- ${ETIQUETA_CUADRANTE[c]}: ${res.porCuadrante[c].map(nombre).join(', ')}.`)
  }
  lineas.push(`- En lo marcado se le van ${r.horasTareas ?? 0} h por semana; se liberarían unas ${horas(res.horasSemana)} h.`)
  lineas.push(`- A ${euros(r.valorHora ?? VALOR_HORA_POR_DEFECTO)} la hora, ese tiempo vale unos ${euros(res.valorMes)} al mes.`)
  if (r.destino) lineas.push(`- Lo dedicaría a ${ETIQUETA_DESTINO[r.destino]}.`)
  return lineas.join('\n')
}
