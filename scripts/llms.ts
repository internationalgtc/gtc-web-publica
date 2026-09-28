// Genera /llms.txt en cada build: el resumen que leen los asistentes de IA
// (formato de llmstxt.org). NO se escribe a mano en public/: cada frase sale
// de los mismos textos que ya se ven en la web (translations.ts) y las cifras
// de src/data/cifras.ts. Así llms.txt no puede decir algo distinto a la home.
//
// Regla: aquí solo entra lo que ya está visible en alguna página.
import T from '../src/lib/translations'
import { queEsGtc } from '../src/data/queEsGtc'

const BASE = 'https://www.globaltalent-connections.com'

const es = (key: string): string => {
  const entry = T[key]
  if (!entry?.es) throw new Error(`llms.txt: falta el texto «${key}» en translations.ts`)
  return entry.es
}

export function generarLlmsTxt(): string {
  const { definicion, datos } = queEsGtc(es, 'es')

  return `# Global Talent Connections

> ${definicion}

${datos.map(d => `- ${d}`).join('\n')}

## Páginas

- [Qué es GTC](${BASE}/que-es-gtc): esta misma definición.
- [Inicio](${BASE}/): qué hacemos, cómo es el proceso, el equipo y preguntas frecuentes.
- [Servicios](${BASE}/servicios): las áreas profesionales.
- [Asistente virtual](${BASE}/asistente-virtual): precio, qué incluye y preguntas frecuentes.
- [Calculadora de ahorro](${BASE}/calculadora-ahorro): cuánto cuesta frente a contratar en España.
- [Nosotros](${BASE}/nosotros): equipo y sedes.
- [Contacto](${BASE}/contacto)
- [Blog](${BASE}/blog)
- [Portal de empleos](https://empleos.globaltalent-connections.com/): vacantes para profesionales de Latinoamérica.
`
}
