import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Clock, ExternalLink } from 'lucide-react'
import { JOBS, JOBS_EN, DEPT_EN, TYPE_EN, LOCATION_EN } from '@/data/jobs'
import type { Job } from '@/data/jobs'
import { traerVacantes } from '@/lib/vacantes-nexus'
import { useT, useLang } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { buildJobPostingSchema } from '@/lib/jobPosting'

const NEXUS_URL = 'https://www.globaltalentconnections.online'

export default function DetallesDeEmpleoPage() {
  const t = useT()
  const lang = useLang()
  const { id } = useParams()
  // Primero el archivo local (render inmediato, sin red). Si el id no esta ahi,
  // es una vacante que vino de Nexus: se resuelve contra la misma fuente que
  // arma el listado. Sin este paso, TODA card de Nexus caia en "no encontrada".
  const staticJob = useMemo(() => JOBS.find(j => j.id === id), [id])
  const [job, setJob] = useState<Job | undefined>(staticJob)
  const [buscando, setBuscando] = useState(!staticJob)

  useEffect(() => {
    setJob(staticJob)
    if (staticJob) {
      setBuscando(false)
      return
    }
    setBuscando(true)
    const ctrl = new AbortController()
    traerVacantes(ctrl.signal).then(({ jobs }) => {
      if (ctrl.signal.aborted) return
      setJob(jobs.find(j => j.id === id))
      setBuscando(false)
    })
    return () => ctrl.abort()
  }, [id, staticJob])

  if (buscando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white pt-20">
        <p className="text-dark-gray">Cargando vacante…</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white pt-20">
        <div className="text-center">
          <h1 className="font-headline text-4xl text-navy mb-4">{t('det_not_found')}</h1>
          <Link to="/empleos" className="text-blue-prime hover:underline">Ver todas las vacantes</Link>
        </div>
      </div>
    )
  }

  const applyUrl = `${NEXUS_URL}/postular-express?puesto=${encodeURIComponent(job.title)}`
  const en = lang === 'en' && JOBS_EN[job.id] ? JOBS_EN[job.id] : null
  const responsibilities = en?.responsibilities || job.responsibilities
  const requirements = en?.requirements || job.requirements
  const experience = en?.experience || job.experience
  const education = en?.education || job.education
  const benefits = en?.benefits || job.benefits

  return (
    <>
      <SEO
        title={`${job.title} — Trabajo remoto`}
        description={`Trabajo remoto de ${job.title} en Global Talent Connections. Empleo 100% remoto desde Latinoamérica (Argentina, Chile, Colombia, México y más). PostÃºlate hoy.`}
        path={`/empleos/${job.id}`}
        type="article"
        jobPostingSchema={
          job.active === false
            ? undefined
            : buildJobPostingSchema({
                id: job.id,
                title: job.title,
                description: job.description,
                type: job.type,
                requirements: job.requirements,
                imageUrl: job.imageUrl,
              })
        }
      />
      {/* HERO */}
      <section className="bg-navy pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/empleos" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('det_volver')}
          </Link>
          <span className="text-blue-light text-xs font-label uppercase tracking-widest font-bold mb-4 block">{lang === 'en' && DEPT_EN[job.department] ? DEPT_EN[job.department] : job.department}</span>
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl text-white mb-6">{lang === 'en' && JOBS_EN[job.id] ? JOBS_EN[job.id].title : job.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {lang === 'en' && LOCATION_EN[job.location] ? LOCATION_EN[job.location] : job.location}</span>
            <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {lang === 'en' && TYPE_EN[job.type] ? TYPE_EN[job.type] : job.type}</span>
            {experience && <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {experience}</span>}
            {education && <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {education}</span>}
          </div>
        </div>
      </section>

      {/* DETALLE */}
      <section className="py-16 lg:py-24 bg-off-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contenido principal */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="font-headline text-2xl text-navy mb-4">{t('det_descripcion')}</h2>
                <p className="text-dark-gray leading-relaxed whitespace-pre-line">{lang === 'en' && JOBS_EN[job.id] ? JOBS_EN[job.id].description : job.description}</p>
              </div>

              {responsibilities.length > 0 && (
                <div>
                  <h2 className="font-headline text-2xl text-navy mb-4">{t('det_responsabilidades')}</h2>
                  <ul className="space-y-3">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="text-dark-gray">
                        <span className="font-semibold text-navy">{r.titulo}</span>
                        {r.detalle && r.detalle.length > 0 && (
                          <ul className="mt-1 ml-4 space-y-1">
                            {r.detalle.map((d, j) => (
                              <li key={j} className="text-sm text-dark-gray before:content-['—'] before:mr-2 before:text-blue-prime">{d}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {requirements.length > 0 && (
                <div>
                  <h2 className="font-headline text-2xl text-navy mb-4">{t('det_requisitos')}</h2>
                  <ul className="space-y-2">
                    {requirements.map((r, i) => (
                      <li key={i} className="text-dark-gray flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-prime mt-2 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {benefits && benefits.length > 0 && (
                <div>
                  <h2 className="font-headline text-2xl text-navy mb-4">{t('det_beneficios')}</h2>
                  <ul className="space-y-2">
                    {benefits.map((b, i) => (
                      <li key={i} className="text-dark-gray flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white p-8 rounded-xl border border-border-soft shadow-lg">
                {job.imageUrl && (
                  <img src={job.imageUrl} alt={job.title} className="w-full aspect-video object-cover rounded-lg mb-6" loading="lazy" />
                )}
                <h3 className="font-headline text-xl text-navy mb-2">{lang === 'en' && JOBS_EN[job.id] ? JOBS_EN[job.id].title : job.title}</h3>
                <p className="text-dark-gray text-sm mb-6">{lang === 'en' && DEPT_EN[job.department] ? DEPT_EN[job.department] : job.department} · {lang === 'en' && LOCATION_EN[job.location] ? LOCATION_EN[job.location] : job.location}</p>
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-prime text-white py-4 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-blue-deep transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-prime/20"
                >
                  {t('det_postular')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
