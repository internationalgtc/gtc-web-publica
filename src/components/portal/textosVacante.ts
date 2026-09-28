import { JOBS_EN, DEPT_EN, LOCATION_EN, TYPE_EN, type Job } from '@/data/jobs'
import { useLang } from '@/hooks/useT'

/** Textos de una vacante en el idioma activo (las mismas tablas de siempre:
 *  src/data/jobs.ts). Antes cada página repetía estas cuatro funciones. */
export function useTextosVacante() {
  const lang = useLang()
  const en = lang === 'en'
  return {
    lang,
    titulo: (j: Job) => (en && JOBS_EN[j.id] ? JOBS_EN[j.id].title : j.title),
    descripcion: (j: Job) => (en && JOBS_EN[j.id]?.description) || j.description,
    area: (d: string) => (en && DEPT_EN[d] ? DEPT_EN[d] : d),
    lugar: (l: string) => (en && LOCATION_EN[l] ? LOCATION_EN[l] : l),
    jornada: (ty: string) => (en && TYPE_EN[ty] ? TYPE_EN[ty] : ty),
  }
}

/** Parte el título de un puesto para el titular del diseño A: «Asistente de
 *  *Marketing Digital*». En español va en cursiva lo que sigue a «Asistente
 *  (de|para)»; en inglés, la última palabra («Digital Marketing *Assistant*»). */
export function partirPuesto(titulo: string): [string, string] {
  const es = titulo.match(/^(Asistente(?:\s+(?:de|para|del|de la))?)\s+(.+)$/i)
  if (es) return [es[1], es[2]]
  const corte = titulo.lastIndexOf(' ')
  return corte > 0 ? [titulo.slice(0, corte), titulo.slice(corte + 1)] : ['', titulo]
}

export const pad = (n: number) => String(n).padStart(2, '0')
