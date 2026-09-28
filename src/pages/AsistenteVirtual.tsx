import { Fragment, useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import SEO from '@/components/shared/SEO'
import { FormularioLead } from '@/components/shared/FormularioLead'
import { EASE, Reveal } from '@/components/shared/EditorialReveal'
import { TELEFONO, TEL_LINK, WHATSAPP_LINK } from '@/data/contacto'
import { trackContacto } from '@/lib/tracking'
import { RESENAS_GOOGLE, RESUMEN_GOOGLE } from '@/data/resenasGoogle'
import { CIFRAS } from '@/data/cifras'
import { PREGUNTAS_LANDING, esquemaPreguntas } from '@/data/preguntasFrecuentes'
import logoDark from '@/assets/logos/logo-gtc-negro.png'

// Landing para tráfico de pago (Google Ads «asistente virtual»). Va FUERA del
// Layout a propósito: sin menú ni enlaces a blog/empleos, para que quien llega
// de un anuncio solo pueda hacer una cosa. Copy solo en español: los anuncios
// son para España y aquí no hay selector de idioma.
//
// Diseño «A · Revista» (28-sep-2026), lienzo A-anuncio-movil. El escritorio no
// tiene maqueta propia: usa el mismo lenguaje que la portada (src/pages/Index.tsx).

const AREAS = [
  ['Administración', 'Operaciones y soporte'],
  ['Finanzas y contabilidad', 'Control y gestión'],
  ['Marketing digital', 'Campañas y contenido'],
  ['Atención al cliente', 'Soporte y seguimiento'],
  ['Ventas', 'Prospección y seguimiento'],
  ['Automatización e IA', 'Procesos y tecnología'],
]

const PASOS = [
  ['Definimos el rol contigo', 'Funciones, herramientas, horario y presupuesto. Una llamada de 20 minutos.'],
  ['Buscamos y evaluamos', 'RRHH entrevista y valida candidatos con pruebas técnicas, humanas y de encaje.'],
  ['Eliges y empieza en 5 días hábiles', 'Recibes perfiles con evidencia. Tú decides. GTC formaliza la incorporación.'],
]
const ROMANOS = ['i.', 'ii.', 'iii.']

const COSTE_ESPANA = ['Salario bruto', 'Seguridad Social a cargo de la empresa (~33 %)', 'Puesto de trabajo, equipo, formación', 'Selección, bajas, sustituciones, despido']
const COSTE_GTC = ['Profesional dedicado, en tu horario', 'Contratación y nómina las gestiona GTC', 'Seguimiento de Calidad incluido', 'Reemplazo si no encaja, sin coste']

// Las preguntas salen de src/data/preguntasFrecuentes.ts (las mismas que la home).
const FAQ = PREGUNTAS_LANDING.map(({ pregunta, respuesta }) => [pregunta.es, respuesta.es] as const)
const FAQ_SCHEMA = esquemaPreguntas(PREGUNTAS_LANDING, 'es')

const RESENAS = ['Sergio Varo', 'Curro Sabán']
  .map(autor => RESENAS_GOOGLE.find(r => r.autor === autor))
  .filter((r): r is NonNullable<typeof r> => !!r && !!r.texto)

// Mismas cifras que la home: salen de src/data/cifras.ts. Las reseñas, del
// mismo resumen de Google que usa la home.
const CIFRAS_ENCABEZADO = [
  [CIFRAS.empresas.numero.es, CIFRAS.empresas.sustantivo.es],
  [CIFRAS.profesionales.numero.es, CIFRAS.profesionales.sustantivo.es],
  [`${RESUMEN_GOOGLE.rating.toFixed(1).replace('.', ',')} ★`, `${RESUMEN_GOOGLE.total} reseñas en Google`],
]

/** Tamaño real de los objetos 3D (public/img/3d): reserva el lugar antes de cargar. */
const IMG_3D = { width: 1200, height: 655 }

const H2 = 'ed-serif font-[330] text-navy leading-[1.08] tracking-[-0.015em] text-[clamp(30px,8.7vw,36px)] sm:text-[44px] lg:text-[clamp(44px,4.2vw,60px)] [text-wrap:balance]'

/* ——— Piezas comunes (mismo lenguaje que la portada) ——— */

function Wrap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-[72px] ${className}`}>{children}</div>
}

/** Etiqueta de sección: «01 · Lo que cuesta de verdad». */
function SecTag({ n, name, nameAs = 'span' }: { n: string; name: string; nameAs?: 'span' | 'h2' }) {
  const Name = nameAs
  return (
    <div className="ed-label flex flex-wrap gap-x-3 gap-y-1 text-ink-soft">
      <span className="font-semibold text-navy">{n}</span>
      <Name>{name}</Name>
    </div>
  )
}

/** Etiqueta arriba en móvil; a la izquierda del título en escritorio. */
function SecHead({ tag, children }: { tag: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-[18px] lg:gap-14 items-end">
      <Reveal>{tag}</Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </div>
  )
}

function Img3D({ src, className }: { src: string; className: string }) {
  return <img src={src} alt="" {...IMG_3D} loading="lazy" decoding="async" className={className} />
}

function Estrellas({ size = 16 }: { size?: number }) {
  return (
    <span className="flex gap-1" role="img" aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" className="fill-gold-deep" aria-hidden="true">
          <path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z" />
        </svg>
      ))}
    </span>
  )
}

/* ——— CABECERA ——— */

function Cabecera() {
  return (
    <header className="border-b border-navy/15">
      <Wrap className="h-[72px] flex items-center justify-between gap-3">
        <Link to="/" aria-label="Global Talent Connections" className="shrink-0 inline-flex items-center min-h-[44px]">
          <img src={logoDark} alt="Global Talent Connections" width={480} height={131} className="h-[30px] w-auto" />
        </Link>
        {/* Un solo número para llamar y para WhatsApp: el círculo llama, la píldora abre WhatsApp. */}
        <div className="flex items-center gap-2">
          <a
            href={TEL_LINK}
            aria-label={`Llamar al ${TELEFONO}`}
            onClick={() => trackContacto('telefono', 'asistente-virtual-cabecera')}
            className="w-11 h-11 rounded-full border border-navy/25 grid place-items-center text-navy hover:bg-cream-2 hover:text-navy transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <Phone className="w-[18px] h-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Escribir por WhatsApp al ${TELEFONO}`}
            onClick={() => trackContacto('whatsapp', 'asistente-virtual-cabecera')}
            className="h-11 px-4 rounded-full bg-navy text-cream inline-flex items-center gap-2 font-label font-semibold text-sm hover:bg-navy-deep hover:text-cream transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
            WhatsApp
            <span className="hidden md:inline font-normal text-cream/80">· {TELEFONO}</span>
          </a>
        </div>
      </Wrap>
    </header>
  )
}

/* ——— ENCABEZADO ——— */

/** Franja de video. Sin autoplay en el HTML: arranca por JS y, con
 *  prefers-reduced-motion, se queda quieto en el póster. */
function VideoEncabezado() {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    if (reduced) {
      video.pause()
      return
    }
    video.play().catch(() => {})
  }, [reduced])

  return (
    <div className="relative overflow-hidden h-[190px] sm:h-[240px] lg:h-[200px]" aria-hidden="true">
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover object-[30%_50%]"
        src="/videos/hero-gtc.mp4"
        poster="/videos/hero-gtc-poster.webp"
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        tabIndex={-1}
      />
      <div className="absolute inset-x-0 bottom-0 h-[70px] bg-gradient-to-b from-cream/0 to-cream" />
    </div>
  )
}

/* Reveal enmascarado por palabra, como el titular de la portada. «1.200 €» va
   con espacio duro para que el símbolo no quede solo en otra línea. */
const TITULO_A = 'Un profesional remoto dedicado,'
const TITULO_B = 'desde 1.200 € al mes.'

function Titular() {
  const reduced = useReducedMotion()
  const palabras = [
    ...TITULO_A.split(' ').map(w => ({ w, em: false })),
    ...TITULO_B.split(' ').map(w => ({ w, em: true })),
  ]
  return (
    <h1 className="ed-serif font-[340] text-navy leading-[1.02] tracking-[-0.02em] text-[clamp(38px,11.2vw,46px)] sm:text-[58px] lg:text-[clamp(56px,5.2vw,78px)] [text-wrap:balance]">
      {palabras.map((p, i) => (
        <Fragment key={i}>
          <span className={`inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em] ${p.em ? 'pr-[0.05em]' : ''}`}>
            <motion.span
              className={`inline-block ${p.em ? 'ed-serif-it' : ''}`}
              initial={reduced ? false : { y: '112%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.15, ease: EASE, delay: 0.15 + i * 0.055 }}
            >
              {p.w}
            </motion.span>
          </span>{' '}
        </Fragment>
      ))}
    </h1>
  )
}

/** Tarjeta navy con el precio y el formulario. El formulario es el de siempre
 *  (FormularioLead, misma configuración: envío a Nexus + UTM/referrer/geo +
 *  conversiones); acá solo cambian el contenedor y el estilo (.ed-form-anuncio). */
function TarjetaFormulario() {
  return (
    <div id="solicitar" className="scroll-mt-4 bg-navy text-cream rounded-[26px] lg:rounded-[28px] px-5 py-[26px] sm:p-8 lg:p-10 flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="ed-serif font-[330] leading-none whitespace-nowrap text-[40px] lg:text-[48px]">
          1.200 €<span className="text-base text-cream/70"> /mes</span>
        </span>
        <span className="ed-label text-gold">Una factura</span>
      </div>
      <p className="text-[14px] lg:text-[15px] leading-[1.5] text-cream/80">Una factura mensual. Contratación, nómina y seguimiento incluidos.</p>
      <div className="ed-form-anuncio mt-1.5">
        <FormularioLead formulario="asistente-virtual" cta="Quiero recibir perfiles" contexto="Landing asistente virtual" modoCaptacion="express" />
      </div>
    </div>
  )
}

function Encabezado() {
  return (
    <section aria-label="Asistente virtual para empresas">
      <VideoEncabezado />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-[72px] grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-[26px] lg:gap-16 items-start">
        <div className="px-2 sm:px-0 pt-1.5 lg:pt-2 flex flex-col gap-[18px] lg:gap-6">
          <Reveal delay={0} y={0}>
            <p className="ed-label text-ink-soft">Asistentes virtuales para empresas · España</p>
          </Reveal>
          <Titular />
          <Reveal delay={0.6} y={20}>
            <p className="text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.55] text-ink-soft max-w-[34em] [text-wrap:pretty]">
              Seleccionado, evaluado y en tu equipo en 5 días hábiles. Administración, finanzas, marketing o automatización con IA. Sin permanencia. Si no encaja, lo reemplazamos.
            </p>
          </Reveal>
          <Reveal delay={0.7} y={20}>
            <div className="grid grid-cols-3 border-y border-navy/15">
              {CIFRAS_ENCABEZADO.map(([v, l], i) => (
                <div key={l} className={`py-3.5 lg:py-5 flex flex-col gap-1 min-w-0 ${i > 0 ? 'pl-3 sm:pl-5 border-l border-navy/15' : 'pr-2'}`}>
                  <span className="ed-serif text-navy leading-[1.1] text-[clamp(18px,5.6vw,22px)] sm:text-[26px] lg:text-[30px]">{v}</span>
                  <span className="text-[12px] sm:text-[13px] lg:text-sm leading-snug text-ink-soft">{l}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <TarjetaFormulario />
      </div>
    </section>
  )
}

/* ——— 01 LO QUE CUESTA ——— */

function Coste() {
  return (
    <section id="coste" className="pt-16 lg:pt-[110px]">
      <Wrap>
        <SecHead tag={<SecTag n="01" name="Lo que cuesta de verdad" />}>
          <h2 className={H2}>
            Un empleado en España cuesta más de <span className="ed-serif-it">30.000 € al año.</span>
          </h2>
        </SecHead>
        <Reveal className="mt-[18px] lg:mt-14 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 md:gap-6 items-center">
          <div className="h-full bg-cream-2 rounded-[20px] p-5 lg:p-8 flex flex-col gap-2.5">
            <span className="ed-label text-ink-soft">Administrativo en plantilla · España</span>
            <span className="ed-serif text-navy leading-none text-[34px] lg:text-[44px]">
              <span className="whitespace-nowrap">≈ 2.500 €</span> <span className="text-[15px] lg:text-lg text-ink-soft">/mes</span>
            </span>
            <ul className="list-disc pl-[18px] flex flex-col gap-1 text-[14px] lg:text-[15px] leading-[1.45] text-ink-soft">
              {COSTE_ESPANA.map(x => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <span className="ed-serif-it text-center text-lg lg:text-2xl text-ink-soft">frente a</span>
          <div className="h-full bg-navy text-cream rounded-[20px] p-5 lg:p-8 flex flex-col gap-2.5">
            <span className="ed-label text-cream/70">Mismo perfil con GTC</span>
            <span className="ed-serif leading-none text-[34px] lg:text-[44px]">
              <span className="whitespace-nowrap">1.200 €</span> <span className="text-[15px] lg:text-lg text-cream/70">/mes</span>
            </span>
            <ul className="list-disc pl-[18px] flex flex-col gap-1 text-[14px] lg:text-[15px] leading-[1.45] text-cream/80">
              {COSTE_GTC.map(x => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </Reveal>
        <Reveal className="mt-6 lg:mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8">
          <div className="flex items-center gap-1.5 sm:gap-4">
            <Img3D src="/img/3d/ahorro.webp" className="ed-3d shrink-0 w-[150px] h-[150px] lg:w-[220px] lg:h-[190px] object-cover" />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="ed-serif font-light text-navy leading-[0.9] tracking-[-0.03em] whitespace-nowrap text-[clamp(56px,17vw,72px)] lg:text-[112px]">52 %</span>
              <span className="text-[14px] lg:text-[17px] leading-[1.4] text-ink-soft max-w-[22em]">menos de coste al año, sin renunciar a la calidad.</span>
            </div>
          </div>
          <Link
            to="/calculadora-ahorro"
            className="self-start sm:self-center shrink-0 inline-flex items-center min-h-[44px] font-label font-semibold text-[15px] lg:text-base text-navy underline decoration-coral decoration-2 underline-offset-[6px] hover:text-navy-deep"
          >
            Calcúlalo con tus números&nbsp;<span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ——— 02 CÓMO FUNCIONA ——— */

function Proceso() {
  return (
    <section id="proceso" className="pt-16 lg:pt-[110px]">
      <Wrap>
        <SecHead tag={<SecTag n="02" name="Cómo funciona" />}>
          <h2 className={H2}>
            Del perfil que necesitas a una <span className="ed-serif-it">incorporación acompañada.</span>
          </h2>
        </SecHead>
        <div className="mt-6 lg:mt-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-4 lg:gap-16 items-center">
          <Reveal>
            <ol className="border-t border-navy/15">
              {PASOS.map(([h, p], i) => (
                <li key={h} className="grid grid-cols-[34px_minmax(0,1fr)] lg:grid-cols-[56px_minmax(0,1fr)] gap-2 py-[18px] lg:py-7 border-b border-navy/15">
                  <span className="ed-serif-it text-[20px] lg:text-[24px] text-navy" aria-hidden="true">{ROMANOS[i]}</span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="ed-serif font-normal text-navy leading-[1.15] text-[22px] lg:text-[30px]">{h}</h3>
                    <p className="text-[14px] lg:text-[16px] leading-[1.5] text-ink-soft">{p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.1}>
            <Img3D src="/img/3d/proceso.webp" className="ed-3d w-full h-[190px] sm:h-[280px] lg:h-[340px] object-cover" />
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}

/* ——— 03 ÁREAS ——— */

function Areas() {
  return (
    <section id="areas" className="pt-12 lg:pt-[110px]">
      <Wrap>
        <SecHead tag={<SecTag n="03" name="Áreas" />}>
          <h2 className={H2}>
            Un profesional para <span className="ed-serif-it">cada necesidad.</span>
          </h2>
        </SecHead>
        <Reveal className="mt-[18px] lg:mt-14">
          <ul className="grid grid-cols-2 md:grid-cols-3 border-t border-l border-navy/15">
            {AREAS.map(([n, s]) => (
              <li key={n} className="px-3.5 py-4 sm:p-6 lg:px-8 lg:py-9 border-r border-b border-navy/15 flex flex-col gap-1.5">
                <span className="ed-serif text-navy leading-[1.15] text-[19px] sm:text-[22px] lg:text-[28px]">{n}</span>
                <span className="text-[12.5px] sm:text-[14px] lg:text-[15px] text-ink-soft">{s}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ——— 04 RESEÑAS ———
   Salen de src/data/resenasGoogle.ts (fuente única de reseñas), tal cual. */

function Resenas() {
  const [principal, ...otras] = RESENAS
  return (
    <section id="resenas" className="mt-14 lg:mt-[110px] bg-cream-2 py-12 lg:py-[100px]">
      <Wrap>
        <Reveal>
          <SecTag n="04" name="Clientes reales · reseñas verificadas en Google" nameAs="h2" />
        </Reveal>
        <div className="mt-[22px] lg:mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-[22px] lg:gap-14 items-center">
          {principal?.texto && (
            <Reveal>
              <figure className="flex flex-col gap-3 lg:gap-5">
                <Estrellas />
                <blockquote className="ed-serif-it text-navy leading-[1.3] tracking-[-0.01em] text-[24px] sm:text-[30px] lg:text-[clamp(32px,3vw,42px)] [text-wrap:pretty]">
                  “{principal.texto.es}”
                </blockquote>
                <figcaption className="text-[13px] lg:text-[15px] text-ink-soft">
                  <strong className="text-navy">{principal.autor}</strong> · reseña en Google
                </figcaption>
              </figure>
            </Reveal>
          )}
          {otras.map(r => (
            <Reveal key={r.autor} delay={0.1}>
              <figure className="bg-cream rounded-[18px] lg:rounded-[22px] p-5 lg:p-8 flex flex-col gap-2.5 lg:gap-4">
                <Estrellas size={14} />
                <blockquote className="ed-serif text-navy leading-[1.45] text-[17px] lg:text-[20px]">“{r.texto?.es}”</blockquote>
                <figcaption className="text-[13px] lg:text-[15px] text-ink-soft">
                  <strong className="text-navy">{r.autor}</strong> · reseña en Google
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ——— 05 PREGUNTAS ———
   Las mismas que los datos estructurados FAQPage de esta página. */

function Preguntas() {
  return (
    <section id="preguntas" className="pt-12 lg:pt-[110px]">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3.5 lg:gap-14">
        <Reveal>
          <SecTag n="05" name="Preguntas frecuentes" nameAs="h2" />
        </Reveal>
        <div className="ed-faq border-t border-navy/15">
          {FAQ.map(([q, a], i) => (
            <details key={q} open={i === 0} className="group border-b border-navy/15 py-[18px] lg:py-6">
              <summary className="ed-serif text-navy list-none cursor-pointer flex justify-between items-start gap-3.5 min-h-[44px] leading-snug text-[19px] sm:text-[22px] lg:text-[26px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">
                {q}
                <span aria-hidden="true" className="font-label font-light shrink-0">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="mt-2.5 text-[14px] lg:text-[17px] leading-[1.55] text-ink-soft max-w-[40em]">{a}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ——— CIERRE ——— */

function Cierre() {
  return (
    <section className="pt-14 lg:pt-[110px] max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-[72px]">
      <Reveal className="bg-navy text-cream rounded-[26px] lg:rounded-[32px] overflow-hidden px-[22px] pt-9 pb-4 sm:p-10 lg:px-16 lg:py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-4 lg:gap-10 items-center">
        <div className="flex flex-col items-start gap-4 lg:gap-6">
          <h2 className="ed-serif font-[320] leading-[1.04] tracking-[-0.015em] text-[38px] sm:text-[48px] lg:text-[clamp(52px,5vw,72px)]">
            ¿Qué quieres <span className="ed-serif-it text-gold">delegar?</span>
          </h2>
          <p className="ed-label text-cream/75 leading-[1.6]">Desde 1.200 €/mes · Sin permanencia · Reemplazo garantizado</p>
          <a href="#solicitar" className="ed-pill bg-coral text-navy hover:bg-coral-hover hover:text-navy focus-visible:outline-gold">
            Quiero mi propuesta
          </a>
        </div>
        <Img3D src="/img/3d/conexion-navy.webp" className="ed-3d-navy w-full h-[170px] sm:h-[240px] lg:h-[300px] object-cover" />
      </Reveal>
    </section>
  )
}

/* ——— BARRA FIJA (móvil y tableta) ———
   Mide 60 px y flota a 12 px del borde: su tope queda a 72 px. El botón de
   ayuda del chat, en esta ruta, está a 84 px (ChatWidget): no tapa «Solicitar». */

function BarraFija() {
  return (
    <div className="lg:hidden fixed inset-x-3 bottom-3 z-40 sm:max-w-[520px] sm:mx-auto bg-navy-deep text-cream rounded-full pl-5 pr-2 py-2 flex items-center justify-between gap-3 shadow-[0_18px_40px_-12px_rgba(4,30,58,0.55)]">
      <span className="flex flex-col leading-[1.2] min-w-0">
        <span className="text-xs text-cream/70">Asistente virtual</span>
        <strong className="text-[15px] whitespace-nowrap">desde 1.200 €/mes</strong>
      </span>
      <span className="flex items-center gap-1.5 shrink-0">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Escribir por WhatsApp al ${TELEFONO}`}
          onClick={() => trackContacto('whatsapp', 'asistente-virtual-barra')}
          className="w-11 h-11 rounded-full bg-cream/[0.12] text-cream grid place-items-center hover:bg-cream/20 hover:text-cream transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </a>
        <a
          href="#solicitar"
          className="h-11 px-5 rounded-full bg-coral text-navy inline-flex items-center font-label font-semibold text-[15px] hover:bg-coral-hover hover:text-navy transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Solicitar
        </a>
      </span>
    </div>
  )
}

export default function AsistenteVirtual() {
  return (
    <div className="bg-cream text-ink">
      <SEO
        title="Asistente virtual para empresas desde 1.200 €/mes"
        description="Un profesional remoto dedicado, seleccionado y evaluado, en tu equipo en 5 días hábiles. Desde 1.200 €/mes, sin permanencia y con reemplazo garantizado."
        path="/asistente-virtual"
        keywords="asistente virtual para empresas, contratar asistente virtual, asistente virtual precio, secretaria virtual empresas, externalizar tareas administrativas"
        faqSchema={FAQ_SCHEMA}
      />

      <Cabecera />

      <main id="main-content">
        <Encabezado />
        <Coste />
        <Proceso />
        <Areas />
        <Resenas />
        <Preguntas />
        <Cierre />
      </main>

      <footer className="mt-14 lg:mt-20 border-t border-navy/15">
        <Wrap className="pt-5 pb-[100px] lg:pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[12.5px] lg:text-sm text-ink-soft">
          <span>© {new Date().getFullYear()} Global Talent Connections · Alicante, España</span>
          <Link to="/politica-de-privacidad" className="self-start inline-flex items-center min-h-[44px] text-ink-soft underline underline-offset-4 hover:text-navy">
            Política de privacidad
          </Link>
        </Wrap>
      </footer>

      <BarraFija />
    </div>
  )
}
