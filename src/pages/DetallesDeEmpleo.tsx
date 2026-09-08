import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { JOBS, JOBS_EN, DEPT_EN, TYPE_EN, LOCATION_EN } from '@/data/jobs'
import type { Job } from '@/data/jobs'
import { traerVacantes } from '@/lib/vacantes-nexus'
import { useT, useLang } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { buildJobPostingSchema } from '@/lib/jobPosting'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'
import { urlPostulacion } from '@/lib/nexus'

// Detalle de una vacante — variante candidatos, sistema editorial (mismo
// lenguaje que la portada y la bolsa: hairlines, Fraunces, índices coral).
// El botón «Postularme» abre el formulario de Nexus con el puesto preseleccionado.

const PASOS = ['cand_proc_1_t', 'cand_proc_2_t', 'cand_proc_3_t', 'cand_proc_4_t']

const pad = (n: number) => String(n).padStart(2, '0')

interface Bloque {
  key: string
  titulo: string
  contenido: ReactNode
}

export default function DetallesDeEmpleoPage() {
  const t = useT()
  const lang = useLang()
  const { id } = useParams()
  // Primero el archivo local (render inmediato, sin red). Si el id no está ahí,
  // es una vacante que vino de Nexus: se resuelve contra la misma fuente que
  // arma el listado. Sin este paso, TODA card de Nexus caía en "no encontrada".
  const staticJob = useMemo(() => JOBS.find(j => j.id === id), [id])
  const [job, setJob] = useState<Job | undefined>(staticJob)
  const [buscando, setBuscando] = useState(!staticJob)
  // El resto de vacantes vivas alimenta «Otras oportunidades» al pie.
  const [todas, setTodas] = useState<Job[]>([])
  // Las 45 fichas locales inactivas siguen respondiendo por URL (Google las
  // tiene indexadas). Una búsqueda que ya cerró no puede ofrecer «Postularme»:
  // abierta = Nexus la lista hoy (o, sin Nexus, el archivo la marca activa).
  const [abierta, setAbierta] = useState(() => staticJob?.active !== false)

  useEffect(() => {
    setJob(staticJob)
    setBuscando(!staticJob)
    setAbierta(staticJob?.active !== false)
    const ctrl = new AbortController()
    traerVacantes(ctrl.signal).then(({ jobs, usandoReserva }) => {
      if (ctrl.signal.aborted) return
      setTodas(jobs)
      if (!staticJob) setJob(jobs.find(j => j.id === id))
      if (!usandoReserva) setAbierta(jobs.some(j => j.id === id))
      setBuscando(false)
    })
    return () => ctrl.abort()
  }, [id, staticJob])

  const titulo = (j: Job) => (lang === 'en' && JOBS_EN[j.id] ? JOBS_EN[j.id].title : j.title)
  const area = (d: string) => (lang === 'en' && DEPT_EN[d] ? DEPT_EN[d] : d)
  const lugar = (l: string) => (lang === 'en' && LOCATION_EN[l] ? LOCATION_EN[l] : l)
  const jornada = (ty: string) => (lang === 'en' && TYPE_EN[ty] ? TYPE_EN[ty] : ty)

  if (buscando) {
    return (
      <section className="pt-[158px] pb-[130px] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="ed-sec-tag ed-caps">
            <span className="idx">✳</span>
            <span className="name">{t('empleos_label')}</span>
          </div>
          <p className="font-display italic text-[clamp(22px,2.4vw,32px)] text-sand mt-[90px]">{t('det_cargando')}</p>
        </div>
      </section>
    )
  }

  if (!job) {
    return (
      <section className="pt-[158px] pb-[130px] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal y={0}>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">✳</span>
              <span className="name">{t('empleos_label')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 max-w-[14ch]">
            <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(40px,6.4vw,96px)] [text-wrap:balance]">
              {t('det_not_found')}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[clamp(16px,1.5vw,20px)] text-ink-soft max-w-[46ch] leading-relaxed mt-7">{t('det_not_found_p')}</p>
            <div className="mt-12">
              <Link className="ed-btn ed-btn-outline" to="/empleos">
                <ArrowLeft className="w-4 h-4" /> {t('det_volver')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    )
  }

  const applyUrl = urlPostulacion(job.title, lang)
  const en = lang === 'en' && JOBS_EN[job.id] ? JOBS_EN[job.id] : null
  const descripcion = en?.description || job.description
  const responsibilities = en?.responsibilities || job.responsibilities
  const requirements = en?.requirements || job.requirements
  const experience = en?.experience || job.experience
  const education = en?.education || job.education
  const benefits = en?.benefits || job.benefits || []
  const otras = todas.filter(j => j.id !== job.id).slice(0, 4)

  const meta: { label: string; value: string }[] = [
    { label: t('det_area'), value: area(job.department) },
    { label: t('det_ubicacion'), value: lugar(job.location) },
    { label: t('det_jornada'), value: jornada(job.type) },
  ]
  if (experience) meta.push({ label: t('det_experiencia'), value: experience })
  if (education) meta.push({ label: t('det_formacion'), value: education })

  // Solo se numeran los bloques que tienen contenido: una vacante de Nexus
  // suele traer descripción + requisitos; las fichas locales traen los cuatro.
  const bloques: Bloque[] = []
  if (descripcion) {
    bloques.push({
      key: 'descripcion',
      titulo: t('det_descripcion'),
      contenido: (
        <p className="text-[clamp(16px,1.35vw,18px)] text-ink-soft leading-relaxed whitespace-pre-line max-w-[62ch]">{descripcion}</p>
      ),
    })
  }
  if (responsibilities.length > 0) {
    bloques.push({
      key: 'responsabilidades',
      titulo: t('det_responsabilidades'),
      contenido: (
        <ul className="divide-y divide-navy/10">
          {responsibilities.map((r, i) => (
            <li key={i} className="py-4 first:pt-0 last:pb-0">
              <p className="font-display text-[clamp(18px,1.6vw,22px)] text-ink leading-snug">{r.titulo}</p>
              {r.detalle && r.detalle.length > 0 && (
                <ul className="mt-2.5 space-y-1.5">
                  {r.detalle.map((d, j) => (
                    <li key={j} className="text-[15px] text-ink-soft leading-relaxed flex gap-3">
                      <span className="font-display text-coral shrink-0">—</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ),
    })
  }
  if (requirements.length > 0) {
    bloques.push({
      key: 'requisitos',
      titulo: t('det_requisitos'),
      contenido: (
        <ul className="divide-y divide-navy/10">
          {requirements.map((r, i) => (
            <li key={i} className="py-3.5 first:pt-0 last:pb-0 flex gap-5 items-baseline">
              <span className="font-display italic text-sm text-sand shrink-0">/ {pad(i + 1)}</span>
              <span className="text-[15.5px] text-ink leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
      ),
    })
  }
  if (benefits.length > 0) {
    bloques.push({
      key: 'beneficios',
      titulo: t('det_beneficios'),
      contenido: (
        <ul className="divide-y divide-navy/10">
          {benefits.map((b, i) => (
            <li key={i} className="py-3.5 first:pt-0 last:pb-0 flex gap-5 items-baseline">
              <span className="text-coral text-[13px] shrink-0">✳</span>
              <span className="text-[15.5px] text-ink leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      ),
    })
  }

  return (
    <>
      <SEO
        title={`${titulo(job)} — Trabajo remoto`}
        description={`Trabajo remoto de ${job.title} en Global Talent Connections. Empleo 100% remoto desde Latinoamérica (Argentina, Chile, Colombia, México y más). Postúlate hoy.`}
        path={`/empleos/${job.id}`}
        type="article"
        jobPostingSchema={
          !abierta
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

      {/* CABECERA */}
      <section className="pt-[158px] pb-[64px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal y={0}>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">✳</span>
              <span className="name">{area(job.department)}</span>
              <Link to="/empleos" className="meta inline-flex items-center gap-2 hover:text-coral transition-colors duration-300">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('det_volver')}
              </Link>
            </div>
          </Reveal>
          <Reveal className="mt-11 max-w-[16ch]">
            <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(40px,6.4vw,96px)] [text-wrap:balance]">
              {titulo(job)}
            </h1>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 mt-[54px] items-end">
            <Reveal delay={0.1}>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 border-t border-navy/15 pt-6">
                {meta.map(m => (
                  <div key={m.label}>
                    <dt className="ed-caps !text-[9.5px] !tracking-[0.16em] text-sand">{m.label}</dt>
                    <dd className="font-display text-[clamp(18px,1.6vw,22px)] text-ink mt-1.5">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.2} y={26}>
              {abierta ? (
                <div className="flex flex-col md:items-end gap-4">
                  <a className="ed-btn ed-btn-primary" href={applyUrl} target="_blank" rel="noopener noreferrer">
                    {t('det_postular')} <ArrowRight className="w-4 h-4 arrow" />
                  </a>
                  <p className="ed-caps !text-[9.5px] !tracking-[0.16em] text-sand md:text-right">{t('det_postular_nota')}</p>
                </div>
              ) : (
                <div className="flex flex-col md:items-end gap-4">
                  <Link className="ed-btn ed-btn-outline" to="/areas">
                    {t('cand_cta_general')} <ArrowRight className="w-4 h-4 arrow" />
                  </Link>
                  <p className="ed-caps !text-[9.5px] !tracking-[0.16em] text-coral md:text-right">{t('det_cerrada_t')}</p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* CUERPO + COLUMNA DE POSTULACIÓN */}
      <section className="pb-[130px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-x-20 gap-y-14 border-t border-navy/15">
            <div>
              {bloques.map((b, i) => (
                <Reveal key={b.key}>
                  <article className="grid grid-cols-1 md:grid-cols-[96px_1fr] gap-x-8 gap-y-4 py-12 border-b border-navy/15">
                    <div className="font-display font-light text-[clamp(40px,4.4vw,64px)] leading-none text-navy tabular-nums">
                      0<span className="italic text-coral">{i + 1}</span>
                    </div>
                    <div>
                      <h2 className="ed-caps !text-[11px] text-ink-soft mb-6">{b.titulo}</h2>
                      {b.contenido}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <aside className="lg:sticky lg:top-[110px] lg:self-start lg:pt-12">
              <Reveal delay={0.15}>
                <div className="border-t border-navy/15 pt-7">
                  <div className="ed-caps !text-[10px] text-sand">{t('det_sec_postulacion')}</div>
                  <h3 className="font-display font-normal text-[clamp(24px,2.2vw,30px)] tracking-[-0.01em] leading-[1.1] mt-4">{titulo(job)}</h3>
                  <p className="text-[14.5px] text-ink-soft mt-3">
                    {area(job.department)} · {lugar(job.location)} · {t('det_remoto')}
                  </p>
                  {abierta ? (
                    <>
                      <a className="ed-btn ed-btn-primary w-full justify-center mt-8" href={applyUrl} target="_blank" rel="noopener noreferrer">
                        {t('det_postular')} <ArrowRight className="w-4 h-4 arrow" />
                      </a>
                      <p className="text-[13.5px] text-sand leading-relaxed mt-5">{t('det_48h')}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-display italic text-[18px] text-coral mt-6">{t('det_cerrada_t')}</p>
                      <p className="text-[13.5px] text-sand leading-relaxed mt-3">{t('det_cerrada_p')}</p>
                      <Link className="ed-btn ed-btn-outline w-full justify-center mt-6" to="/empleos">
                        {t('det_ver_todas')} <ArrowRight className="w-4 h-4 arrow" />
                      </Link>
                    </>
                  )}
                </div>
                <div className="border-t border-navy/15 mt-10 pt-7">
                  <div className="ed-caps !text-[10px] text-sand mb-5">{t('cand_sec_proceso')}</div>
                  <ol className="space-y-3.5">
                    {PASOS.map((k, i) => (
                      <li key={k} className="flex gap-4 items-baseline">
                        <span className="font-display italic text-sm text-coral shrink-0">{pad(i + 1)}</span>
                        <span className="font-display text-[17px] text-ink">{t(k)}</span>
                      </li>
                    ))}
                  </ol>
                  <Link to="/#proceso" className="ed-caps !text-[10px] text-ink-soft hover:text-coral transition-colors duration-300 inline-flex items-center gap-2 mt-6">
                    {t('nav_como_funciona')} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Reveal>
            </aside>
          </div>

          {/* OTRAS OPORTUNIDADES */}
          {otras.length > 0 && (
            <div className="mt-[110px]">
              <Reveal>
                <div className="ed-sec-tag ed-caps">
                  <span className="idx">✳</span>
                  <span className="name">{t('det_otras')}</span>
                  <span className="meta">{todas.length} {t('emp_activas_meta')}</span>
                </div>
              </Reveal>
              <RevealGroup className="mt-8">
                {otras.map((o, i) => (
                  <RevealItem key={o.id}>
                    <Link className="ed-area-row" to={`/empleos/${o.id}`}>
                      <span className="font-display italic text-sm text-sand">/ {pad(i + 1)}</span>
                      <span className="name font-display font-normal text-[clamp(22px,2.6vw,36px)] tracking-[-0.01em]">{titulo(o)}</span>
                      <span className="tag ed-caps !text-[11px] text-sand">
                        {area(o.department)} · {lugar(o.location)}
                      </span>
                      <span className="font-display text-[22px] text-coral">→</span>
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
              <Reveal>
                <div className="mt-10">
                  <Link className="ed-btn ed-btn-outline" to="/empleos">
                    {t('det_ver_todas')} <ArrowRight className="w-4 h-4 arrow" />
                  </Link>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
