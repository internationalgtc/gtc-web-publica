import { CIFRAS } from './cifras'

/**
 * «Qué es GTC» en pocas frases — la misma definición para la página
 * /que-es-gtc y para /llms.txt (lo que leen los asistentes de IA).
 * Cada frase sale de un texto que ya se ve en la web (translations.ts) o de
 * src/data/cifras.ts. Imports relativos: vite.config también lo carga.
 */

type Traductor = (key: string) => string

export function queEsGtc(t: Traductor, lang: 'es' | 'en') {
  const areas = [1, 2, 3, 4, 5, 6].map(n => t(`home_area_${n}`)).join(', ')
  const cifras =
    lang === 'es'
      ? `${CIFRAS.profesionales.texto.es} trabajan en ${CIFRAS.empresas.enFrase.es}.`
      : `${CIFRAS.profesionales.texto.en} work for ${CIFRAS.empresas.enFrase.en}.`
  const areasFrase =
    lang === 'es'
      ? `${CIFRAS.areas} áreas profesionales: ${areas}. ${t('home_areas_note')}`
      : `${CIFRAS.areas} professional areas: ${areas}. ${t('home_areas_note')}`

  return {
    definicion: `Global Talent Connections (GTC). ${t('home_hero_sub')}`,
    datos: [
      cifras,
      `${t('hero_precio')}.`,
      `${t('home_gar_2_t')}: ${t('home_gar_2_d')}`,
      areasFrase,
      t('nos_presencia_d'),
      t('que_es_solo_empresas'),
    ],
  }
}
