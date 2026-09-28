import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SEO from '@/components/shared/SEO'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'
import { Img3D, SecHead, SecTag, TituloEntrada, Wrap, ultimaPalabra } from '@/components/shared/EditorialPiezas'
import { useT } from '@/hooks/useT'

/* Servicios — rediseño «A · Revista» (28-sep-2026), lienzo A-servicios.
   Los 11 perfiles y sus descripciones son los de siempre (translations.ts). */

const PERFILES = ['admin', 'marketing', 'finanzas', 'dev', 'diseno', 'atencion', 'ia', 'arq', 'ecommerce', 'gestion', 'tecnico'].map(k => ({
  titleKey: `serv_${k}`,
  descKey: `serv_${k}_desc`,
}))
/** La fila que va en navy (Atención al Cliente), como en el diseño. */
const PERFIL_DESTACADO = 5

const INCLUYE = [
  { tKey: 'calc_inc_1', dKey: 'calc_inc_1_d', img: '/img/3d/factura.webp' },
  { tKey: 'calc_inc_2', dKey: 'calc_inc_2_d', img: null },
  { tKey: 'calc_inc_3', dKey: 'calc_inc_3_d', img: '/img/3d/garantia.webp' },
]

const H2 = 'ed-serif font-[320] text-navy leading-[1.02] tracking-[-0.02em] [text-wrap:balance]'

function Encabezado() {
  const t = useT()
  return (
    <section className="pt-[112px] sm:pt-[140px] lg:pt-[184px] pb-16 lg:pb-[90px] border-b border-navy/15">
      <Wrap>
        <Reveal y={0}>
          <div className="ed-label flex flex-wrap gap-x-3.5 gap-y-1 pb-3.5 border-b border-navy/15 text-ink-soft">
            <span className="font-semibold text-navy">{t('nav_servicios')}</span>
            <span>· {t('servicios_label')}</span>
            <span>· {t('serv_meta_areas')}</span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8 lg:gap-[72px] items-end mt-10 lg:mt-14">
          <TituloEntrada
            className="ed-serif font-[330] text-navy leading-[0.98] tracking-[-0.025em] text-[clamp(44px,12vw,64px)] sm:text-[clamp(64px,10vw,88px)] lg:text-[clamp(80px,7.8vw,112px)] [text-wrap:balance]"
            tramos={[{ texto: t('servicios_titulo_1') }, { texto: `${t('servicios_titulo_2')}.`, subraya: true }]}
          />
          <Reveal delay={0.6} y={26} className="flex flex-col gap-6 lg:gap-[26px] lg:pb-2.5">
            <p className="text-[17px] sm:text-[19px] lg:text-[21px] leading-[1.55] text-ink-soft [text-wrap:pretty]">{t('servicios_subtitle')}</p>
            <p className="ed-label text-ink-soft">{t('hero_precio')}</p>
            <Link className="ed-pill ed-pill-navy self-start" to="/contacto">
              {t('home_hero_cta_primary')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}

/* ——— 01 PERFILES ——— */
function Perfiles() {
  const t = useT()
  return (
    <section id="perfiles" className="pt-20 lg:pt-[110px] pb-10">
      <Wrap>
        <SecHead tag={<SecTag n="01" name={t('serv_sec_perfiles')} meta={t('serv_sec_perfiles_meta')} />}>
          <h2 className={`${H2} text-[clamp(38px,5.6vw,80px)]`}>
            {t('serv_h2_a')} <span className="ed-serif-it">{t('serv_h2_b')}</span>
          </h2>
        </SecHead>

        <RevealGroup className="mt-12 lg:mt-[72px] border-t-[1.5px] border-navy">
          {PERFILES.map((p, i) => {
            const destacado = i === PERFIL_DESTACADO
            const [inicio, final] = ultimaPalabra(t(p.titleKey))
            return (
              <RevealItem key={p.titleKey}>
                <Link
                  to="/contacto"
                  className={`group grid grid-cols-[40px_minmax(0,1fr)] md:grid-cols-[56px_minmax(0,1fr)_minmax(0,1.3fr)] lg:grid-cols-[90px_minmax(0,1fr)_minmax(0,1.3fr)_220px] gap-x-3 md:gap-x-6 gap-y-2.5 items-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:[outline-offset:-4px] ${
                    destacado
                      ? 'bg-navy text-cream rounded-md -mx-4 sm:-mx-5 lg:-mx-7 px-4 sm:px-5 lg:px-7 py-6 lg:py-[30px] hover:text-cream focus-visible:outline-gold'
                      : 'text-navy py-6 lg:py-[30px] border-b border-navy/20 hover:text-navy focus-visible:outline-navy'
                  }`}
                >
                  <span className={`ed-serif text-base lg:text-xl self-baseline ${destacado ? 'text-gold' : 'text-ink-soft'}`}>
                    /{String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="ed-serif font-[340] leading-[1.1] tracking-[-0.01em] text-[clamp(26px,3vw,40px)]">
                    {destacado && inicio ? (
                      <>
                        {inicio} <span className="ed-serif-it">{final}</span>
                      </>
                    ) : (
                      t(p.titleKey)
                    )}
                  </h3>
                  <p
                    className={`col-start-2 md:col-start-3 md:row-start-1 text-[16px] lg:text-[18px] leading-[1.55] ${
                      destacado ? 'text-cream/85' : 'text-ink-soft'
                    }`}
                  >
                    {t(p.descKey)}
                  </p>
                  <span
                    className={`col-start-2 md:col-start-3 lg:col-start-4 lg:row-start-1 justify-self-start lg:justify-self-end inline-flex items-center min-h-[44px] font-label font-semibold text-[15px]`}
                  >
                    <span className={`border-b-2 pb-[3px] ${destacado ? 'border-gold' : 'border-coral'}`}>
                      {t('servicios_solicitar')} <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </span>
                </Link>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </Wrap>
    </section>
  )
}

/* ——— 02 QUÉ INCLUYE EL PRECIO ——— */
function Incluye() {
  const t = useT()
  return (
    <section id="incluye" className="pt-20 lg:pt-[110px] pb-10">
      <Wrap>
        <div className="bg-cream-2 rounded-[28px] lg:rounded-[36px] px-5 py-10 sm:p-10 lg:px-[72px] lg:py-20 flex flex-col gap-10 lg:gap-14">
          <SecHead tag={<SecTag n="02" name={t('calc_incluye_titulo')} meta={t('serv_incluye_meta')} />}>
            <h2 className={`${H2} leading-[1.04] text-[clamp(36px,5vw,72px)]`}>
              {t('serv_incluye_h2_a')} <span className="ed-serif-it">{t('serv_incluye_h2_b')}</span>
            </h2>
          </SecHead>
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch">
            {INCLUYE.map((c, i) => (
              <RevealItem key={c.tKey} className="flex">
                {c.img ? (
                  <article className="w-full bg-cream rounded-3xl p-6 lg:p-[30px] flex flex-col gap-[18px]">
                    <Img3D src={c.img} className="ed-3d w-full h-[190px] lg:h-[230px] object-cover rounded-[18px]" />
                    <div className="flex gap-3.5 items-baseline">
                      <span className="ed-serif text-lg text-ink-soft">0{i + 1}/</span>
                      <h3 className="ed-serif font-[340] text-navy leading-[1.1] text-[clamp(26px,2.3vw,32px)]">{t(c.tKey)}</h3>
                    </div>
                    <p className="text-[16px] lg:text-[17px] leading-[1.6] text-ink-soft">{t(c.dKey)}</p>
                  </article>
                ) : (
                  <article className="w-full bg-navy text-cream rounded-3xl p-6 lg:p-[30px] flex flex-col justify-between gap-[18px]">
                    <span className="ed-serif-it font-[280] text-gold leading-[0.9] text-[clamp(96px,10.4vw,150px)]" aria-hidden="true">
                      i.
                    </span>
                    <div className="flex flex-col gap-[18px]">
                      <div className="flex gap-3.5 items-baseline">
                        <span className="ed-serif text-lg text-gold">0{i + 1}/</span>
                        <h3 className="ed-serif font-[340] leading-[1.1] text-[clamp(26px,2.3vw,32px)]">{t(c.tKey)}</h3>
                      </div>
                      <p className="text-[16px] lg:text-[17px] leading-[1.6] text-cream/85">{t(c.dKey)}</p>
                    </div>
                  </article>
                )}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Wrap>
    </section>
  )
}

/* ——— CIERRE ——— */
function Cierre() {
  const t = useT()
  const [inicio, final] = ultimaPalabra(t('servicios_no_encuentras'))
  return (
    <section id="contacto" className="mt-16 lg:mt-[110px] bg-navy text-cream py-20 lg:py-[120px]">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 lg:gap-[72px] items-center">
        <Reveal>
          <h2 className="ed-serif font-light leading-[1.02] tracking-[-0.025em] text-[clamp(40px,6.4vw,92px)] [text-wrap:balance]">
            {inicio} <span className="ed-serif-it text-gold">{final}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-7">
          <p className="text-[17px] lg:text-[21px] leading-[1.55] text-cream/85">{t('servicios_cuentanos')}</p>
          <Link to="/contacto" className="ed-pill self-start bg-coral text-navy hover:bg-coral-hover hover:text-navy focus-visible:outline-gold">
            {t('servicios_solicitar_asistente')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
          </Link>
          <p className="ed-label text-cream/70">{t('hero_precio')}</p>
        </Reveal>
      </Wrap>
    </section>
  )
}

export default function ServiciosPage() {
  return (
    <div className="bg-cream text-ink">
      <SEO
        title="Servicios de Talento Remoto"
        description="Asistentes virtuales y profesionales remotos para marketing, administración, diseño, desarrollo, ventas, RRHH y más. Perfiles desde 1.200 €/mes."
        path="/servicios"
        keywords="servicios asistente virtual, asistente virtual marketing, asistente administrativo remoto, SDR remoto, diseñador gráfico remoto, desarrollador remoto, atención cliente remoto, RRHH remoto, contratar profesional remoto España"
        breadcrumbs={[{ name: 'Servicios', url: '/servicios' }]}
      />
      <Encabezado />
      <Perfiles />
      <Incluye />
      <Cierre />
    </div>
  )
}
