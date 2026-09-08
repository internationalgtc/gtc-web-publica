import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useInView, useReducedMotion, animate } from 'framer-motion'
import { ArrowRight, Play, X } from 'lucide-react'
import { useT, useLang } from '@/hooks/useT'
import { RESENAS_GOOGLE, RESUMEN_GOOGLE } from '@/data/resenasGoogle'
import { direccion, filasOperativo, type TeamMember } from '@/data/equipo'
import SEO, { HOME_FAQ_SCHEMA } from '@/components/shared/SEO'
import { FormularioLead } from '@/components/shared/FormularioLead'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const MARQUEE_CLIENTS = ['Reformas Habikal', 'Fricopan', 'Moonlight', 'Miramar']

const AREAS = [
  { nameKey: 'home_area_1', tagKey: 'home_area_1_tag' },
  { nameKey: 'home_area_2', tagKey: 'home_area_2_tag' },
  { nameKey: 'home_area_3', tagKey: 'home_area_3_tag' },
  { nameKey: 'home_area_4', tagKey: 'home_area_4_tag' },
  { nameKey: 'home_area_5', tagKey: 'home_area_5_tag' },
  { nameKey: 'home_area_6', tagKey: 'home_area_6_tag' },
]

const PROCESS_STEPS = [
  { tKey: 'home_proc_1_t', dKey: 'home_proc_1_d' },
  { tKey: 'home_proc_2_t', dKey: 'home_proc_2_d' },
  { tKey: 'home_proc_3_t', dKey: 'home_proc_3_d' },
  { tKey: 'home_proc_4_t', dKey: 'home_proc_4_d' },
]

/* Videos servidos desde public/videos/ (antes Cloudinary, cuenta deshabilitada) */
const VIDEOS_TESTIMONIO = [
  { nombre: 'Miguel Ángel Ramírez', cargoKey: 'testi_t1_cargo', src: '/videos/testimonio-1.mp4', poster: '/videos/testimonio-1.jpg' },
  { nombre: 'Arturo Sanz Santos', cargoKey: 'testi_t2_cargo', src: '/videos/testimonio-2.mp4', poster: '/videos/testimonio-2.jpg' },
  { nombre: 'Alex Andreu Peinado', cargoKey: 'testi_t3_cargo', src: '/videos/testimonio-3.mp4', poster: '/videos/testimonio-3.jpg' },
  { nombre: 'Curro Sabás', cargoKey: 'testi_t4_cargo', src: '/videos/testimonio-4.mp4', poster: '/videos/testimonio-4.jpg' },
]

const GUARANTEES = [
  { tKey: 'home_gar_1_t', dKey: 'home_gar_1_d' },
  { tKey: 'home_gar_2_t', dKey: 'home_gar_2_d' },
  { tKey: 'home_gar_3_t', dKey: 'home_gar_3_d' },
]

/* ——— Motion primitives ———
   El contenido se renderiza visible; el estado oculto lo aplica framer-motion
   vía estilos inline (JS). Con prefers-reduced-motion no se oculta nada. */

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
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
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

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView || reduced) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: v => {
        el.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, to, reduced])

  return <span ref={ref}>{to}</span>
}

/* Reveal enmascarado por palabra para el H1 del hero */
function HeroTitle() {
  const t = useT()
  const reduced = useReducedMotion()
  const parts = [
    { text: t('home_hero_title_a'), em: false },
    { text: t('home_hero_title_b'), em: true },
  ]
  let wordIndex = 0
  return (
    <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(46px,7.6vw,118px)] mt-16 max-w-[12ch] [text-wrap:balance]">
      {parts.map((part, pi) => (
        <span key={pi}>
          {part.text.split(' ').map((word, wi) => {
            const delay = 0.2 + wordIndex++ * 0.055
            return (
              <span key={wi}>
                <span className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                  <motion.span
                    className={`inline-block ${part.em ? 'italic text-gold-deep' : ''}`}
                    initial={reduced ? false : { y: '112%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.15, ease: EASE, delay }}
                  >
                    {word}
                  </motion.span>
                </span>{' '}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

export default function HomePage() {
  const t = useT()
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) {
      const timer = setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60)
      return () => clearTimeout(timer)
    }
  }, [hash])

  return (
    <>
      <SEO
        title="Home"
        description="Conectamos empresas con profesionales de Latinoamérica. Seleccionamos el perfil, gestionamos la contratación y acompañamos su desempeño."
        path="/"
        faqSchema={HOME_FAQ_SCHEMA}
        keywords="asistentes virtuales España, talento remoto para empresas, contratar asistente virtual barato, trabajo remoto en euros, outsourcing LATAM, profesionales remotos España, reducir costes de personal, SDR remoto, Global Talent Connections"
      />

      {/* HERO */}
      <section className="pt-[158px] relative">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal delay={0} y={0}>
            <div className="ed-caps !text-[11px] flex items-baseline flex-wrap gap-[26px] py-[14px] border-y border-navy/15 text-ink-soft">
              <span className="flex items-center gap-[9px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#2fae6b] animate-pulse" />
                {t('home_meta_activos')}
              </span>
              <span className="flex items-center">{t('home_meta_region')}</span>
              <span className="hidden md:flex items-center ml-auto">{t('home_meta_servicio')}</span>
            </div>
          </Reveal>

          <HeroTitle />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mt-14 items-end">
            <Reveal delay={0.7} y={26}>
              <p className="text-[clamp(16px,1.4vw,19px)] text-ink-soft max-w-[52ch] leading-relaxed [text-wrap:pretty]">
                {t('home_hero_sub')}
              </p>
            </Reveal>
            <Reveal delay={0.82} y={26}>
              <div className="flex gap-3.5 flex-wrap md:justify-end">
                <a className="ed-btn ed-btn-primary" href="#contacto">
                  {t('home_hero_cta_primary')} <ArrowRight className="w-4 h-4 arrow" />
                </a>
                <Link className="ed-btn ed-btn-outline" to="/calculadora-ahorro">
                  {t('home_hero_cta_secondary')}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.92} y={16}>
            <p className="ed-caps !text-[11px] text-ink-soft mt-8">{t('hero_precio')}</p>
          </Reveal>

          {/* Stats como fila-índice */}
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 mt-[88px] border-t border-navy/15">
            {[
              { value: 55, lblKey: 'home_stat_empresas', footKey: 'home_stat_empresas_foot' },
              { value: 93, lblKey: 'home_stat_profesionales', footKey: 'home_stat_profesionales_foot' },
              { value: 11, lblKey: 'home_stat_areas', footKey: 'home_stat_areas_foot' },
            ].map((stat, i) => (
              <RevealItem
                key={stat.lblKey}
                className={`relative py-[30px] md:pb-24 md:pt-[30px] ${
                  i > 0 ? 'md:border-l md:border-navy/15 md:pl-[34px]' : ''
                } ${i < 2 ? 'border-b md:border-b-0 border-navy/15' : ''}`}
              >
                <div className="font-display font-light text-[clamp(44px,5vw,72px)] tracking-[-0.02em] leading-none tabular-nums">
                  <CountUp to={stat.value} />
                </div>
                <div className="ed-caps !text-[11px] text-ink-soft mt-3">{t(stat.lblKey)}</div>
                <div className="ed-caps !text-[10px] text-sand mt-6 md:mt-0 md:absolute md:bottom-[26px] md:left-0 md:pl-[inherit]">
                  {t(stat.footKey)}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* MARQUEE DE CLIENTES */}
      <div className="ed-marquee mt-[110px]" aria-hidden="true">
        <div className="ed-marquee-track">
          {Array.from({ length: 6 }, (_, half) => MARQUEE_CLIENTS.map((client, i) => <span key={`${half}-${i}`}>{client}</span>))}
        </div>
      </div>

      {/* 01 EL SERVICIO */}
      <section id="garantias" className="py-[110px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">01</span>
              <span className="name">{t('home_sec_servicio')}</span>
              <span className="meta">{t('home_sec_servicio_meta')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 mb-[70px] max-w-[660px]">
            <h2 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(38px,5.6vw,84px)] [text-wrap:balance]">
              {t('home_servicio_h2_a')} <em className="italic text-gold-deep">{t('home_servicio_h2_b')}</em>
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 border-t border-navy/15">
            {GUARANTEES.map((g, i) => (
              <RevealItem
                key={g.tKey}
                className={`py-11 pb-[60px] md:pr-10 transition-colors duration-300 hover:bg-cream-2 ${
                  i > 0 ? 'md:border-l md:border-navy/15 md:pl-10' : ''
                } ${i < GUARANTEES.length - 1 ? 'border-b md:border-b-0 border-navy/15' : ''}`}
              >
                <div className="font-display font-light text-[clamp(52px,5.6vw,84px)] tracking-[-0.02em] leading-none text-navy tabular-nums">
                  0<span className="italic text-coral">{i + 1}</span>
                </div>
                <h3 className="font-headline font-bold text-[13px] tracking-[0.14em] uppercase mt-[26px] mb-3">{t(g.tKey)}</h3>
                <p className="text-[14.5px] text-ink-soft leading-relaxed">{t(g.dKey)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 02 PROCESO */}
      <section id="proceso" className="ed-on-dark py-[110px] bg-gradient-to-b from-navy to-navy-deep text-cream">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">02</span>
              <span className="name">{t('home_sec_proceso')}</span>
              <span className="meta">{t('home_sec_proceso_meta')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 mb-[70px] max-w-[920px]">
            <h2 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(38px,5.6vw,84px)] text-cream [text-wrap:balance]">
              {t('home_proceso_h2_a')} <em className="italic text-gold">{t('home_proceso_h2_b')}</em>
            </h2>
          </Reveal>
          <RevealGroup>
            {PROCESS_STEPS.map((step, i) => (
              <RevealItem key={step.tKey}>
                <a className="ed-prow" href="#contacto">
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display font-normal text-[clamp(22px,2.4vw,32px)] tracking-[-0.01em]">{t(step.tKey)}</h3>
                  <p className="desc text-[14.5px] text-cream/60 max-w-[46ch] leading-relaxed">{t(step.dKey)}</p>
                  <span className="arr">→</span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal>
            <div className="inline-block mt-14 bg-coral text-white rounded-xl px-[26px] py-4 -rotate-2 shadow-[0_20px_44px_-16px_rgba(255,90,57,0.55)]">
              <div className="font-display italic text-[34px] leading-none">High Tech</div>
              <div className="ed-caps !text-[9.5px] !tracking-[0.18em] mt-1.5 opacity-90">High Touch</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 ÁREAS */}
      <section id="areas" className="py-[110px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">03</span>
              <span className="name">{t('home_sec_areas')}</span>
              <span className="meta">{t('home_sec_areas_meta')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 mb-[70px] max-w-[660px]">
            <h2 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(38px,5.6vw,84px)] [text-wrap:balance]">
              {t('home_areas_h2_a')} <em className="italic text-gold-deep">{t('home_areas_h2_b')}</em>
            </h2>
          </Reveal>
          <RevealGroup>
            {AREAS.map((area, i) => (
              <RevealItem key={area.nameKey}>
                <a className="ed-area-row" href="#contacto">
                  <span className="font-display italic text-sm text-sand">/ {String(i + 1).padStart(2, '0')}</span>
                  <span className="name font-display font-normal text-[clamp(24px,3vw,40px)] tracking-[-0.01em]">{t(area.nameKey)}</span>
                  <span className="tag ed-caps !text-[11px] text-sand">{t(area.tagKey)}</span>
                  <span className="font-display text-[22px] text-coral">→</span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal>
            <p className="mt-[26px] text-xs text-sand">{t('home_areas_note')}</p>
          </Reveal>
        </div>
      </section>

      <EquipoSection />
      <TestimoniosSection />
      <ContactoSection />
    </>
  )
}

/* ——— 04 EQUIPO ———
   El roster vive en src/data/equipo.ts (fuente única; validado contra GAM).
   Misma gente que la página /nosotros, en el lenguaje editorial de la home. */
function MiembroCard({ m, lang }: { m: TeamMember; lang: 'es' | 'en' }) {
  return (
    <div className="group">
      <div className="aspect-[3/4] overflow-hidden bg-navy-deep">
        {m.foto ? (
          <img
            src={m.foto}
            alt={m.nombre}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full grid place-items-center font-display italic text-3xl text-cream/60">
            {m.nombre.split(' ').map(p => p[0]).slice(0, 2).join('')}
          </div>
        )}
      </div>
      <div className="mt-3 font-display text-[17px] leading-snug">{m.nombre}</div>
      <div className="ed-caps !text-[9.5px] text-sand mt-1.5">{lang === 'en' ? m.rolEn : m.rol}</div>
    </div>
  )
}

function EquipoSection() {
  const t = useT()
  const lang = useLang()

  return (
    <section id="equipo" className="py-[110px]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="ed-sec-tag ed-caps">
            <span className="idx">04</span>
            <span className="name">{t('home_sec_equipo')}</span>
            <span className="meta">{t('home_sec_equipo_meta')}</span>
          </div>
        </Reveal>
        <Reveal className="mt-11 mb-[70px] max-w-[700px]">
          <h2 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(38px,5.6vw,84px)] [text-wrap:balance]">
            {t('home_equipo_h2_a')} <em className="italic text-gold-deep">{t('home_equipo_h2_b')}</em>
          </h2>
        </Reveal>

        <Reveal>
          <div className="ed-caps !text-[11px] text-ink-soft pt-[14px] border-t border-navy/15">
            {t('home_equipo_dir')}
          </div>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 mt-8">
          {direccion.map(m => (
            <RevealItem key={m.id}>
              <MiembroCard m={m} lang={lang} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <div className="ed-caps !text-[11px] text-ink-soft mt-[84px] pt-[14px] border-t border-navy/15">
            {t('home_equipo_staff')}
          </div>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 mt-8">
          {filasOperativo.flat().map(m => (
            <RevealItem key={m.id}>
              <MiembroCard m={m} lang={lang} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ——— 05 TESTIMONIOS ———
   Las citas salen de src/data/resenasGoogle.ts (fuente única de reseñas). */
function TestimoniosSection() {
  const t = useT()
  const lang = useLang()
  const [videoAbierto, setVideoAbierto] = useState<(typeof VIDEOS_TESTIMONIO)[number] | null>(null)
  const smallReviews = ['Curro Sabán', 'Karelis Rojas Contreras']
    .map(autor => RESENAS_GOOGLE.find(r => r.autor === autor))
    .filter((r): r is (typeof RESENAS_GOOGLE)[number] => Boolean(r && r.texto))

  return (
    <section className="py-[110px] bg-cream-2">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="ed-sec-tag ed-caps">
            <span className="idx">05</span>
            <span className="name">{t('home_sec_testimonios')}</span>
            <span className="meta">{t('home_sec_testimonios_meta')}</span>
          </div>
        </Reveal>

        <Reveal>
          <p className="font-display font-light text-[clamp(30px,4.4vw,58px)] leading-[1.15] tracking-[-0.01em] max-w-[22ch] mt-11">
            {t('home_testi_big_1')} <em className="italic text-gold-deep whitespace-nowrap">{t('home_testi_big_em')}</em> {t('home_testi_big_2')}
          </p>
        </Reveal>

        <Reveal>
          <div className="flex items-center gap-4 mt-9">
            <div className="w-[46px] h-[46px] rounded-full grid place-items-center font-display italic text-lg bg-navy text-cream">S</div>
            <div>
              <div className="font-headline font-bold text-xs tracking-[0.12em] uppercase">Sergio Varo</div>
              <div className="text-xs text-sand">{t('home_testi_verificada')}</div>
            </div>
            <div className="text-gold-deep tracking-[3px] text-[15px] ml-auto">★★★★★</div>
          </div>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 mt-[84px] border-t border-navy/15">
          {smallReviews.map((review, i) => (
            <RevealItem
              key={review.autor}
              className={`py-9 md:pb-10 ${i === 0 ? 'md:border-r md:border-navy/15 md:pr-10' : 'md:pl-10'} ${
                i === 0 ? 'border-b md:border-b-0 border-navy/15' : ''
              }`}
            >
              <div className="text-gold-deep tracking-[3px] text-[15px]">★★★★★</div>
              <p className="font-display italic text-[19px] leading-[1.4] text-ink mt-3.5">
                "{review.texto ? review.texto[lang] : ''}"
              </p>
              <div className="mt-5 text-xs text-sand">
                <b className="text-ink-soft font-headline text-[11px] tracking-[0.1em] uppercase">{review.autor}</b> · {t('home_testi_en_google')}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <div className="mt-11 pt-[18px] border-t border-navy/15 flex gap-3.5 items-baseline text-xs text-sand flex-wrap">
            <b className="font-display text-xl text-ink font-normal">{RESUMEN_GOOGLE.rating.toFixed(1)}</b>
            <span className="text-gold-deep tracking-[3px]">★★★★★</span>
            <span>
              {RESUMEN_GOOGLE.total} {t('home_testi_google_line')}
            </span>
          </div>
        </Reveal>

        {/* Clientes en video */}
        <Reveal>
          <div className="ed-caps !text-[11px] text-ink-soft mt-[96px] pt-[14px] border-t border-navy/15">
            {t('home_videos_label')}
          </div>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {VIDEOS_TESTIMONIO.map(video => (
            <RevealItem key={video.src}>
              <button onClick={() => setVideoAbierto(video)} className="group block w-full text-left">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-navy">
                  <img
                    src={video.poster}
                    alt={video.nombre}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-navy/25 group-hover:bg-navy/10 transition-colors duration-300" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="w-12 h-12 rounded-full bg-coral text-white grid place-items-center shadow-[0_14px_30px_-10px_rgba(255,90,57,0.6)] transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                    </span>
                  </div>
                </div>
                <div className="mt-3 font-display text-[17px] leading-snug">{video.nombre}</div>
                <div className="ed-caps !text-[9.5px] text-sand mt-1.5">{t(video.cargoKey)}</div>
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <VideoTestimonioModal video={videoAbierto} onClose={() => setVideoAbierto(null)} />
    </section>
  )
}

function VideoTestimonioModal({ video, onClose }: { video: (typeof VIDEOS_TESTIMONIO)[number] | null; onClose: () => void }) {
  const t = useT()

  useEffect(() => {
    if (!video) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [video, onClose])

  if (!video) return null

  return (
    <div
      className="fixed inset-0 z-[60] bg-navy-deep/95 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-navy">
          <video src={video.src} controls autoPlay className="w-full h-full" />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-cream text-xl">{video.nombre}</p>
            <p className="ed-caps !text-[10px] text-coral mt-1.5">{t(video.cargoKey)}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={t('home_videos_cerrar')}
            className="text-cream/70 hover:text-coral transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ——— 06 CONTACTO ———
   Misma lógica de envío que la home anterior (Nexus + UTM/referrer/geo). */
function ContactoSection() {
  const t = useT()
  const CHECKS = ['home_check_1', 'home_check_2', 'home_check_3']
  const ROMANS = ['i.', 'ii.', 'iii.']

  return (
    <section id="contacto" className="ed-on-dark py-[110px] bg-gradient-to-b from-navy to-navy-deep text-cream">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="ed-sec-tag ed-caps">
            <span className="idx">06</span>
            <span className="name">{t('contacto_label')}</span>
            <span className="meta">{t('home_sec_contacto_meta')}</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 mt-11">
          <div>
            <Reveal>
              <h2 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(34px,4.2vw,62px)] text-cream [text-wrap:balance]">
                {t('home_contacto_h2_a')} <em className="italic text-gold">{t('home_contacto_h2_b')}</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[clamp(16px,1.4vw,19px)] text-cream/70 max-w-[52ch] leading-relaxed mt-[22px]">
                {t('home_contacto_lead')}
              </p>
            </Reveal>
            <RevealGroup className="mt-11">
              {CHECKS.map((key, i) => (
                <RevealItem key={key}>
                  <div className="flex gap-4 items-center text-cream/75 text-[15px] py-4 border-t border-cream/[0.18]">
                    <span className="font-display italic text-coral text-[15px] w-[26px]">{ROMANS[i]}</span>
                    {t(key)}
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal delay={0.15}>
            <FormularioLead formulario="home" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
