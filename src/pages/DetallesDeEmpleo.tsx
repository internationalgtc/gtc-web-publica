import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { JOBS, JOBS_EN } from '@/data/jobs'
import type { Job } from '@/data/jobs'
import { traerVacantes } from '@/lib/vacantes-nexus'
import { useT } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { buildJobPostingSchema } from '@/lib/jobPosting'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'
import { Wrap } from '@/components/shared/EditorialPiezas'
import { urlPostulacion } from '@/lib/nexus'
import { HeroVideo } from '@/components/portal/HeroVideo'
import { TuSeguridad } from '@/components/portal/TuSeguridad'
import { pad, partirPuesto, useTextosVacante } from '@/components/portal/textosVacante'

// Detalle de una vacante — variante candidatos, rediseño «A · Revista»
// (28-sep-2026, lienzo A-vacante-movil; en escritorio, el mismo contenido a
// dos columnas con la tarjeta de postulación fija a la derecha).
// El botón «Postularme» abre el formulario de Nexus con el puesto preseleccionado.

const PASOS = [1, 2, 3, 4].map(n => ({ tKey: `cand_proc_${n}_t`, dKey: `cand_proc_${n}_d` }))
const VALORES = [1, 2, 3].map(n => ({ tKey: `cand_v${n}_t`, dKey: `cand_v${n}_d` }))

interface Bloque {
  key: string
  titulo: string
  contenido: ReactNode
}

export default function DetallesDeEmpleoPage() {
  const t = useT()
  const { lang, titulo, area, lugar, jornada } = useTextosVacante()
  const { id } = useParams()
  // Primero el archivo local (render inmediato, sin red). Si el id no está ahí,
  // es una vacante que vino de Nexus: se resuelve contra la misma fuente que
  // arma el listado. Sin este paso, TODA card de Nexus caía en "no encontrada".
  const staticJob = useMemo(() => JOBS.find(j => j.id === id), [id])
  const [job, setJob] = useState<Job | undefined>(staticJob)
  const [buscando, setBuscando] = useState(!staticJob)
  // El resto de vacantes vivas alimenta «Otras vacantes» al pie.
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

  if (buscando) {
    return (
      <section className="pt-[112px] sm:pt-[140px] lg:pt-[170px] pb-[130px] min-h-screen">
        <Wrap>
          <div className="ed-label text-ink-soft pb-3.5 border-b border-navy/15">{t('empleos_label')}</div>
          <p className="ed-serif-it text-[clamp(22px,2.4vw,32px)] text-ink-soft mt-[90px]">{t('det_cargando')}</p>
        </Wrap>
      </section>
    )
  }

  if (!job) {
    return (
      <section className="pt-[112px] sm:pt-[140px] lg:pt-[170px] pb-[130px] min-h-screen">
        <Wrap>
          <Reveal y={0}>
            <div className="ed-label text-ink-soft pb-3.5 border-b border-navy/15">{t('empleos_label')}</div>
          </Reveal>
          <Reveal className="mt-10 lg:mt-14 max-w-[14ch]">
            <h1 className="ed-serif font-[330] text-navy leading-[0.98] tracking-[-0.025em] text-[clamp(44px,7vw,104px)] [text-wrap:balance]">
              {t('det_not_found')}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[17px] sm:text-[19px] lg:text-[20px] text-ink-soft max-w-[46ch] leading-[1.55] mt-7">{t('det_not_found_p')}</p>
            <div className="mt-10">
              <Link className="ed-pill ed-pill-line" to="/empleos">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t('det_volver')}
              </Link>
            </div>
          </Reveal>
        </Wrap>
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
  const [inicio, final] = partirPuesto(titulo(job))

  // «Otras vacantes de <área>»; si el área no tiene más, las demás abiertas.
  const resto = todas.filter(j => j.id !== job.id)
  const mismaArea = resto.filter(j => j.department === job.department)
  const otras = (mismaArea.length > 0 ? mismaArea : resto).slice(0, 4)
  const otrasTitulo = mismaArea.length > 0 ? `${t('det_otras_de')} ${area(job.department)}` : t('det_otras')

  const meta: { label: string; value: string }[] = [
    { label: t('det_area'), value: area(job.department) },
    { label: t('det_ubicacion'), value: lugar(job.location) },
    { label: t('det_jornada'), value: jornada(job.type) },
  ]
  if (experience) meta.push({ label: t('det_experiencia'), value: experience })
  if (education) meta.push({ label: t('det_formacion'), value: education })

  // Solo se numeran los bloques que tienen contenido: una vacante de Nexus
  // suele traer descripción + requisitos; las fichas locales traen los cuatro.
  // La descripción va arriba, bajo el título (como en el diseño).
  const bloques: Bloque[] = []
  if (responsibilities.length > 0) {
    bloques.push({
      key: 'responsabilidades',
      titulo: t('det_responsabilidades'),
      contenido: (
        <ul>
          {responsibilities.map((r, i) => (
            <li key={i} className="py-4 border-t border-navy/15 first:border-t-0 first:pt-0">
              <p className="ed-serif text-[19px] lg:text-[22px] text-navy leading-snug">{r.titulo}</p>
              {r.detalle && r.detalle.length > 0 && (
                <ul className="mt-2.5 space-y-1.5">
                  {r.detalle.map((d, j) => (
                    <li key={j} className="text-[15px] text-ink-soft leading-relaxed flex gap-3">
                      <span className="ed-serif text-gold-deep shrink-0" aria-hidden="true">—</span>
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
        <ul>
          {requirements.map((r, i) => (
            <li key={i} className="py-3.5 border-t border-navy/15 first:border-t-0 first:pt-0 grid grid-cols-[40px_minmax(0,1fr)] items-baseline">
              <span className="ed-serif text-[15px] text-gold-deep">{pad(i + 1)}</span>
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
        <ul>
          {benefits.map((b, i) => (
            <li key={i} className="py-3.5 border-t border-navy/15 first:border-t-0 first:pt-0 grid grid-cols-[40px_minmax(0,1fr)] items-baseline">
              <span className="text-gold-deep text-[13px]" aria-hidden="true">✳</span>
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

      {/* FRANJA DE VIDEO + VOLVER */}
      <section className="pt-[74px]">
        <div className="relative overflow-hidden h-[150px] sm:h-[200px] lg:h-[240px]">
          <HeroVideo className="object-[30%_50%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/55 via-cream/45 to-cream" aria-hidden="true" />
          <Wrap className="relative pt-4 lg:pt-8">
            <Link
              to="/empleos"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full bg-cream/85 font-label font-semibold text-[14px] text-navy hover:text-navy-deep no-underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> {t('empleos_label')}
            </Link>
          </Wrap>
        </div>
      </section>

      <section className="pb-28 lg:pb-[130px]">
        <Wrap>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] gap-x-16 xl:gap-x-20 gap-y-7 items-start">
            {/* CABECERA DE LA VACANTE + CONTENIDO */}
            <div className="flex flex-col gap-4 lg:gap-5 min-w-0">
              <Reveal y={16}>
                <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                  <span className="ed-label bg-cream-2 text-navy px-3 py-2 rounded-full">{area(job.department)}</span>
                  <span className="ed-label bg-cream-2 text-navy px-3 py-2 rounded-full">{lugar(job.location)}</span>
                  <span className="ed-label bg-navy text-cream px-3 py-2 rounded-full">{t('cand_v1_t')}</span>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="ed-serif font-[340] text-navy leading-[1.02] tracking-[-0.02em] text-[clamp(40px,11vw,48px)] sm:text-[clamp(48px,6.4vw,84px)] [text-wrap:balance]">
                  {inicio} <span className="ed-serif-it">{final}</span>
                </h1>
              </Reveal>
              {descripcion && (
                <Reveal delay={0.1}>
                  <p className="text-[17px] lg:text-[19px] leading-[1.55] text-ink-soft whitespace-pre-line max-w-[62ch]">{descripcion}</p>
                </Reveal>
              )}
              <Reveal delay={0.15}>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 border-t border-navy/15 mt-2">
                  {meta.map(m => (
                    <div key={m.label} className="py-3.5 lg:py-[18px] flex flex-col gap-1 min-w-0 border-b border-navy/15">
                      <dt className="ed-label text-ink-soft">{m.label}</dt>
                      <dd className="ed-serif text-[19px] lg:text-[22px] text-navy break-words">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              {bloques.map((b, i) => (
                <Reveal key={b.key}>
                  <article className="grid grid-cols-1 md:grid-cols-[80px_minmax(0,1fr)] gap-x-6 gap-y-4 pt-8 lg:pt-10 pb-2">
                    <div className="flex md:block items-baseline gap-3">
                      <span className="ed-serif text-[17px] lg:text-[20px] text-gold-deep">{`0${i + 1}/`}</span>
                      <h2 className="ed-label text-ink-soft md:hidden">{b.titulo}</h2>
                    </div>
                    <div>
                      <h2 className="ed-label text-ink-soft mb-5 hidden md:block">{b.titulo}</h2>
                      {b.contenido}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* POSTULACIÓN + PROCESO (fija a la derecha en escritorio) */}
            <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-[100px] flex flex-col gap-5 -mx-2 sm:mx-0 mt-4 lg:mt-7">
              <Reveal delay={0.1}>
                <div className="bg-navy text-cream rounded-[24px] px-5 py-6 sm:p-7 lg:p-8 flex flex-col gap-1.5">
                  {/* Escritorio: el botón vive acá. En el móvil, en la barra fija de abajo. */}
                  <div className="hidden lg:flex flex-col gap-4 pb-6 mb-2 border-b border-cream/20">
                    <span className="ed-label text-cream/70">{t('det_sec_postulacion')}</span>
                    {abierta ? (
                      <>
                        <a
                          className="ed-pill bg-coral text-navy hover:bg-coral-hover hover:text-navy w-full !text-[17px] !min-h-[58px]"
                          href={applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t('det_postular')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
                        </a>
                        <p className="text-[14px] text-cream/75 text-center">{t('det_48h')}</p>
                        <p className="ed-label !text-[10px] text-cream/50 text-center">{t('det_postular_nota')}</p>
                      </>
                    ) : (
                      <>
                        <p className="ed-serif-it text-[22px] text-gold">{t('det_cerrada_t')}</p>
                        <p className="text-[14px] text-cream/75 leading-relaxed">{t('det_cerrada_p')}</p>
                        <Link className="ed-pill bg-coral text-navy hover:bg-coral-hover hover:text-navy w-full" to="/areas">
                          {t('cand_cta_general')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
                        </Link>
                      </>
                    )}
                  </div>
                  <span className="ed-label text-gold">{t('portal_ficha_proceso')}</span>
                  <ol className="mt-2">
                    {PASOS.map((p, i) => (
                      <li
                        key={p.tKey}
                        className={`grid grid-cols-[34px_minmax(0,1fr)] py-3.5 ${i < PASOS.length - 1 ? 'border-b border-cream/[0.18]' : ''}`}
                      >
                        <span className="ed-serif text-[17px] text-gold">{pad(i + 1)}</span>
                        <span className="flex flex-col gap-1">
                          <strong className="ed-serif font-normal text-[19px]">{t(p.tKey)}</strong>
                          <span className="text-[14px] leading-[1.5] text-cream/80">{t(p.dKey)}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
              <div className="hidden lg:block">
                <TuSeguridad puesto={job.title} fondo="crema-2" />
              </div>
            </aside>

            {/* LO QUE TE LLEVAS */}
            <div className="flex flex-col gap-3.5 pt-6 lg:pt-10 min-w-0">
              <Reveal>
                <h2 className="ed-label text-ink-soft">{t('cand_sec_valor_meta')}</h2>
              </Reveal>
              <RevealGroup className="flex flex-col border-t border-navy/15">
                {VALORES.map((v, i) => (
                  <RevealItem key={v.tKey} className="grid grid-cols-[40px_minmax(0,1fr)] lg:grid-cols-[80px_minmax(0,1fr)] py-4 lg:py-6 border-b border-navy/15">
                    <span className="ed-serif text-[16px] lg:text-[20px] text-gold-deep">{`0${i + 1}/`}</span>
                    <span className="flex flex-col gap-1">
                      <span className="ed-serif text-[22px] lg:text-[30px] text-navy leading-tight">{t(v.tKey)}</span>
                      <span className="text-[14px] lg:text-[16px] leading-[1.5] text-ink-soft">{t(v.dKey)}</span>
                    </span>
                  </RevealItem>
                ))}
              </RevealGroup>
              <div className="lg:hidden mt-6 -mx-2 sm:mx-0">
                <TuSeguridad puesto={job.title} fondo="crema-2" />
              </div>
            </div>
          </div>

          {/* OTRAS VACANTES */}
          {otras.length > 0 && (
            <div className="mt-11 lg:mt-[110px]">
              <Reveal>
                <div className="flex flex-wrap justify-between items-baseline gap-3">
                  <h2 className="ed-label text-ink-soft">{otrasTitulo}</h2>
                  <Link to="/empleos" className="ed-label text-navy hover:text-coral hidden sm:inline-flex items-center gap-2">
                    {t('det_ver_todas')} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
              <RevealGroup className="mt-3 border-b border-navy/15">
                {otras.map(o => (
                  <RevealItem key={o.id}>
                    <Link
                      className="flex justify-between items-center gap-3 py-4 lg:py-5 border-t border-navy/15 no-underline text-navy hover:text-navy group"
                      to={`/empleos/${o.id}`}
                    >
                      <span className="flex flex-col gap-1 min-w-0">
                        <span className="ed-serif text-[20px] lg:text-[26px] leading-snug group-hover:underline decoration-coral decoration-2 underline-offset-4">{titulo(o)}</span>
                        <span className="text-[13px] lg:text-[14px] text-ink-soft">
                          {lugar(o.location)} · {t('cand_v1_t')}
                        </span>
                      </span>
                      <span aria-hidden="true" className="ed-serif text-[22px]">↗</span>
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          )}

          {/* CIERRE */}
          <Reveal className="mt-10 lg:mt-[90px] -mx-2 sm:mx-0">
            <div className="bg-navy text-cream rounded-[24px] lg:rounded-[36px] px-[22px] py-[30px] sm:p-10 lg:px-[56px] lg:py-[56px] flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-10">
              <div className="flex flex-col gap-3.5">
                <h2 className="ed-serif font-[320] leading-[1.05] text-[clamp(34px,4.4vw,64px)] [text-wrap:balance]">
                  {t('cand_final_h2_a')} <span className="ed-serif-it text-gold">{t('cand_final_h2_b')}</span>
                </h2>
                <p className="text-[15px] lg:text-[17px] leading-[1.55] text-cream/80 max-w-[34em]">{t('cand_final_p')}</p>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                <Link
                  to="/areas"
                  className="ed-pill text-cream hover:text-cream hover:bg-cream/10 shadow-[inset_0_0_0_1.5px_rgba(246,243,236,0.7)]"
                >
                  {t('cand_cta_general')}
                </Link>
                <span className="text-[13px] text-cream/70">{t('cand_general_nota')}</span>
              </div>
            </div>
          </Reveal>
        </Wrap>
      </section>

      {/* BARRA FIJA DE POSTULACIÓN (móvil) */}
      <div className="lg:hidden fixed left-3 right-3 bottom-3 z-40 bg-navy-deep text-cream rounded-full pl-5 pr-2 py-2 flex items-center justify-between gap-3 shadow-[0_18px_40px_-12px_rgba(4,30,58,0.55)]">
        <span className="flex flex-col leading-tight min-w-0">
          <strong className="text-[15px] truncate">{titulo(job)}</strong>
          <span className="text-[12px] text-cream/70 truncate">{abierta ? t('det_contacto_48h') : t('det_cerrada_t')}</span>
        </span>
        {abierta ? (
          <a
            className="h-11 px-5 rounded-full bg-coral text-navy hover:text-navy flex items-center font-label font-semibold text-[15px] shrink-0 no-underline"
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('det_postular')}
          </a>
        ) : (
          <Link className="h-11 px-5 rounded-full bg-coral text-navy hover:text-navy flex items-center font-label font-semibold text-[15px] shrink-0 no-underline" to="/areas">
            {t('cand_cta_general')}
          </Link>
        )}
      </div>
    </>
  )
}
