/**
 * Vacantes vivas desde Nexus.
 *
 * POR QUE EXISTE ESTE ARCHIVO
 * ---------------------------
 * Hasta ahora las vacantes de la web vivian escritas a mano en `src/data/jobs.ts`:
 * publicar una exigia editar codigo, commitear y desplegar. El resultado medido
 * el 18-ago-2026 fue que la web publicaba 13 puestos de los que solo 2 existian,
 * mientras 9 busquedas reales no aparecian en ningun lado.
 *
 * Ahora la lista sale del modulo de Vacantes de Nexus, que se actualiza solo
 * cuando el lead avanza o muere.
 *
 * DOS DECISIONES QUE IMPORTAN
 * ---------------------------
 * 1. `jobs.ts` NO se borra: es la reserva. Si Nexus no responde (deploy, caida,
 *    CORS), la pagina muestra el contenido de siempre en vez de quedar vacia.
 *    Una web de empleos sin empleos es peor que una desactualizada.
 *
 * 2. Cuando una vacante de Nexus coincide con una ficha local, se usa la ficha
 *    local para el detalle (imagen, responsabilidades, traduccion al ingles) y
 *    Nexus solo manda QUE esta abierta. Nexus tiene la verdad de la
 *    disponibilidad; el archivo tiene el contenido rico que la base no guarda.
 */
import { JOBS, type Job } from '@/data/jobs'

const API = 'https://www.globaltalentconnections.online/api/public/vacantes'

/** Lo que devuelve la ruta publica de Nexus. */
interface VacanteNexus {
  id: string
  title: string
  description: string | null
  requirements: string | null
  category: string | null
  remote_type: string | null
  location: string | null
  opened_at: string | null
  is_evergreen: boolean
  seniority: string | null
  required_skills: string[] | null
  public_slug: string
}

/** Las categorias de Nexus no son los departamentos que muestra la web. */
const DEPARTAMENTO_POR_CATEGORIA: Record<string, string> = {
  tecnologia: 'Tecnología',
  marketing: 'Marketing',
  comercial: 'Ventas y Comercial',
  administracion: 'Administración',
  finanzas: 'Administración',
  rrhh: 'Gestión y Calidad',
  calidad: 'Gestión y Calidad',
  operaciones: 'Gestión y Calidad',
  construccion: 'Arquitectura',
  ecommerce: 'Ecommerce',
}

/** Imagen de la card segun la categoria de Nexus (archivos ya existentes del sitio). */
const IMAGEN_POR_CATEGORIA: Record<string, string> = {
  tecnologia: '/img-empleos/automatizador.jpg',
  marketing: '/img-empleos/marketing.jpg',
  comercial: '/img-empleos/prospeccion.jpg',
  finanzas: '/img-empleos/contable.jpg',
  administracion: '/img-empleos/administrativo.jpg',
  rrhh: '/img-empleos/gestion.jpg',
  calidad: '/img-empleos/calidad.jpg',
  construccion: '/img-empleos/arquitectura.jpg',
  ecommerce: '/img-empleos/ecomerce.jpg',
}

const SENIORITY_ES: Record<string, string> = {
  junior: 'Junior',
  semi_senior: 'Semi Senior',
  senior: 'Senior',
}

/** Para comparar "Asistente de Ventas" con "Asistente de ventas " sin fallar. */
function normaliza(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

const LOCALES_POR_TITULO = new Map(JOBS.map((j) => [normaliza(j.title), j]))

function aJob(v: VacanteNexus): Job {
  const local = LOCALES_POR_TITULO.get(normaliza(v.title))
  const departamento =
    (v.category && DEPARTAMENTO_POR_CATEGORIA[v.category]) || local?.department || 'Gestión y Calidad'

  // Hay ficha local: se conserva su contenido rico y Nexus solo aporta que
  // esta abierta. El id local mantiene andando /empleos/:id y la version en ingles.
  if (local) {
    return { ...local, active: true, department: departamento, esPerfilGeneral: v.is_evergreen }
  }

  return {
    id: v.public_slug || v.id,
    active: true,
    esPerfilGeneral: v.is_evergreen,
    title: v.title,
    department: departamento,
    location: v.location || 'Remoto',
    type: 'Jornada Completa',
    imageUrl: (v.category && IMAGEN_POR_CATEGORIA[v.category]) || '/img-empleos/gestion.jpg',
    description: v.description || '',
    responsibilities: [],
    // `requirements` viene vacio en la base real: los requisitos son las
    // aptitudes que carga la reclutadora, mas el nivel de experiencia.
    requirements: [
      ...(v.seniority && SENIORITY_ES[v.seniority] ? [`Nivel ${SENIORITY_ES[v.seniority]}`] : []),
      ...(v.required_skills || []),
    ],
    experience: (v.seniority && SENIORITY_ES[v.seniority]) || undefined,
  }
}

export interface ResultadoVacantes {
  jobs: Job[]
  /** true cuando Nexus no respondio y se esta mostrando la reserva local. */
  usandoReserva: boolean
}

export async function traerVacantes(signal?: AbortSignal): Promise<ResultadoVacantes> {
  const reserva: ResultadoVacantes = { jobs: JOBS.filter((j) => j.active), usandoReserva: true }

  try {
    const res = await fetch(API, { signal, headers: { Accept: 'application/json' } })
    if (!res.ok) return reserva

    const body = (await res.json()) as { data?: VacanteNexus[] }
    const vacantes = body?.data
    if (!Array.isArray(vacantes) || vacantes.length === 0) {
      // Cero vacantes con la API sana es un estado posible (nadie curo el titulo
      // publico todavia), pero mostrar una pagina vacia no le sirve a nadie.
      return reserva
    }

    // Dos clientes pueden pedir el mismo puesto: en la web es un aviso, no dos.
    // Las busquedas VIVAS van antes que los perfiles generales para que, si un
    // titulo esta repetido, el aviso que queda sea el de contenido real (brief
    // curado) y no la ficha generica de una linea.
    const ordenadas = [...vacantes].sort((a, b) => Number(a.is_evergreen) - Number(b.is_evergreen))
    const porTitulo = new Map<string, Job>()
    for (const v of ordenadas) {
      const job = aJob(v)
      if (!porTitulo.has(normaliza(job.title))) porTitulo.set(normaliza(job.title), job)
    }

    return { jobs: [...porTitulo.values()], usandoReserva: false }
  } catch {
    return reserva
  }
}
