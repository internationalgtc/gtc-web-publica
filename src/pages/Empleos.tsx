import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { JOBS, DEPARTMENTS, JOBS_EN, DEPT_EN, LOCATION_EN } from '@/data/jobs'
import { traerVacantes } from '@/lib/vacantes-nexus'
import type { Job } from '@/data/jobs'
import { useLang, useT } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'

// Bolsa de empleos — variante candidatos, sistema editorial.
//
// UNA sola lista con TODO lo que Nexus publica (búsquedas abiertas y perfiles
// generales por igual), como pidió Ariel el 8-sep-2026: «yo quería todas las
// que están en la automatización». La postulación por área es OTRA página
// (/areas) a la que se llega desde el pie de esta lista y desde la portada,
// no un bloque apilado acá.

const pad = (n: number) => String(n).padStart(2, '0')

export default function EmpleosPage() {
  const t = useT()
  const lang = useLang()
  const [search, setSearch] = useState('')
  // La portada linkea /empleos?area=<departamento>: la bolsa se abre filtrada.
  const [searchParams] = useSearchParams()
  const [dept, setDept] = useState(() => {
    const area = searchParams.get('area')
    return area && DEPARTMENTS.includes(area) ? area : ''
  })

  // Las vacantes salen del modulo de Nexus, que se actualiza solo cuando el
  // lead avanza o muere. `JOBS` queda como estado inicial y como reserva: si
  // Nexus no responde, la pagina muestra lo de siempre en lugar de vaciarse.
  const [activeJobs, setActiveJobs] = useState<Job[]>(() => JOBS.filter(j => j.active))

  useEffect(() => {
    const ctrl = new AbortController()
    traerVacantes(ctrl.signal).then(({ jobs }) => {
      if (!ctrl.signal.aborted) setActiveJobs(jobs)
    })
    return () => ctrl.abort()
  }, [])

  const filtered = useMemo(() => {
    return activeJobs.filter(j => {
      const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase())
      const matchDept = !dept || j.department === dept
      return matchSearch && matchDept
    })
  }, [activeJobs, search, dept])

  const deptLabel = (d: string) => (lang === 'en' && DEPT_EN[d] ? DEPT_EN[d] : d)
  const titulo = (j: Job) => (lang === 'en' && JOBS_EN[j.id] ? JOBS_EN[j.id].title : j.title)
  const lugar = (l: string) => (lang === 'en' && LOCATION_EN[l] ? LOCATION_EN[l] : l)

  const filas = (lista: Job[]) => (
    <RevealGroup>
      {lista.map((job, i) => (
        <RevealItem key={job.id}>
          <Link className="ed-area-row" to={`/empleos/${job.id}`}>
            <span className="font-display italic text-sm text-sand">/ {pad(i + 1)}</span>
            <span className="name font-display font-normal text-[clamp(22px,2.6vw,36px)] tracking-[-0.01em]">
              {titulo(job)}
            </span>
            <span className="tag ed-caps !text-[11px] text-sand">
              {deptLabel(job.department)} · {lugar(job.location)}
            </span>
            <span className="font-display text-[22px] text-coral">→</span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  )

  return (
    <>
      <SEO
        title="Trabajo remoto — Empleos abiertos en Latinoamérica"
        description="Trabajo remoto desde casa: vacantes abiertas en marketing, ventas, administración, desarrollo, diseño, finanzas y más. Empleos 100% remotos para Argentina, Chile, Colombia, México, Perú y toda Latinoamérica. Postúlate hoy."
        path="/empleos"
      />

      {/* CABECERA */}
      <section className="pt-[158px] pb-[70px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">✳</span>
              <span className="name">{t('empleos_label')}</span>
              <span className="meta">{filtered.length} {t('emp_activas_meta')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 max-w-[13ch]">
            <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(40px,6.4vw,96px)] [text-wrap:balance]">
              {t('empleos_titulo_1')} <em className="italic text-gold-deep">{t('empleos_titulo_2')}</em>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[clamp(16px,1.5vw,20px)] text-ink-soft max-w-[52ch] leading-relaxed mt-7">
              {activeJobs.length} {t('emp_subtitle_tpl')}
            </p>
          </Reveal>

          {/* Buscador + chips de área */}
          <Reveal delay={0.2} className="mt-12">
            <div className="relative max-w-[560px]">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-sand" />
              <input
                type="text"
                placeholder={t('emp_ph_buscar')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-transparent border-b border-navy/25 focus:border-coral outline-none pl-8 pr-4 py-3.5 font-display text-xl placeholder:text-sand/70 text-ink transition-colors"
              />
            </div>
            <div className="flex gap-2.5 flex-wrap mt-8">
              <button
                onClick={() => setDept('')}
                className={`ed-caps !text-[10px] px-4 py-2.5 rounded-full border transition-colors duration-300 ${
                  dept === '' ? 'bg-navy text-cream border-navy' : 'border-navy/20 text-ink-soft hover:border-navy'
                }`}
              >
                {t('emp_todos')}
              </button>
              {DEPARTMENTS.filter(d => d !== 'Todos').map(d => (
                <button
                  key={d}
                  onClick={() => setDept(dept === d ? '' : d)}
                  className={`ed-caps !text-[10px] px-4 py-2.5 rounded-full border transition-colors duration-300 ${
                    dept === d ? 'bg-navy text-cream border-navy' : 'border-navy/20 text-ink-soft hover:border-navy'
                  }`}
                >
                  {deptLabel(d)}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* LISTADO — todo lo que Nexus publica, en una sola lista */}
      <section className="pb-[130px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          {filtered.length === 0 ? (
            <Reveal>
              <p className="font-display italic text-[clamp(22px,2.4vw,32px)] text-sand py-[90px] text-center">
                {t('emp_vacio')}
              </p>
            </Reveal>
          ) : (
            filas(filtered)
          )}

          {/* ¿No está tu búsqueda? La postulación por área vive en su propia página */}
          <Reveal>
            <div className="mt-[90px] pt-9 border-t border-navy/15 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <p className="font-display text-[clamp(20px,2.2vw,30px)] leading-snug max-w-[30ch]">
                {t('emp_cta_areas')}
              </p>
              <Link className="ed-btn ed-btn-primary shrink-0" to="/areas">
                {t('areas_label')} <ArrowRight className="w-4 h-4 arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
