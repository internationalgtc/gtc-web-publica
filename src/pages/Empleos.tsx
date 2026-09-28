import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { JOBS, DEPARTMENTS } from '@/data/jobs'
import { traerVacantes } from '@/lib/vacantes-nexus'
import type { Job } from '@/data/jobs'
import { useT } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { Reveal } from '@/components/shared/EditorialReveal'
import { SecTag, TituloEntrada, Wrap } from '@/components/shared/EditorialPiezas'
import { VacantesPortal } from '@/components/portal/VacantesPortal'

// Bolsa de empleos — variante candidatos, rediseño «A · Revista» (28-sep-2026):
// la misma lista con ficha que la portada (VacantesPortal), sin tope de filas.
//
// UNA sola lista con TODO lo que Nexus publica (búsquedas abiertas y perfiles
// generales por igual), como pidió Ariel el 8-sep-2026: «yo quería todas las
// que están en la automatización». La postulación por área es OTRA página
// (/areas) a la que se llega desde el pie de esta lista y desde la portada,
// no un bloque apilado acá.

export default function EmpleosPage() {
  const t = useT()
  // La portada linkea /empleos?area=<departamento>: la bolsa se abre filtrada.
  const [searchParams] = useSearchParams()
  const area = searchParams.get('area')
  const deptInicial = area && DEPARTMENTS.includes(area) ? area : ''

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

  return (
    <>
      <SEO
        title="Trabajo remoto — Empleos abiertos en Latinoamérica"
        description="Trabajo remoto desde casa: vacantes abiertas en marketing, ventas, administración, desarrollo, diseño, finanzas y más. Empleos 100% remotos para Argentina, Chile, Colombia, México, Perú y toda Latinoamérica. Postúlate hoy."
        path="/empleos"
      />

      {/* CABECERA */}
      <section className="pt-[112px] sm:pt-[140px] lg:pt-[170px] pb-4">
        <Wrap>
          <Reveal y={0}>
            <div className="pb-3.5 border-b border-navy/15">
              <SecTag n="✳" name={t('empleos_label')} meta={`${activeJobs.length} ${t('emp_activas_meta')}`} />
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 lg:gap-[72px] items-end mt-10 lg:mt-14">
            <TituloEntrada
              className="ed-serif font-[330] text-navy leading-[0.98] tracking-[-0.025em] text-[clamp(44px,12vw,64px)] sm:text-[clamp(60px,9.4vw,88px)] lg:text-[clamp(72px,7vw,104px)] [text-wrap:balance]"
              tramos={[{ texto: t('empleos_titulo_1') }, { texto: `${t('empleos_titulo_2')}.`, subraya: true }]}
            />
            <Reveal delay={0.6} y={26}>
              <p className="text-[17px] sm:text-[19px] lg:text-[20px] leading-[1.55] text-ink-soft max-w-[30em] [text-wrap:pretty] lg:pb-2.5">
                {activeJobs.length} {t('emp_subtitle_tpl')}
              </p>
            </Reveal>
          </div>
        </Wrap>
      </section>

      {/* LISTADO — todo lo que Nexus publica, en una sola lista, con su ficha */}
      <section className="pb-24 lg:pb-[130px]">
        <Wrap>
          <VacantesPortal key={deptInicial} jobs={activeJobs} deptInicial={deptInicial} />

          {/* ¿No está tu búsqueda? La postulación por área vive en su propia página */}
          <Reveal>
            <div className="mt-20 lg:mt-[90px] bg-cream-2 rounded-[28px] lg:rounded-[36px] px-5 py-9 sm:p-10 lg:px-[56px] lg:py-[52px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex flex-col gap-3">
                <p className="ed-serif font-[330] text-navy text-[clamp(24px,2.6vw,36px)] leading-[1.15] max-w-[26ch] [text-wrap:balance]">{t('emp_cta_areas')}</p>
                <span className="text-[14px] text-ink-soft">{t('cand_general_nota')}</span>
              </div>
              <Link className="ed-pill ed-pill-navy shrink-0 self-start lg:self-center" to="/areas">
                {t('areas_label')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </Wrap>
      </section>
    </>
  )
}
