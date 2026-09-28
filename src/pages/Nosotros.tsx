import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SEO from '@/components/shared/SEO'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'
import { Img3D, SecHead, SecTag, TituloEntrada, Wrap } from '@/components/shared/EditorialPiezas'
import { CIFRAS } from '@/data/cifras'
import { direccion, operativo, type TeamMember } from '@/data/equipo'
import { useT, useLang } from '@/hooks/useT'

/* Nosotros — rediseño «A · Revista» (28-sep-2026), lienzo A-nosotros.
   El equipo sale de src/data/equipo.ts (fuente única, orden definido por
   Ariel); las cifras, de src/data/cifras.ts. */

const VALORES = [
  { tKey: 'nos_v1_t', dKey: 'nos_v1_d' },
  { tKey: 'nos_v2_t', dKey: 'nos_v2_d' },
  { tKey: 'nos_v3_t', dKey: 'nos_v3_d' },
]

const H2 = 'ed-serif leading-none tracking-[-0.02em] [text-wrap:balance]'

function Encabezado() {
  const t = useT()
  const lang = useLang()
  return (
    <section className="pt-[112px] sm:pt-[140px] lg:pt-[174px] pb-12 lg:pb-[90px] border-b border-navy/15">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-6 lg:gap-12 items-center">
        <div className="flex flex-col">
          <Reveal y={0}>
            <div className="ed-label flex flex-wrap gap-x-3.5 gap-y-1 pb-3.5 border-b border-navy/15 text-ink-soft">
              <span className="font-semibold text-navy">{t('nav_nosotros')}</span>
              <span>· {t('nosotros_label')}</span>
            </div>
          </Reveal>
          <TituloEntrada
            className="ed-serif font-[330] text-navy leading-none tracking-[-0.025em] mt-10 lg:mt-[52px] text-[clamp(42px,11.4vw,60px)] sm:text-[clamp(60px,9vw,84px)] lg:text-[clamp(70px,6.9vw,100px)] [text-wrap:balance]"
            tramos={[
              { texto: t('nosotros_titulo_1') },
              { texto: t('nosotros_mercados'), em: true },
              { texto: lang === 'en' ? 'and' : 'y' },
              { texto: `${t('nosotros_talento')}.`, subraya: true },
            ]}
          />
          <Reveal delay={0.6} y={26}>
            <p className="mt-7 lg:mt-10 max-w-[30em] text-[17px] sm:text-[19px] lg:text-[21px] leading-[1.55] text-ink-soft [text-wrap:pretty]">
              {t('nosotros_subtitle')}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.3} y={0}>
          <Img3D primero src="/img/3d/conexion-crema.webp" className="ed-3d w-full h-[240px] sm:h-[340px] lg:h-[520px] object-cover" />
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ——— 01 MISIÓN ——— */
function Mision() {
  const t = useT()
  return (
    <section id="mision" className="bg-navy text-cream py-20 lg:py-[120px]">
      <Wrap>
        <SecHead tag={<SecTag dark n="01" name={t('nosotros_mision_titulo').replace(/:\s*$/, '')} />}>
          <h2 className={`${H2} font-light leading-[1.02] text-[clamp(38px,6.1vw,88px)]`}>
            {t('nosotros_mision_highlight')} <span className="ed-serif-it text-gold">{t('nosotros_mision_cierre')}</span>
          </h2>
        </SecHead>
        <RevealGroup className="grid grid-cols-1 md:grid-cols-3 mt-12 lg:mt-[84px] border-t border-cream/20">
          {VALORES.map((v, i) => (
            <RevealItem
              key={v.tKey}
              className={`flex flex-col gap-4 lg:gap-[18px] py-8 lg:pt-10 lg:pb-2.5 ${
                i === 0 ? 'md:pr-8 lg:pr-10' : 'border-t md:border-t-0 md:border-l border-cream/20 md:px-8 lg:px-10'
              } ${i === 2 ? 'md:pr-0 lg:pr-0' : ''}`}
            >
              <span className="ed-serif text-lg lg:text-xl text-gold">0{i + 1}/</span>
              <h3 className="ed-serif font-[320] leading-[1.1] text-[clamp(30px,2.9vw,42px)]">{t(v.tKey)}</h3>
              <p className="text-[16px] lg:text-[18px] leading-[1.6] text-cream/80">{t(v.dKey)}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Wrap>
    </section>
  )
}

/* ——— Fotos del equipo: enteras (3/4), encuadre en la cara ——— */
function Persona({ m, grande }: { m: TeamMember; grande: boolean }) {
  const lang = useLang()
  const forma = `w-full aspect-[3/4] ${grande ? 'rounded-[18px] lg:rounded-[22px]' : 'rounded-2xl'}`
  return (
    <figure className={`flex flex-col ${grande ? 'gap-3.5' : 'gap-2.5'}`}>
      {m.foto ? (
        <img src={m.foto} alt={m.nombre} width={600} height={800} loading="lazy" decoding="async" className={`${forma} h-auto object-cover object-[50%_15%] bg-cream-2`} />
      ) : (
        <div className={`${forma} bg-navy-deep grid place-items-center ed-serif-it text-3xl text-cream/60`} aria-hidden="true">
          {m.nombre.split(' ').map(p => p[0]).slice(0, 2).join('')}
        </div>
      )}
      <figcaption className="flex flex-col gap-0.5 min-w-0">
        <span className={`ed-serif text-navy leading-tight ${grande ? 'text-[20px] sm:text-[24px] lg:text-[28px]' : 'text-[17px] lg:text-[19px]'}`}>{m.nombre}</span>
        <span className={grande ? 'ed-label text-ink-soft' : 'text-[13px] text-ink-soft'}>{lang === 'en' ? m.rolEn : m.rol}</span>
        <a
          href={`mailto:${m.email}`}
          className={`mt-0.5 text-ink-soft no-underline hover:text-navy hover:underline [overflow-wrap:anywhere] ${grande ? 'text-[13px] lg:text-[14px]' : 'text-[12px] leading-[1.35]'}`}
        >
          {m.email}
        </a>
      </figcaption>
    </figure>
  )
}

/* ——— 02 LIDERAZGO · 03 EQUIPO OPERATIVO ——— */
function Equipo() {
  const t = useT()
  return (
    <>
      <section id="equipo" className="pt-20 lg:pt-[130px] pb-10">
        <Wrap>
          <SecHead tag={<SecTag n="02" name={t('nosotros_liderazgo')} />}>
            <h2 className={`${H2} font-[320] text-navy text-[clamp(40px,6.1vw,88px)]`}>
              {t('nosotros_arquitectos')} <span className="ed-serif-it">{t('nosotros_conexiones')}.</span>
            </h2>
          </SecHead>
          <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 lg:gap-5 mt-12 lg:mt-16">
            {direccion.map(m => (
              <RevealItem key={m.id}>
                <Persona m={m} grande />
              </RevealItem>
            ))}
          </RevealGroup>
        </Wrap>
      </section>

      <section className="pt-16 lg:pt-[90px] pb-10">
        <Wrap>
          <Reveal>
            <h2 className="ed-label flex gap-3.5 text-ink-soft pb-3.5 border-b border-navy/15">
              <span className="font-semibold text-navy">03</span>
              <span>{t('nosotros_equipo_operativo')}</span>
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-7 lg:gap-y-6 mt-8 lg:mt-9">
            {operativo.map(m => (
              <RevealItem key={m.id}>
                <Persona m={m} grande={false} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Wrap>
      </section>
    </>
  )
}

/* ——— 04 PRESENCIA ——— */
function Presencia() {
  const t = useT()
  const lang = useLang()
  const cifras = [
    { numero: CIFRAS.empresas.numero[lang], texto: t('nosotros_empresas_activas') },
    { numero: '2', texto: t('nosotros_sedes') },
  ]
  return (
    <section id="presencia" className="pt-20 lg:pt-[130px] pb-10">
      <Wrap>
        <Reveal className="bg-cream-2 rounded-[28px] lg:rounded-[36px] px-5 py-10 sm:p-10 lg:px-[72px] lg:py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 lg:gap-[30px]">
            <SecTag n="04" name={t('nosotros_presencia')} />
            <h2 className={`${H2} font-[320] text-navy leading-[1.02] text-[clamp(38px,5.6vw,80px)]`}>
              {t('nosotros_presencia')} <span className="ed-serif-it">{t('nosotros_global')}.</span>
            </h2>
            <p className="text-[17px] lg:text-[20px] leading-[1.6] text-ink-soft max-w-[28em]">{t('nos_presencia_d')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mt-2.5">
              <div className="bg-cream rounded-[22px] p-6 lg:p-7 flex flex-col gap-2.5">
                <span className="ed-label text-ink-soft">{t('nos_sede')}</span>
                <span className="ed-serif text-navy leading-tight text-[30px] lg:text-[36px]">{t('nos_espana')}</span>
              </div>
              <div className="bg-cream rounded-[22px] p-6 lg:p-7 flex flex-col gap-2.5">
                <span className="ed-label text-ink-soft">{t('nos_entidad')}</span>
                <span className="ed-serif text-navy leading-tight text-[30px] lg:text-[36px]">{t('nos_miami')}</span>
                <span className="text-[15px] text-ink-soft">20900 NE 30th Ave, Suite 703</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col border-t border-navy/20">
            {cifras.map(c => (
              <div key={c.texto} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-6 lg:py-[30px] border-b border-navy/20">
                <span className="ed-serif font-[280] text-navy leading-none tracking-[-0.03em] whitespace-nowrap text-[clamp(56px,6.7vw,96px)]">{c.numero}</span>
                <span className="text-[18px] lg:text-[24px] text-ink-soft">{c.texto}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ——— CIERRE ——— */
function Cierre() {
  const t = useT()
  return (
    <section id="contacto" className="mt-16 lg:mt-[110px] bg-navy text-cream py-20 lg:py-[120px]">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8 lg:gap-[72px] items-center">
        <Reveal>
          <h2 className="ed-serif font-light leading-[1.02] tracking-[-0.025em] text-[clamp(40px,6.7vw,96px)] [text-wrap:balance]">
            {t('nosotros_cta_titulo')} <span className="ed-serif-it text-gold">{t('nosotros_horizontes')}?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-6 lg:gap-[26px]">
          <Img3D src="/img/3d/conexion-navy.webp" className="ed-3d-navy w-full h-[180px] sm:h-[230px] object-cover" />
          <Link to="/contacto" className="ed-pill self-start bg-coral text-navy hover:bg-coral-hover hover:text-navy focus-visible:outline-gold">
            {t('nosotros_soy_empresa')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
          </Link>
        </Reveal>
      </Wrap>
    </section>
  )
}

export default function NosotrosPage() {
  return (
    <div className="bg-cream text-ink">
      <SEO
        title="Sobre Nosotros"
        description={`Conoce a Global Talent Connections: equipo, misión y por qué ${CIFRAS.empresas.enFrase.es} confían en nuestros profesionales remotos de Latinoamérica.`}
        path="/nosotros"
        keywords="quienes somos Global Talent Connections, empresa talento remoto España, agencia asistentes virtuales, outsourcing Latinoamérica, equipo Global Talent"
        breadcrumbs={[{ name: 'Nosotros', url: '/nosotros' }]}
      />
      <Encabezado />
      <Mision />
      <Equipo />
      <Presencia />
      <Cierre />
    </div>
  )
}
