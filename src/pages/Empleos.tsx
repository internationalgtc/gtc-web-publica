import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, MapPin, Briefcase } from 'lucide-react'
import { JOBS, DEPARTMENTS, JOBS_EN, DEPT_EN, TYPE_EN, LOCATION_EN } from '@/data/jobs'
import { traerVacantes } from '@/lib/vacantes-nexus'
import type { Job } from '@/data/jobs'
import { useLang } from '@/hooks/useT'
import { RevealSection } from '@/components/shared/RevealSection'
import { useT } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'

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

  return (
    <>
      <SEO
        title="Trabajo remoto — Empleos abiertos en Latinoamérica"
        description="Trabajo remoto desde casa: vacantes abiertas en marketing, ventas, administración, desarrollo, diseño, finanzas y más. Empleos 100% remotos para Argentina, Chile, Colombia, México, Perú y toda Latinoamérica. PostÃºlate hoy."
        path="/empleos"
      />
      <section className="bg-navy pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-prime/[0.06] blur-[120px] rounded-full -mr-32" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <span className="text-blue-light text-xs font-label uppercase tracking-widest font-bold mb-4 block">{t('empleos_label')}</span>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {t('empleos_titulo_1')} <span className="text-gold">{t('empleos_titulo_2')}</span>.
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mb-10">
            {activeJobs.length} {t('emp_subtitle_tpl')}
          </p>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder={t('emp_ph_buscar')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none"
              />
            </div>
            <select
              value={dept}
              onChange={e => setDept(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:ring-2 focus:ring-blue-prime outline-none"
            >
              <option value="" className="text-navy">{t('emp_todos')}</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d} className="text-navy">{lang === 'en' && DEPT_EN[d] ? DEPT_EN[d] : d}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <RevealSection className="py-16 lg:py-24 bg-off-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-dark-gray text-lg">{lang === 'en' ? 'No jobs found with those filters.' : 'No se encontraron vacantes con esos filtros.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(job => (
                <Link
                  key={job.id}
                  to={`/empleos/${job.id}`}
                  className="bg-white rounded-xl border border-border-soft overflow-hidden hover:shadow-xl hover:border-blue-prime/20 transition-all group"
                >
                  {job.imageUrl && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={job.imageUrl}
                        alt={job.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-blue-prime text-[10px] font-label uppercase tracking-widest font-bold">{lang === 'en' && DEPT_EN[job.department] ? DEPT_EN[job.department] : job.department}</span>
                    <h3 className="font-headline text-xl text-navy mt-2 mb-3 group-hover:text-blue-prime transition-colors">{lang === 'en' && JOBS_EN[job.id] ? JOBS_EN[job.id].title : job.title}</h3>
                    <div className="flex items-center gap-4 text-dark-gray text-sm">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {lang === 'en' && LOCATION_EN[job.location] ? LOCATION_EN[job.location] : job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {lang === 'en' && TYPE_EN[job.type] ? TYPE_EN[job.type] : job.type}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </RevealSection>
    </>
  )
}
