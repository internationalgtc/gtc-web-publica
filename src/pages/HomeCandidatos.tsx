import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useT, useLang } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { CIFRAS } from '@/data/cifras'
import { JOBS, type Job } from '@/data/jobs'
import { equipo, type TeamMember } from '@/data/equipo'
import { traerVacantes } from '@/lib/vacantes-nexus'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'
import { Img3D, SecHead, SecTag, TituloEntrada, Wrap } from '@/components/shared/EditorialPiezas'
import { VacantesPortal } from '@/components/portal/VacantesPortal'
import { HeroVideo } from '@/components/portal/HeroVideo'

// Portada de la variante CANDIDATOS (rama `candidatos`, deploy gtc-empleos).
// Rediseño «A · Revista» (28-sep-2026), lienzos A-portal + A-portal-2:
// encabezado con video, franja navy, 01 oportunidades (la lista viva de Nexus
// con su ficha), 02 propuesta, 03 proceso, 04 comunidad, 05 áreas y cierre.
// Mismo lenguaje que la portada de empresas (rama main, src/pages/Index.tsx).

const VALUES = [
  { tKey: 'cand_v1_t', dKey: 'cand_v1_d' },
  { tKey: 'cand_v2_t', dKey: 'cand_v2_d' },
  { tKey: 'cand_v3_t', dKey: 'cand_v3_d' },
]

const STEPS = [
  { tKey: 'cand_proc_1_t', dKey: 'cand_proc_1_d' },
  { tKey: 'cand_proc_2_t', dKey: 'cand_proc_2_d' },
  { tKey: 'cand_proc_3_t', dKey: 'cand_proc_3_d' },
  { tKey: 'cand_proc_4_t', dKey: 'cand_proc_4_d' },
]
/** El paso que va resaltado en coral (01 · Postúlate), como en el diseño. */
const PASO_DESTACADO = 0

// Cada área abre la bolsa de empleos ya filtrada (?area=). El departamento es
// el que usa la web (src/data/jobs.ts): finanzas convive con Administración y
// diseño con Marketing en el filtro público.
const AREAS = [
  { nameKey: 'home_area_1', tagKey: 'home_area_1_tag', dept: 'Administración' },
  { nameKey: 'home_area_2', tagKey: 'home_area_2_tag', dept: 'Marketing' },
  { nameKey: 'home_area_3', tagKey: 'home_area_3_tag', dept: 'Administración' },
  { nameKey: 'home_area_4', tagKey: 'home_area_4_tag', dept: 'Ventas y Comercial' },
  { nameKey: 'home_area_5', tagKey: 'home_area_5_tag', dept: 'Marketing' },
  { nameKey: 'home_area_6', tagKey: 'home_area_6_tag', dept: 'Tecnología' },
]

const MARQUEE = ['cand_mq_1', 'cand_mq_2', 'cand_mq_3', 'cand_mq_4', 'cand_mq_5']

/** Quienes acompañan al profesional (RRHH y Calidad), de src/data/equipo.ts. */
const ACOMPANAN = [9, 21, 6, 13, 17]
  .map(id => equipo.find(m => m.id === id))
  .filter((m): m is TeamMember => !!m && !!m.foto)

/* Títulos de sección: misma escala en toda la portada. */
const H2 = 'ed-serif font-[320] text-navy leading-none tracking-[-0.02em] text-[clamp(40px,6.1vw,88px)] [text-wrap:balance]'

const minuscula = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

/* ——— ENCABEZADO ——— */

function Encabezado() {
  const t = useT()
  const lang = useLang()
  const cifras = [
    { n: CIFRAS.profesionales.numero[lang], texto: `${t('home_stat_profesionales')} · ${minuscula(t('cand_stat_profesionales_foot'))}` },
    { n: CIFRAS.empresas.numero[lang], texto: `${t('home_stat_empresas')} · ${minuscula(t('cand_stat_empresas_foot'))}` },
    { n: String(CIFRAS.areas), texto: minuscula(t('home_stat_areas')) },
  ]
  // «sin irte de casa.»: la segunda parte en cursiva y la última palabra subrayada.
  const b = t('cand_hero_b')
  const corte = b.lastIndexOf(' ')

  return (
    <section id="inicio" className="relative overflow-hidden border-b border-navy/15 lg:min-h-[960px]">
      <HeroVideo />
      <div className="absolute inset-0 ed-hero-velo-v" aria-hidden="true" />
      <div className="absolute inset-0 ed-hero-velo-h" aria-hidden="true" />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:pr-[72px] lg:pl-[38%] xl:pl-[44.4%] pt-[106px] sm:pt-[120px] lg:pt-[134px] pb-10 lg:pb-12 flex flex-col lg:min-h-[960px]">
        <Reveal delay={0} y={0}>
          <div className="ed-label flex flex-wrap items-center gap-x-7 gap-y-2 pb-3.5 border-b border-navy/15 text-ink-soft">
            <span className="flex items-center gap-[9px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#2fae6b] motion-safe:animate-pulse" aria-hidden="true" />
              {t('cand_hero_badge')}
            </span>
            <span>{t('cand_hero_badge_meta')}</span>
          </div>
        </Reveal>

        <TituloEntrada
          className="ed-serif font-[330] text-navy leading-[0.98] tracking-[-0.025em] text-[clamp(44px,12vw,64px)] sm:text-[clamp(60px,9.4vw,88px)] lg:text-[clamp(72px,7.8vw,112px)] mt-10 lg:mt-14 [text-wrap:balance]"
          tramos={[
            { texto: t('cand_hero_a') },
            { texto: corte > 0 ? b.slice(0, corte) : '', em: true },
            { texto: corte > 0 ? b.slice(corte + 1) : b, subraya: true },
          ]}
        />

        <Reveal delay={0.7} y={26}>
          <p className="mt-7 lg:mt-[38px] max-w-[31em] text-[17px] sm:text-[19px] lg:text-[20px] leading-[1.55] text-ink-soft [text-wrap:pretty]">
            {t('cand_hero_sub')}
          </p>
        </Reveal>

        <Reveal delay={0.82} y={26}>
          <div className="flex flex-col sm:flex-row gap-3.5 mt-8 lg:mt-[34px]">
            <a className="ed-pill ed-pill-navy" href="#oportunidades">
              {t('cand_cta_primary')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
            </a>
            <a className="ed-pill ed-pill-line" href="#propuesta">
              {t('cand_cta_secondary')}
            </a>
          </div>
        </Reveal>

        {/* Cifras: salen de src/data/cifras.ts y se escriben tal cual (sin contador). */}
        <div className="mt-12 lg:mt-auto lg:pt-14">
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-3 border-t border-navy/15">
          {cifras.map((c, i) => (
            <RevealItem
              key={c.texto}
              className={`py-4 sm:py-[18px] flex flex-col gap-1 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-navy/15 sm:pl-6' : ''}`}
            >
              <span className="ed-serif font-[320] text-navy text-[32px] lg:text-[38px] leading-tight whitespace-nowrap">{c.n}</span>
              <span className="text-[16px] lg:text-[18px] xl:text-[20px] leading-snug text-ink-soft">{c.texto}</span>
            </RevealItem>
          ))}
        </RevealGroup>
        </div>
      </div>
    </section>
  )
}

/* ——— FRANJA NAVY ——— La segunda tanda solo existe para el desplazamiento continuo. */
function Franja() {
  const t = useT()
  return (
    <div className="ed-marquee ed-marquee-navy" aria-hidden="true">
      <div className="ed-marquee-track">
        {Array.from({ length: 4 }, (_, half) => MARQUEE.map((k, i) => <span key={`${half}-${i}`}>{t(k)}</span>))}
      </div>
    </div>
  )
}

/* ——— 01 OPORTUNIDADES ——— */
function Oportunidades() {
  const t = useT()
  // Mismas vacantes que la bolsa: Nexus, con src/data/jobs.ts como estado
  // inicial y como reserva si Nexus no responde.
  const [jobs, setJobs] = useState<Job[]>(() => JOBS.filter(j => j.active))
  useEffect(() => {
    const ctrl = new AbortController()
    traerVacantes(ctrl.signal).then(({ jobs }) => {
      if (!ctrl.signal.aborted) setJobs(jobs)
    })
    return () => ctrl.abort()
  }, [])

  return (
    <section id="oportunidades" className="pt-20 lg:pt-[120px] pb-10 scroll-mt-[74px]">
      <Wrap>
        <SecHead tag={<SecTag n="01" name={t('empleos_label')} meta={`${jobs.length} ${t('emp_activas_meta')}`} />}>
          <h2 className={H2}>
            {t('portal_oport_h2_a')} <span className="ed-serif-it">{t('portal_oport_h2_b')}</span>
          </h2>
        </SecHead>
        <VacantesPortal jobs={jobs} limite={12} />
      </Wrap>
    </section>
  )
}

/* ——— 02 PROPUESTA ——— */
function Propuesta() {
  const t = useT()
  return (
    <section id="propuesta" className="pt-20 lg:pt-[130px] pb-10 scroll-mt-[74px]">
      <Wrap>
        <SecHead tag={<SecTag n="02" name={t('cand_sec_valor')} meta={t('cand_sec_valor_meta')} />}>
          <h2 className={H2}>
            {t('cand_valor_h2_a')} <span className="ed-serif-it">{t('cand_valor_h2_b')}</span>
          </h2>
        </SecHead>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-8 lg:gap-16 mt-10 lg:mt-[72px] items-center">
          <Reveal>
            <Img3D src="/img/3d/portal-puerta.webp" className="ed-3d w-full h-[220px] sm:h-[320px] lg:h-[520px] object-cover rounded-[28px]" />
          </Reveal>
          <RevealGroup className="flex flex-col border-t border-navy/20">
            {VALUES.map((v, i) => (
              <RevealItem key={v.tKey} className="grid grid-cols-[48px_minmax(0,1fr)] lg:grid-cols-[80px_minmax(0,1fr)] py-6 lg:py-[30px] border-b border-navy/20">
                <span className="ed-serif text-[17px] lg:text-[20px] text-gold-deep">{`0${i + 1}/`}</span>
                <span className="flex flex-col gap-2.5">
                  <h3 className="ed-serif font-[320] text-navy leading-[1.05] text-[clamp(28px,3.1vw,44px)]">{t(v.tKey)}</h3>
                  <p className="text-[16px] lg:text-[17px] leading-[1.6] text-ink-soft">{t(v.dKey)}</p>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Wrap>
    </section>
  )
}

/* ——— 03 PROCESO ——— */
function Proceso() {
  const t = useT()
  return (
    <section id="proceso" className="mt-16 lg:mt-[100px] bg-navy text-cream pt-20 lg:pt-[120px] pb-24 lg:pb-[110px] scroll-mt-[74px]">
      <Wrap>
        <SecHead tag={<SecTag dark n="03" name={t('cand_sec_proceso')} meta={t('cand_sec_proceso_meta')} />}>
          <h2 className="ed-serif font-light text-cream leading-[1.02] tracking-[-0.02em] text-[clamp(38px,5.6vw,80px)] [text-wrap:balance]">
            {t('cand_proc_h2_a')} <span className="ed-serif-it text-gold">{t('cand_proc_h2_b')}</span>
          </h2>
        </SecHead>
        <RevealGroup className="mt-14 lg:mt-20 border-t border-cream/20">
          {STEPS.map((paso, i) => {
            const destacado = i === PASO_DESTACADO
            return (
              <RevealItem
                key={paso.tKey}
                className={`grid grid-cols-[36px_minmax(0,1fr)] lg:grid-cols-[90px_minmax(0,1fr)_minmax(0,400px)] items-center gap-x-3 lg:gap-x-6 gap-y-2 ${
                  destacado
                    ? 'bg-coral text-navy rounded-md -mx-4 sm:-mx-5 lg:-mx-7 px-4 sm:px-5 lg:px-7 py-5 lg:py-6'
                    : 'py-4 lg:py-3.5 border-b border-cream/20'
                }`}
              >
                <span className={`ed-serif text-base lg:text-xl ${destacado ? 'text-navy' : 'text-cream/60'}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3
                  className={`ed-serif tracking-[-0.03em] text-[clamp(32px,5.2vw,80px)] [text-wrap:balance] ${
                    destacado ? 'font-[360] leading-[1.05]' : 'font-[280] leading-[1.15] text-cream/50'
                  }`}
                >
                  {t(paso.tKey)}
                </h3>
                <p
                  className={`col-start-2 lg:col-start-3 leading-[1.55] ${
                    destacado ? 'text-navy font-bold text-[15px] lg:text-[17px]' : 'text-cream/70 text-[15px] lg:text-base'
                  }`}
                >
                  {t(paso.dKey)}
                </p>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </Wrap>
    </section>
  )
}

/* ——— 04 COMUNIDAD ——— */
function Comunidad() {
  const t = useT()
  const lang = useLang()
  return (
    <section id="comunidad" className="pt-20 lg:pt-[130px] pb-10 scroll-mt-[74px]">
      <Wrap>
        <Reveal>
          <SecTag n="04" name={t('cand_sec_comunidad')} meta={t('cand_sec_comunidad_meta')} />
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 lg:gap-16 mt-8 lg:mt-12 items-center">
          <Reveal>
            <p className="ed-serif font-light text-navy leading-[1.08] tracking-[-0.02em] text-[clamp(34px,5.1vw,74px)] [text-wrap:balance]">
              {t('cand_com_big_1')} <span className="ed-serif-it">{t('cand_com_big_em')}</span> {t('cand_com_big_2')}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Img3D src="/img/3d/portal-comunidad.webp" className="ed-3d w-full h-[220px] sm:h-[320px] lg:h-[460px] object-cover" />
          </Reveal>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 lg:gap-16 mt-10 lg:mt-16 items-start">
          <Reveal>
            <p className="text-[17px] lg:text-[18px] leading-[1.65] text-ink-soft">{t('cand_com_p')}</p>
          </Reveal>
          <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {ACOMPANAN.map(m => (
              <RevealItem key={m.id}>
                <figure className="flex flex-col gap-2">
                  <img
                    src={m.foto ?? undefined}
                    alt={m.nombre}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[190px] object-cover object-[50%_20%] rounded-[14px] bg-cream-2"
                  />
                  <figcaption className="text-[13px] text-ink-soft">
                    <strong className="block text-navy">{m.nombre}</strong>
                    {lang === 'en' ? m.rolEn : m.rol}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Wrap>
    </section>
  )
}

/* ——— 05 ÁREAS ——— */
function Areas() {
  const t = useT()
  return (
    <section id="areas" className="pt-20 lg:pt-[130px] pb-10 scroll-mt-[74px]">
      <Wrap>
        <SecHead tag={<SecTag n="05" name={t('cand_sec_areas')} meta={t('home_sec_areas_meta')} />}>
          <h2 className={H2}>
            {t('cand_areas_h2_a')} <span className="ed-serif-it">{t('cand_areas_h2_b')}</span>
          </h2>
        </SecHead>
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12 lg:mt-16 border-t border-l border-navy/20">
          {AREAS.map((area, i) => (
            <RevealItem key={area.nameKey} className="flex">
              <Link
                to={`/empleos?area=${encodeURIComponent(area.dept)}`}
                className="flex flex-col justify-between gap-7 lg:gap-[30px] w-full no-underline border-r border-b border-navy/20 p-6 lg:p-[30px] text-navy hover:bg-cream-2 hover:text-navy transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:[outline-offset:-4px]"
              >
                <span className="ed-label text-ink-soft">/ {String(i + 1).padStart(2, '0')}</span>
                <span className="flex flex-col gap-1.5">
                  <span className="ed-serif text-[26px] lg:text-[32px] leading-[1.1]">{t(area.nameKey)}</span>
                  <span className="text-[15px] text-ink-soft">{t(area.tagKey)}</span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal>
          <p className="ed-serif-it text-[20px] lg:text-[26px] leading-snug text-navy mt-8 lg:mt-[34px]">{t('home_areas_note')}</p>
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ——— CIERRE ——— */
function Cierre() {
  const t = useT()
  return (
    <section id="contacto" className="pt-20 lg:pt-[110px] pb-20 lg:pb-[110px] scroll-mt-[74px]">
      <Wrap>
        <Reveal className="bg-cream-2 rounded-[28px] lg:rounded-[40px] px-5 py-10 sm:p-10 lg:px-[72px] lg:py-[90px] grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-8 lg:gap-14 items-center overflow-hidden">
          <div className="flex flex-col gap-6">
            <h2 className="ed-serif font-light text-navy leading-none tracking-[-0.025em] text-[clamp(40px,6.6vw,96px)] [text-wrap:balance]">
              {t('cand_final_h2_a')} <span className="ed-serif-it">{t('cand_final_h2_b')}</span>
            </h2>
            <p className="text-[17px] lg:text-[19px] leading-[1.6] text-ink-soft max-w-[30em]">{t('cand_final_p')}</p>
            <div className="flex flex-col sm:flex-row gap-3.5 mt-2">
              <Link className="ed-pill ed-pill-navy" to="/empleos">
                {t('cand_cta_primary')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
              </Link>
              <Link className="ed-pill ed-pill-line" to="/areas">
                {t('cand_cta_general')}
              </Link>
            </div>
            <span className="text-[14px] text-ink-soft">{t('cand_general_nota')}</span>
          </div>
          <Img3D src="/img/3d/conexion-crema.webp" className="ed-3d w-full h-[200px] sm:h-[280px] lg:h-[380px] object-cover" />
        </Reveal>
      </Wrap>
    </section>
  )
}

export default function HomeCandidatos() {
  return (
    <>
      <SEO
        title="Trabajo remoto para Latinoamérica"
        description="Trabaja para empresas de España y EE.UU. desde tu casa. Salario en dólares, formación continua y una comunidad de profesionales remotos que te respalda."
        path="/"
        keywords="trabajo remoto latinoamerica, empleo remoto internacional, vacantes remotas, asistente virtual, trabajo desde casa, Global Talent Connections"
      />
      <Encabezado />
      <Franja />
      <Oportunidades />
      <Propuesta />
      <Proceso />
      <Comunidad />
      <Areas />
      <Cierre />
    </>
  )
}
