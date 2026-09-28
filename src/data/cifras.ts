/**
 * Cifras públicas de GTC — FUENTE ÚNICA.
 *
 * Toda página, metadato, dato estructurado y traducción que diga cuántas
 * empresas o profesionales tiene GTC lo lee de acá. Ninguna página escribe el
 * número a mano: si la home pudiera contestar «cuántos clientes tienen» de dos
 * maneras distintas, la web se contradice (criterio de Ariel, 28-sep-2026).
 *
 * Texto genérico a propósito («más de»), decidido por Ariel y Larisa el
 * 28-sep-2026, para que siga siendo cierto aunque haya alguna baja.
 * Base contada en Nexus ese día (NO se publica): 100 profesionales activos en
 * 59 empresas.
 *   profesional = asistente con estado activo y correo de asistente
 *   empresa     = cliente con al menos un profesional activo
 *
 * Si hay que cambiar un número, se cambia SOLO acá.
 */

type Texto = { es: string; en: string }

type Cifra = {
  /** Lo que va en grande en una ficha de datos: «Más de 50» / «50+». */
  numero: Texto
  /** Lo que va debajo del número: «empresas» / «companies». */
  sustantivo: Texto
}

const EMPRESAS: Cifra = {
  numero: { es: 'Más de 50', en: '50+' },
  sustantivo: { es: 'empresas', en: 'companies' },
}

const PROFESIONALES: Cifra = {
  numero: { es: 'Más de 90', en: '90+' },
  sustantivo: { es: 'profesionales', en: 'professionals' },
}

/** «Más de 50 empresas» / «50+ companies». */
function frase(c: Cifra): Texto {
  return { es: `${c.numero.es} ${c.sustantivo.es}`, en: `${c.numero.en} ${c.sustantivo.en}` }
}

/** La misma frase para ir en mitad de una oración: «más de 50 empresas». */
function enFrase(c: Cifra): Texto {
  const f = frase(c)
  return { es: f.es.charAt(0).toLowerCase() + f.es.slice(1), en: f.en }
}

export const CIFRAS = {
  empresas: { ...EMPRESAS, texto: frase(EMPRESAS), enFrase: enFrase(EMPRESAS) },
  profesionales: { ...PROFESIONALES, texto: frase(PROFESIONALES), enFrase: enFrase(PROFESIONALES) },
  /** Áreas profesionales en las que seleccionamos perfiles (las lista la home). */
  areas: 11,
} as const
