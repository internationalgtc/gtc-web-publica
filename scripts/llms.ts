// Genera /llms.txt en cada build: el resumen que leen los asistentes de IA
// (formato de llmstxt.org). NO se escribe a mano en public/: cada frase sale
// de los mismos textos que ya se ven en la web (translations.ts) y las cifras
// de src/data/cifras.ts. Así llms.txt no puede decir algo distinto a la home.
//
// Regla: aquí solo entra lo que ya está visible en alguna página.
import T from '../src/lib/translations'
import { CIFRAS } from '../src/data/cifras'

const BASE = 'https://www.globaltalent-connections.com'

const es = (key: string): string => {
  const entry = T[key]
  if (!entry?.es) throw new Error(`llms.txt: falta el texto «${key}» en translations.ts`)
  return entry.es
}

export function generarLlmsTxt(): string {
  const areas = [1, 2, 3, 4, 5, 6].map(n => es(`home_area_${n}`)).join(', ')

  return `# Global Talent Connections

> Global Talent Connections (GTC). ${es('home_hero_sub')}

- ${CIFRAS.profesionales.texto.es} trabajan en ${CIFRAS.empresas.enFrase.es}.
- ${es('hero_precio')}.
- ${es('home_gar_2_t')}: ${es('home_gar_2_d')}
- ${CIFRAS.areas} áreas profesionales: ${areas}. ${es('home_areas_note')}
- ${es('nos_presencia_d')}
- Servicio exclusivo para empresas. No gestionamos búsquedas de empleo.

## Páginas

- [Inicio](${BASE}/): qué hacemos, cómo es el proceso y el equipo.
- [Servicios](${BASE}/servicios): las áreas profesionales.
- [Asistente virtual](${BASE}/asistente-virtual): precio, qué incluye y preguntas frecuentes.
- [Calculadora de ahorro](${BASE}/calculadora-ahorro): cuánto cuesta frente a contratar en España.
- [Nosotros](${BASE}/nosotros): equipo y sedes.
- [Contacto](${BASE}/contacto)
- [Blog](${BASE}/blog)
`
}
