import { useState, useMemo, useEffect, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Search } from 'lucide-react'
import { JOBS, DEPARTMENTS, JOBS_EN, DEPT_EN, LOCATION_EN } from '@/data/jobs'
import { traerVacantes } from '@/lib/vacantes-nexus'
import type { Job } from '@/data/jobs'
import { useLang } from '@/hooks/useT'
import { useT } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'

// Bolsa de empleos — variante candidatos, sistema editorial (mismo lenguaje
// que la portada: hairlines, Fraunces, filas-índice con hover navy).
// Las vacantes se publican y se dan de baja SOLAS desde Nexus (la gestora
// cura el título público; el trigger las cierra cuando la búsqueda avanza).

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function Reveal({ children, className, delay = 0, y = 36 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    >
      {children}
    </motion.div>
  )
}

function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

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

  return (
    <>
      <SEO
        title="Trabajo remoto — Empleos abiertos en Latinoamérica"
        description="Trabajo remoto desde casa: vacantes abiertas en marketing, ventas, administración, desarrollo, diseño, finanzas y más. Empleos 100% remotos para Argentina, Chile, Colombia, México, Perú y toda Latinoamérica. Postulate hoy."
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

      {/* LISTADO — filas-índice editoriales */}
      <section className="pb-[130px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          {filtered.length === 0 ? (
            <Reveal>
              <p className="font-display italic text-[clamp(22px,2.4vw,32px)] text-sand py-[90px] text-center">
                {t('emp_vacio')}
              </p>
            </Reveal>
          ) : (
            <RevealGroup>
              {filtered.map((job, i) => (
                <RevealItem key={job.id}>
                  <Link className="ed-area-row" to={`/empleos/${job.id}`}>
                    <span className="font-display italic text-sm text-sand">/ {String(i + 1).padStart(2, '0')}</span>
                    <span className="name font-display font-normal text-[clamp(22px,2.6vw,36px)] tracking-[-0.01em]">
                      {lang === 'en' && JOBS_EN[job.id] ? JOBS_EN[job.id].title : job.title}
                    </span>
                    <span className="tag ed-caps !text-[11px] text-sand">
                      {deptLabel(job.department)} · {lang === 'en' && LOCATION_EN[job.location] ? LOCATION_EN[job.location] : job.location}
                    </span>
                    <span className="font-display text-[22px] text-coral">→</span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>
    </>
  )
}
