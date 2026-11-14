#!/usr/bin/env node
// Prueba la lógica del diagnóstico «¿Qué deberías delegar?» (src/lib/diagnosticoDelegar.ts)
// con los doce servicios del menú. Corre con Node, sin framework de pruebas:
//   node --experimental-strip-types --no-warnings scripts/verificar-diagnostico.mjs
import assert from 'node:assert/strict'
import { calcular, cuadranteDe, resumenParaSolicitud, RESPUESTAS_VACIAS, SEMANAS_MES } from '../src/lib/diagnosticoDelegar.ts'
import { SERVICIOS_GESTIONADOS } from '../src/data/serviciosGestionados.ts'

const pruebas = []
const prueba = (nombre, fn) => pruebas.push([nombre, fn])
const r = (cambios) => ({ ...RESPUESTAS_VACIAS, ...cambios })

prueba('el menú tiene los doce servicios, con precio y con qué se mide', () => {
  assert.equal(SERVICIOS_GESTIONADOS.length, 12)
  for (const s of SERVICIOS_GESTIONADOS) {
    assert.ok(s.desde >= 1300, `${s.id} sin precio desde`)
    assert.ok(s.mide.length >= 2, `${s.id} sin medidas`)
    assert.ok(s.dejas.es && s.dejas.en, `${s.id} sin texto en los dos idiomas`)
  }
  assert.equal(Math.min(...SERVICIOS_GESTIONADOS.map(s => s.desde)), 1300, 'el «desde» de la web es 1.300 €')
})

prueba('los cuatro cuadrantes salen de criterio × tiempo', () => {
  const base = r({ tareas: ['ventas-prospeccion'], criterio: [], tiempo: [] })
  assert.equal(cuadranteDe('ventas-prospeccion', { ...base, tiempo: ['ventas-prospeccion'] }), 'primero')
  assert.equal(cuadranteDe('ventas-prospeccion', base), 'agrupar')
  assert.equal(cuadranteDe('ventas-prospeccion', { ...base, criterio: ['ventas-prospeccion'], tiempo: ['ventas-prospeccion'] }), 'repartir')
  assert.equal(cuadranteDe('ventas-prospeccion', { ...base, criterio: ['ventas-prospeccion'] }), 'quedarte')
})

prueba('las horas se reparten con peso doble para lo que más tiempo quita', () => {
  // 20 h entre dos tareas: la que quita tiempo pesa 2 (13,33 h) y la otra 1 (6,67 h).
  // Ninguna necesita criterio: se libera todo.
  const res = calcular(r({ tareas: ['contabilidad-cobros', 'atencion-cliente'], tiempo: ['contabilidad-cobros'], horasTareas: 20, valorHora: 50 }), SERVICIOS_GESTIONADOS)
  assert.equal(res.horasSemana, 20)
  assert.equal(res.valorMes, Math.round((20 * SEMANAS_MES * 50) / 10) * 10)
  assert.deepEqual(res.porCuadrante.primero, ['contabilidad-cobros'])
  assert.deepEqual(res.porCuadrante.agrupar, ['atencion-cliente'])
})

prueba('lo que necesita tu criterio libera la mitad (repartir) o nada (quedarte)', () => {
  // 3 tareas con 30 h: pesos 2 (repartir) + 1 (quedarte) + 1 (agrupar) = 4.
  // repartir 15 h × 0,5 = 7,5 · quedarte 7,5 × 0 = 0 · agrupar 7,5 × 1 = 7,5 → 15 h.
  const res = calcular(
    r({
      tareas: ['ventas-prospeccion', 'contenidos-redes', 'administracion-gestion'],
      criterio: ['ventas-prospeccion', 'contenidos-redes'],
      tiempo: ['ventas-prospeccion'],
      horasTareas: 30,
      valorHora: 100,
    }),
    SERVICIOS_GESTIONADOS,
  )
  assert.equal(res.horasSemana, 15)
  assert.deepEqual(res.porCuadrante.quedarte, ['contenidos-redes'])
  // Lo que te quedas no se recomienda; el orden es agrupar antes que repartir.
  assert.deepEqual(res.recomendados.map(s => s.id), ['administracion-gestion', 'ventas-prospeccion'])
})

prueba('sin respuestas no hay horas ni recomendaciones', () => {
  const res = calcular(RESPUESTAS_VACIAS, SERVICIOS_GESTIONADOS)
  assert.equal(res.horasSemana, 0)
  assert.equal(res.valorMes, 0)
  assert.equal(res.recomendados.length, 0)
  assert.equal(res.desdeMinimo, null)
})

prueba('una casilla de criterio o tiempo de una tarea desmarcada no cuenta', () => {
  const res = calcular(r({ tareas: ['diseno-grafico-video'], criterio: ['ventas-prospeccion'], tiempo: ['ventas-prospeccion'], horasTareas: 10 }), SERVICIOS_GESTIONADOS)
  assert.equal(res.horasSemana, 10)
  assert.deepEqual(res.recomendados.map(s => s.id), ['diseno-grafico-video'])
})

prueba('recomienda tres como mucho y el «desde» es el de esos servicios', () => {
  const todas = SERVICIOS_GESTIONADOS.map(s => s.id)
  const res = calcular(r({ tareas: todas, tiempo: ['automatizacion-ia'], horasTareas: 40, valorHora: 30 }), SERVICIOS_GESTIONADOS)
  assert.equal(res.recomendados.length, 3)
  assert.equal(res.recomendados[0].id, 'automatizacion-ia')
  assert.equal(res.desdeMinimo, 1300)
  const soloIa = calcular(r({ tareas: ['automatizacion-ia'], horasTareas: 5 }), SERVICIOS_GESTIONADOS)
  assert.equal(soloIa.desdeMinimo, 1450)
})

prueba('el resumen para Nexus lleva cuadrantes, horas, valor y destino', () => {
  const resp = r({ horasDueno: 'mas-60', tareas: ['contabilidad-cobros'], tiempo: ['contabilidad-cobros'], horasTareas: 10, valorHora: 75, destino: 'vender' })
  const texto = resumenParaSolicitud(resp, calcular(resp, SERVICIOS_GESTIONADOS), SERVICIOS_GESTIONADOS)
  assert.match(texto, /Delega primero: Contabilidad, facturación y cobros/)
  assert.match(texto, /más de 60 h/)
  assert.match(texto, /se liberarían unas 10 h/)
  assert.match(texto, /3\.250 € al mes/)
  assert.match(texto, /vender más/)
})

let fallos = 0
for (const [nombre, fn] of pruebas) {
  try { fn(); console.log(`  ✓ ${nombre}`) } catch (e) { fallos++; console.error(`  ✗ ${nombre}\n    ${e.message}`) }
}
if (fallos) { console.error(`\n🔴 diagnóstico: ${fallos} de ${pruebas.length} pruebas fallaron`); process.exit(1) }
console.log(`✅ diagnóstico OK — ${pruebas.length} pruebas`)
