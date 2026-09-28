import { Fragment, useEffect, useRef, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useT, useLang } from '@/hooks/useT'
import { RESENAS_GOOGLE, RESUMEN_GOOGLE } from '@/data/resenasGoogle'
import { direccion, filasOperativo, type TeamMember } from '@/data/equipo'
import SEO from '@/components/shared/SEO'
import { CIFRAS } from '@/data/cifras'
import { CLIENTES } from '@/data/clientes'
import { PREGUNTAS_HOME, esquemaPreguntas } from '@/data/preguntasFrecuentes'
import { FormularioLead } from '@/components/shared/FormularioLead'

/* Portada de empresas — rediseño «A · Revista» (28-sep-2026).
   Diseño aprobado: lienzo «A · Revista», partes Main + A-portada-2. */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const SERVICIO = [
  { tKey: 'home_gar_1_t', dKey: 'home_gar_1_d', img: '/img/3d/seleccion.webp', escalon: '' },
  { tKey: 'home_gar_2_t', dKey: 'home_gar_2_d', img: '/img/3d/factura.webp', escalon: 'md:mt-10 lg:mt-[70px]' },
  { tKey: 'home_gar_3_t', dKey: 'home_gar_3_d', img: '/img/3d/garantia.webp', escalon: 'md:mt-20 lg:mt-[140px]' },
]

const PROCESO = [
  { tKey: 'home_proc_1_t', dKey: 'home_proc_1_d' },
  { tKey: 'home_proc_2_t', dKey: 'home_proc_2_d' },
  { tKey: 'home_proc_3_t', dKey: 'home_proc_3_d' },
  { tKey: 'home_proc_4_t', dKey: 'home_proc_4_d' },
]
/** El paso que va resaltado en coral (02 · Buscamos y evaluamos). */
const PASO_DESTACADO = 1

const AREAS = Array.from({ length: CIFRAS.areas }, (_, i) => ({ nameKey: `home_area_${i + 1}`, tagKey: `home_area_${i + 1}_tag` }))

const COSTE_ESPANA = ['home_coste_es_1', 'home_coste_es_2', 'home_coste_es_3', 'home_coste_es_4']
const COSTE_GTC = ['home_coste_gtc_1', 'home_coste_gtc_2', 'home_coste_gtc_3', 'home_coste_gtc_4']

/* Videos servidos desde public/videos/ (antes Cloudinary, cuenta deshabilitada) */
const VIDEOS_TESTIMONIO = [
  { nombre: 'Miguel Ángel Ramírez', cargoKey: 'testi_t1_cargo', src: '/videos/testimonio-1.mp4', poster: '/videos/testimonio-1.jpg' },
  { nombre: 'Arturo Sanz Santos', cargoKey: 'testi_t2_cargo', src: '/videos/testimonio-2.mp4', poster: '/videos/testimonio-2.jpg' },
  { nombre: 'Alex Andreu Peinado', cargoKey: 'testi_t3_cargo', src: '/videos/testimonio-3.mp4', poster: '/videos/testimonio-3.jpg' },
  { nombre: 'Curro Sabán', cargoKey: 'testi_t4_cargo', src: '/videos/testimonio-4.mp4', poster: '/videos/testimonio-4.jpg' },
]

/** Tamaño real de los objetos 3D (public/img/3d): reserva el lugar antes de cargar. */
const IMG_3D = { width: 1200, height: 655 }

/* Títulos de sección: misma escala en toda la portada. */
const H2 = 'ed-serif font-[320] text-navy leading-none tracking-[-0.02em] text-[clamp(40px,6.1vw,88px)] [text-wrap:balance]'

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

/* ——— Piezas comunes ——— */

function Wrap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-[72px] ${className}`}>{children}</div>
}

/** Etiqueta de sección: «01 · El servicio · Más que encontrar un perfil». */
function SecTag({ n, name, meta, dark = false, nameAs = 'span' }: { n: string; name: string; meta?: string; dark?: boolean; nameAs?: 'span' | 'h2' }) {
  const Name = nameAs
  return (
    <div className={`ed-label flex flex-wrap gap-x-3.5 gap-y-1 ${dark ? 'text-cream/70' : 'text-ink-soft'}`}>
      <span className={`font-semibold ${dark ? 'text-gold' : 'text-navy'}`}>{n}</span>
      <Name>{name}</Name>
      {meta && <span>· {meta}</span>}
    </div>
  )
}

/** Cabecera de sección del diseño A: etiqueta a la izquierda, título a la derecha. */
function SecHead({ tag, children }: { tag: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 lg:gap-14 items-end">
      <Reveal>{tag}</Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </div>
  )
}

function Img3D({ src, className }: { src: string; className: string }) {
  return <img src={src} alt="" {...IMG_3D} loading="lazy" decoding="async" className={className} />
}

function Estrellas({ size = 20 }: { size?: number }) {
  const t = useT()
  return (
    <span className="flex gap-1" role="img" aria-label={t('home_estrellas_aria')}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" className="fill-gold-deep" aria-hidden="true">
          <path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z" />
        </svg>
      ))}
    </span>
  )
}

/* ——— ENCABEZADO ——— */

/** Video a sangre. Con prefers-reduced-motion se queda quieto en el póster. */
function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    // `muted` como propiedad: el HTML prerenderizado no trae el atributo y sin
    // él el navegador no deja arrancar solo al video.
    video.muted = true
    if (reduced) {
      video.pause()
      return
    }
    video.play().catch(() => {})
  }, [reduced])

  return (
    <video
      ref={ref}
      className="ed-hero-video absolute inset-0 w-full h-full object-cover object-[0%_50%]"
      src="/videos/hero-gtc.mp4"
      poster="/videos/hero-gtc-poster.webp"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}

/* Reveal enmascarado por palabra para el H1. «respaldo» (la primera palabra de
   la segunda parte) va en cursiva con subrayado coral. */
function HeroTitle() {
  const t = useT()
  const reduced = useReducedMotion()
  const [destacada, ...resto] = t('home_hero_title_b').split(' ')
  const palabras = [
    ...t('home_hero_title_a').split(' ').map(w => ({ w, em: false })),
    { w: destacada, em: true },
    ...resto.map(w => ({ w, em: false })),
  ]
  return (
    <h1 className="ed-serif font-[330] text-navy leading-none tracking-[-0.025em] text-[clamp(40px,10.6vw,60px)] sm:text-[clamp(56px,8.4vw,80px)] lg:text-[clamp(60px,6.8vw,98px)] mt-10 lg:mt-[52px] [text-wrap:balance]">
      {palabras.map((p, i) => (
        <Fragment key={i}>
          <span className={`inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em] ${p.em ? 'pr-[0.06em]' : ''}`}>
            <motion.span
              className={`inline-block ${p.em ? 'ed-serif-it ed-subraya' : ''}`}
              initial={reduced ? false : { y: '112%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.15, ease: EASE, delay: 0.2 + i * 0.055 }}
            >
              {p.w}
            </motion.span>
          </span>{' '}
        </Fragment>
      ))}
    </h1>
  )
}

function Encabezado() {
  const t = useT()
  return (
    <section id="inicio" className="relative overflow-hidden border-b border-navy/15 lg:min-h-[880px]">
      <HeroVideo />
      <div className="absolute inset-0 ed-hero-velo-v" aria-hidden="true" />
      <div className="absolute inset-0 ed-hero-velo-h" aria-hidden="true" />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:pr-[72px] lg:pl-[38%] xl:pl-[44.4%] pt-[106px] sm:pt-[120px] lg:pt-[130px] pb-10 lg:pb-12 flex flex-col lg:min-h-[880px]">
        <Reveal delay={0} y={0}>
          <div className="ed-label flex flex-wrap items-center gap-x-7 gap-y-2 pb-3.5 border-b border-navy/15 text-ink-soft">
            <span className="flex items-center gap-[9px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#2fae6b] motion-safe:animate-pulse" aria-hidden="true" />
              {t('home_meta_activos')}
            </span>
            <span>{t('home_meta_region')}</span>
            <span>{t('home_meta_servicio')}</span>
          </div>
        </Reveal>

        <HeroTitle />

        <Reveal delay={0.7} y={26}>
          <p className="mt-7 lg:mt-9 max-w-[31em] text-[17px] sm:text-[19px] lg:text-[20px] leading-[1.55] text-ink-soft [text-wrap:pretty]">
            {t('home_hero_sub')}
          </p>
        </Reveal>

        <Reveal delay={0.82} y={26}>
          <div className="flex flex-col sm:flex-row gap-3.5 mt-8 lg:mt-[34px]">
            <a className="ed-pill ed-pill-navy" href="#contacto">
              {t('home_hero_cta_primary')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
            </a>
            <a className="ed-pill ed-pill-line" href="#coste">
              {t('home_hero_cta_secondary')}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.92} y={16} className="mt-10 lg:mt-auto lg:pt-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
            <p className="ed-label text-ink-soft">{t('hero_precio')}</p>
            <span className="ed-serif-it text-[20px] lg:text-2xl text-navy whitespace-nowrap">{t('home_high_tech')}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ——— CIFRAS ESCALONADAS ———
   Salen de src/data/cifras.ts y se escriben tal cual en el HTML (sin contador
   animado: los lectores y los bots se quedaban con un número a mitad de camino). */
function Cifras() {
  const t = useT()
  const lang = useLang()
  const filas = [
    { numero: CIFRAS.empresas.numero[lang], textoKey: 'home_cifra_empresas', escalon: '' },
    { numero: CIFRAS.profesionales.numero[lang], textoKey: 'home_cifra_profesionales', escalon: 'md:pl-[8%] lg:pl-[16.66%]' },
    { numero: String(CIFRAS.areas), textoKey: 'home_cifra_areas', escalon: 'md:pl-[16%] lg:pl-[33.33%]' },
    { numero: t('home_cifra_dias_num'), textoKey: 'home_cifra_dias', escalon: 'md:pl-[24%] lg:pl-[50%]' },
  ]
  return (
    <section aria-label={t('home_cifras_aria')} className="pt-16 lg:pt-[110px] pb-6 lg:pb-10">
      <Wrap>
        <RevealGroup className="border-t border-navy/20">
          {filas.map(f => (
            <RevealItem
              key={f.textoKey}
              className={`flex flex-wrap items-baseline gap-x-[25px] gap-y-1 py-4 lg:py-[22px] border-b border-navy/20 ${f.escalon}`}
            >
              <span className="ed-serif font-light text-navy whitespace-nowrap leading-[1.05] tracking-[-0.02em] text-[clamp(48px,6.1vw,88px)]">
                {f.numero}
              </span>
              <span className="text-ink-soft leading-[1.3] text-[17px] sm:text-[20px] lg:text-[25px] max-w-[22ch]">{t(f.textoKey)}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </Wrap>
    </section>
  )
}

/* ——— FRANJA DE CLIENTES ———
   Logos de src/data/clientes.ts. La segunda tanda solo existe para que el
   desplazamiento sea continuo: los lectores de pantalla no la leen. */
function Clientes() {
  const t = useT()
  const tanda = (copia: boolean) =>
    CLIENTES.map(c => (
      <li key={`${copia ? 'b' : 'a'}-${c.nombre}`} className={`shrink-0 pr-14 lg:pr-24 ${copia ? 'ed-logos-dup' : ''}`} aria-hidden={copia || undefined}>
        <img
          src={c.logo}
          alt={copia ? '' : c.nombre}
          width={c.ancho}
          height={c.alto}
          loading="lazy"
          decoding="async"
          className="h-9 lg:h-[50px] w-auto max-w-[140px] lg:max-w-[190px] object-contain"
        />
      </li>
    ))
  return (
    <section
      aria-label={t('home_clientes_aria')}
      className="ed-logos mt-10 lg:mt-[60px] border-y border-navy/10 py-7 lg:py-[34px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-0 overflow-hidden"
    >
      <span className="ed-label text-ink-soft shrink-0 px-5 sm:px-8 lg:pl-[72px] lg:pr-12 relative z-[1] bg-cream">{t('home_clientes_label')}</span>
      <div className="overflow-hidden grow">
        <ul className="ed-logos-track">
          {tanda(false)}
          {tanda(true)}
        </ul>
      </div>
    </section>
  )
}

/* ——— 01 EL SERVICIO ——— */
function Servicio() {
  const t = useT()
  return (
    <section id="garantias" className="pt-20 lg:pt-[130px] pb-10 lg:pb-[60px]">
      <Wrap>
        <SecHead tag={<SecTag n="01" name={t('home_sec_servicio')} meta={t('home_sec_servicio_meta')} />}>
          <h2 className={H2}>
            {t('home_servicio_h2_a')} <span className="ed-serif-it">{t('home_servicio_h2_b')}</span>
          </h2>
        </SecHead>
        <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 lg:gap-9 mt-12 lg:mt-20">
          {SERVICIO.map((s, i) => (
            <RevealItem key={s.tKey} className={s.escalon}>
              <article className="flex flex-col gap-[18px] lg:gap-[22px]">
                <Img3D src={s.img} className="ed-3d w-full h-[200px] sm:h-[240px] lg:h-[260px] object-cover rounded-3xl bg-cream-2" />
                <div className="flex gap-4 items-baseline">
                  <span className="ed-serif text-lg text-ink-soft">0{i + 1}/</span>
                  <h3 className="ed-serif font-[330] text-navy leading-[1.1] tracking-[-0.01em] text-[clamp(28px,2.8vw,40px)]">{t(s.tKey)}</h3>
                </div>
                <p className="text-[16px] lg:text-[17px] leading-[1.6] text-ink-soft max-w-[24em]">{t(s.dKey)}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Wrap>
    </section>
  )
}

/* ——— 02 PROCESO ——— */
function Proceso() {
  const t = useT()
  return (
    <section id="proceso" className="mt-16 lg:mt-20 bg-navy text-cream pt-20 lg:pt-[120px] pb-24 lg:pb-[150px]">
      <Wrap>
        <SecHead tag={<SecTag dark n="02" name={t('home_sec_proceso')} meta={t('home_sec_proceso_meta')} />}>
          <h2 className="ed-serif font-light text-cream leading-[1.02] tracking-[-0.02em] text-[clamp(38px,5.6vw,80px)] [text-wrap:balance]">
            {t('home_proceso_h2_a')} <span className="ed-serif-it text-gold">{t('home_proceso_h2_b')}</span>
          </h2>
        </SecHead>
        <RevealGroup className="mt-14 lg:mt-[84px] border-t border-cream/20">
          {PROCESO.map((paso, i) => {
            const destacado = i === PASO_DESTACADO
            const titulo = t(paso.tKey)
            const corte = titulo.lastIndexOf(' ')
            return (
              <RevealItem
                key={paso.tKey}
                className={`grid grid-cols-[36px_minmax(0,1fr)] lg:grid-cols-[72px_minmax(0,1fr)_320px] items-center gap-x-3 lg:gap-x-6 gap-y-2 ${
                  destacado
                    ? 'bg-coral text-navy rounded-md -mx-4 sm:-mx-5 lg:-mx-7 px-4 sm:px-5 lg:px-7 py-5 lg:py-6'
                    : 'py-4 lg:py-3.5 border-b border-cream/20'
                }`}
              >
                <span className={`ed-serif text-base lg:text-xl ${destacado ? 'text-navy' : 'text-cream/60'}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3
                  className={`ed-serif tracking-[-0.03em] text-[clamp(34px,6.4vw,96px)] ${
                    destacado ? 'font-[360] leading-[1.05]' : 'font-[280] leading-[1.15] text-cream/50'
                  }`}
                >
                  {destacado && corte > 0 ? (
                    <>
                      {titulo.slice(0, corte)} <span className="ed-serif-it">{titulo.slice(corte + 1)}</span>
                    </>
                  ) : (
                    titulo
                  )}
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

/* ——— 03 ÁREAS ——— */
function Areas() {
  const t = useT()
  const celda = 'flex flex-col justify-between w-full no-underline border-r border-b min-h-[150px] lg:min-h-[200px] px-6 lg:px-[30px] pt-7 lg:pt-8 pb-6 lg:pb-[30px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:[outline-offset:-4px]'
  return (
    <section id="areas" className="pt-20 lg:pt-[130px] pb-10">
      <Wrap>
        <SecHead tag={<SecTag n="03" name={t('home_sec_areas')} meta={t('home_sec_areas_meta')} />}>
          <h2 className={H2}>
            {t('home_areas_h2_a')} <span className="ed-serif-it">{t('home_areas_h2_b')}</span>
          </h2>
        </SecHead>
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-12 lg:mt-[72px] border-t border-l border-navy/20">
          {AREAS.map((area, i) => (
            <RevealItem key={area.nameKey} className="flex">
              <a href="#contacto" className={`${celda} gap-8 lg:gap-11 border-navy/20 text-navy hover:bg-cream-2 hover:text-navy focus-visible:outline-navy`}>
                <span className="ed-label text-ink-soft">/ {String(i + 1).padStart(2, '0')}</span>
                <span className="flex flex-col gap-2">
                  <span className="ed-serif font-[360] text-[26px] lg:text-[32px] leading-[1.1]">{t(area.nameKey)}</span>
                  <span className="text-[15px] lg:text-base text-ink-soft">{t(area.tagKey)}</span>
                </span>
              </a>
            </RevealItem>
          ))}
          <RevealItem className="flex">
            <a href="#contacto" className={`${celda} gap-7 lg:gap-[30px] bg-navy border-navy text-cream hover:bg-navy-deep hover:text-cream focus-visible:outline-gold`}>
              <span className="ed-serif font-[340] text-[24px] lg:text-[28px] leading-[1.15]">{t('home_areas_otro_t')}</span>
              <span className="flex justify-between items-end gap-4">
                <span className="text-[15px] leading-[1.45] text-cream/80">{t('home_areas_otro_d')}</span>
                <ArrowRight className="w-[26px] h-[26px] text-gold shrink-0" strokeWidth={1.8} aria-hidden="true" />
              </span>
            </a>
          </RevealItem>
        </RevealGroup>
      </Wrap>
    </section>
  )
}

/* ——— COSTE REAL ———
   Los mismos números y listas que la landing /asistente-virtual. */
function CosteReal() {
  const t = useT()
  return (
    <section id="coste" className="pt-20 lg:pt-[130px] pb-10">
      <Wrap>
        <Reveal className="bg-cream-2 rounded-[28px] lg:rounded-[36px] px-5 py-10 sm:p-10 lg:px-[72px] lg:py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center overflow-hidden">
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="ed-label text-ink-soft">{t('home_coste_label')}</div>
            <h2 className="ed-serif font-[320] text-navy leading-[1.05] tracking-[-0.02em] text-[clamp(34px,4.5vw,64px)] [text-wrap:balance]">
              {t('home_coste_h2_a')} <span className="ed-serif-it">{t('home_coste_h2_b')}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              <div className="bg-cream rounded-[22px] p-6 lg:p-7 flex flex-col gap-3.5">
                <span className="ed-label text-ink-soft">{t('home_coste_es_label')}</span>
                <span className="ed-serif font-[340] text-navy leading-none text-[clamp(38px,3.2vw,48px)]">
                  <span className="whitespace-nowrap">{t('home_coste_es_precio')}</span> <span className="text-lg lg:text-xl text-ink-soft">{t('home_coste_mes')}</span>
                </span>
                <ul className="list-disc pl-[18px] flex flex-col gap-1.5 text-[15px] leading-[1.45] text-ink-soft">
                  {COSTE_ESPANA.map(k => <li key={k}>{t(k)}</li>)}
                </ul>
              </div>
              <div className="bg-navy text-cream rounded-[22px] p-6 lg:p-7 flex flex-col gap-3.5">
                <span className="ed-label text-cream/70">{t('calc_r_gtc')}</span>
                <span className="ed-serif font-[340] leading-none text-[clamp(38px,3.2vw,48px)]">
                  <span className="whitespace-nowrap">{t('home_coste_gtc_precio')}</span> <span className="text-lg lg:text-xl text-cream/70">{t('home_coste_mes')}</span>
                </span>
                <ul className="list-disc pl-[18px] flex flex-col gap-1.5 text-[15px] leading-[1.45] text-cream/80">
                  {COSTE_GTC.map(k => <li key={k}>{t(k)}</li>)}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Img3D src="/img/3d/ahorro.webp" className="ed-3d w-full h-[200px] sm:h-[260px] lg:h-[340px] object-cover" />
            <span className="ed-serif font-[280] text-navy leading-[0.9] tracking-[-0.04em] text-[clamp(96px,13.9vw,200px)]">{t('home_coste_pct')}</span>
            <span className="text-[17px] lg:text-lg text-ink-soft max-w-[26em]">{t('home_coste_pct_d')}</span>
            <Link
              to="/calculadora-ahorro"
              className="mt-2 inline-flex items-center gap-2 py-3 font-label font-semibold text-base text-navy underline decoration-coral decoration-2 underline-offset-[6px] hover:text-navy-deep"
            >
              {t('home_coste_cta')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ——— 04 EQUIPO ———
   El roster vive en src/data/equipo.ts (fuente única; validado contra GAM). */
function Foto({ m, grande }: { m: TeamMember; grande: boolean }) {
  const forma = `w-full aspect-[3/4] ${grande ? 'rounded-[18px] lg:rounded-[22px]' : 'rounded-2xl'}`
  if (!m.foto) {
    return (
      <div className={`${forma} bg-navy-deep grid place-items-center ed-serif-it text-3xl text-cream/60`} aria-hidden="true">
        {m.nombre.split(' ').map(p => p[0]).slice(0, 2).join('')}
      </div>
    )
  }
  return <img src={m.foto} alt={m.nombre} loading="lazy" decoding="async" className={`${forma} object-cover object-[50%_15%] bg-cream-2`} />
}

function Equipo() {
  const t = useT()
  const lang = useLang()
  const rol = (m: TeamMember) => (lang === 'en' ? m.rolEn : m.rol)
  return (
    <section id="equipo" className="pt-20 lg:pt-[130px] pb-10">
      <Wrap>
        <SecHead tag={<SecTag n="04" name={t('home_sec_equipo')} meta={t('home_sec_equipo_meta')} />}>
          <h2 className={H2}>
            {t('home_equipo_h2_a')} <span className="ed-serif-it">{t('home_equipo_h2_b')}</span>
          </h2>
        </SecHead>

        <Reveal>
          <h3 className="ed-label text-ink-soft mt-14 lg:mt-[70px]">{t('home_equipo_dir')}</h3>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-[18px]">
          {direccion.map(m => (
            <RevealItem key={m.id}>
              <figure className="flex flex-col gap-3.5">
                <Foto m={m} grande />
                <figcaption className="flex flex-col gap-0.5">
                  <span className="ed-serif text-navy leading-tight text-[20px] sm:text-[24px] lg:text-[28px]">{m.nombre}</span>
                  <span className="ed-label text-ink-soft">{rol(m)}</span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <h3 className="ed-label text-ink-soft mt-14">{t('home_equipo_staff')}</h3>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-[18px]">
          {filasOperativo.flat().map(m => (
            <RevealItem key={m.id}>
              <figure className="flex flex-col gap-2.5">
                <Foto m={m} grande={false} />
                <figcaption className="flex flex-col gap-0.5">
                  <span className="ed-serif text-navy leading-tight text-[17px] lg:text-[19px]">{m.nombre}</span>
                  <span className="text-[13px] text-ink-soft">{rol(m)}</span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </Wrap>
    </section>
  )
}

/* ——— 05 TESTIMONIOS ———
   Las citas salen de src/data/resenasGoogle.ts (fuente única de reseñas),
   copiadas tal cual. */
function Testimonios() {
  const t = useT()
  const lang = useLang()
  const resena = (autor: string) => RESENAS_GOOGLE.find(r => r.autor === autor && r.texto)
  const principal = resena('Sergio Varo')
  const otras = ['Curro Sabán', 'Karelis Rojas Contreras'].map(resena).filter((r): r is (typeof RESENAS_GOOGLE)[number] => Boolean(r))
  const nota = RESUMEN_GOOGLE.rating.toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <section id="testimonios" className="mt-16 lg:mt-20 bg-cream-2 pt-20 lg:pt-[120px] pb-20 lg:pb-[110px]">
      <Wrap>
        <Reveal>
          <SecTag n="05" name={t('home_sec_testimonios')} meta={t('home_sec_testimonios_meta')} nameAs="h2" />
        </Reveal>

        {principal?.texto && (
          <Reveal>
            <figure className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 lg:gap-16 items-end">
              <blockquote className="ed-serif-it text-navy leading-[1.15] tracking-[-0.01em] text-[clamp(28px,4vw,58px)] [text-wrap:pretty]">
                “{principal.texto[lang]}”
              </blockquote>
              <figcaption className="flex flex-col gap-2.5 lg:pb-2.5">
                <Estrellas />
                <span className="ed-serif text-navy text-[24px] lg:text-[26px]">{principal.autor}</span>
                <span className="ed-label text-ink-soft">{t('home_testi_verificada')}</span>
                <span className="mt-4 text-[15px] text-ink-soft">
                  <strong className="ed-serif font-normal text-navy text-[22px]">{nota}</strong> · {RESUMEN_GOOGLE.total} {t('home_testi_google_line')}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        )}

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mt-12 lg:mt-16">
          {otras.map(r => (
            <RevealItem key={r.autor} className="flex">
              <figure className="w-full bg-cream rounded-[22px] p-6 lg:p-8 flex flex-col gap-4">
                <blockquote className="ed-serif text-navy leading-[1.45] text-[19px] lg:text-[22px]">“{r.texto?.[lang]}”</blockquote>
                <figcaption className="text-sm text-ink-soft">
                  <strong className="text-navy">{r.autor}</strong> · {t('home_testi_en_google')}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <h3 className="mt-16 lg:mt-20 ed-serif font-[320] text-navy leading-[1.1] text-[clamp(28px,3vw,44px)] [text-wrap:balance]">
            {t('home_videos_h3_a')} <span className="ed-serif-it">{t('home_videos_h3_b')}</span>
          </h3>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 lg:gap-y-7 mt-8">
          {VIDEOS_TESTIMONIO.map(v => (
            <RevealItem key={v.src}>
              <figure className="flex flex-col gap-3.5">
                <video
                  controls
                  preload="none"
                  playsInline
                  poster={v.poster}
                  src={v.src}
                  width={1280}
                  height={720}
                  aria-label={`${t('home_video_de')} ${v.nombre}`}
                  className="w-full h-auto aspect-video object-cover rounded-[18px] lg:rounded-[22px] bg-navy-deep"
                />
                <figcaption className="flex flex-col gap-1">
                  <span className="ed-serif text-navy text-[20px] lg:text-[22px]">{v.nombre}</span>
                  <span className="text-sm text-ink-soft">{t(v.cargoKey)}</span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </Wrap>
    </section>
  )
}

/* ——— 06 PREGUNTAS FRECUENTES ———
   Salen de src/data/preguntasFrecuentes.ts, igual que los datos estructurados
   de esta página: Google y las IA leen exactamente lo que se ve. */
function Preguntas() {
  const t = useT()
  const lang = useLang()
  return (
    <section id="preguntas" className="pt-20 lg:pt-[130px] pb-16 lg:pb-[60px]">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-10 lg:gap-20">
        <Reveal className="flex flex-col gap-5 lg:gap-[22px]">
          <SecTag n="06" name={t('home_sec_preguntas')} />
          <h2 className="ed-serif font-[320] text-navy leading-none tracking-[-0.02em] text-[clamp(40px,5vw,72px)]">
            {t('home_preguntas_h2_a')} <span className="ed-serif-it">{t('home_preguntas_h2_b')}</span>
          </h2>
          <Img3D src="/img/3d/seguridad.webp" className="ed-3d hidden lg:block w-full h-[300px] object-cover mt-5" />
        </Reveal>
        <div className="ed-faq border-t border-navy/20">
          {PREGUNTAS_HOME.map(({ pregunta, respuesta }, i) => (
            <details key={pregunta.es} open={i === 0} className="group border-b border-navy/20 py-5 lg:py-[26px]">
              <summary className="ed-serif text-navy list-none cursor-pointer flex justify-between items-start gap-6 min-h-[44px] leading-snug text-[20px] sm:text-[24px] lg:text-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">
                {pregunta[lang]}
                <span aria-hidden="true" className="font-label font-light shrink-0">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="mt-3.5 text-[16px] lg:text-[17px] leading-[1.6] text-ink-soft max-w-[40em]">{respuesta[lang]}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ——— 07 CONTACTO ———
   El formulario es el de siempre (FormularioLead: envío a Nexus + UTM/referrer/
   geo + tracking); acá solo cambia el contenedor. */
function Contacto() {
  const t = useT()
  const PROMESAS = ['home_check_1', 'home_check_2', 'home_check_3']
  const ROMANOS = ['i.', 'ii.', 'iii.']

  return (
    <section id="contacto" className="mt-16 lg:mt-20 bg-navy text-cream py-20 lg:py-[120px] overflow-hidden">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 lg:gap-20">
        <Reveal className="flex flex-col gap-6 lg:gap-7">
          <SecTag dark n="07" name={t('contacto_label')} meta={t('home_sec_contacto_meta')} />
          <h2 className="ed-serif font-light text-cream leading-[1.02] tracking-[-0.02em] text-[clamp(38px,5.4vw,78px)] [text-wrap:balance]">
            {t('home_contacto_h2_a')} <span className="ed-serif-it text-gold">{t('home_contacto_h2_b')}</span>
          </h2>
          <p className="text-[17px] lg:text-[19px] leading-[1.6] text-cream/80 max-w-[28em]">{t('home_contacto_lead')}</p>
          <ol className="mt-3 flex flex-col gap-3.5 text-[16px] lg:text-[17px]">
            {PROMESAS.map((key, i) => (
              <li key={key} className="flex gap-4">
                <span className="ed-serif-it text-gold w-7 shrink-0">{ROMANOS[i]}</span>
                {t(key)}
              </li>
            ))}
          </ol>
          <Img3D src="/img/3d/conexion-navy.webp" className="ed-3d-navy hidden lg:block w-full h-[300px] object-cover rounded-3xl mt-5" />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="bg-cream text-ink rounded-[24px] lg:rounded-[28px] p-5 sm:p-8 lg:p-11">
            <FormularioLead formulario="home" tono="claro" />
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

export default function HomePage() {
  const lang = useLang()
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
    <div className="bg-cream text-ink">
      <SEO
        title="Home"
        description="Conectamos empresas con profesionales de Latinoamérica. Seleccionamos el perfil, gestionamos la contratación y acompañamos su desempeño."
        path="/"
        keywords="asistentes virtuales España, talento remoto para empresas, contratar asistente virtual barato, outsourcing LATAM, profesionales remotos España, reducir costes de personal, SDR remoto, Global Talent Connections"
        faqSchema={esquemaPreguntas(PREGUNTAS_HOME, lang)}
      />

      <Encabezado />
      <Cifras />
      <Clientes />
      <Servicio />
      <Proceso />
      <Areas />
      <CosteReal />
      <Equipo />
      <Testimonios />
      <Preguntas />
      <Contacto />
    </div>
  )
}
