import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, ArrowRight, MessageCircle } from 'lucide-react'
import { WHATSAPP_LINK } from '@/data/chatbotData'
import { trackContacto } from '@/lib/tracking'
import { useT, useLang } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'
import { Img3D, SecHead, SecTag, TituloEntrada, Wrap } from '@/components/shared/EditorialPiezas'
import { FormularioLead } from '@/components/shared/FormularioLead'

// Calculadora de ahorro — rediseño «A · Revista» (28-sep-2026), lienzo
// A-calculadora. El cálculo es el mismo de siempre; lo que cambió es la piel.
//
// Supuestos = los del Excel que se descarga (hoja «Calculadora»): Seguridad
// Social empresa 33 %, 10.200 €/año de costes indirectos (equipo 1.200, oficina
// 3.600, formación 800, software 500, selección 1.500, rotación 2.000, otros
// 600) y el software se cuenta en los dos lados. Salarios por perfil orientativos.
const SS = 0.33
const OCULTOS = 10200
const SOFTWARE = 500

const PERFILES: { key: string; labelKey: string; salario: number }[] = [
  { key: 'Administrativo', labelKey: 'serv_admin', salario: 22000 },
  { key: 'Atención al Cliente', labelKey: 'serv_atencion', salario: 21000 },
  { key: 'Marketing Digital', labelKey: 'serv_marketing', salario: 26000 },
  { key: 'Ventas', labelKey: 'home_form_ventas', salario: 25000 },
  { key: 'Financiero / Contable', labelKey: 'serv_finanzas', salario: 28000 },
  { key: 'Automatización e IA', labelKey: 'serv_ia', salario: 32000 },
]
const NIVELES = [
  { key: 'calc_junior', tarifa: 1200 },
  { key: 'calc_mid', tarifa: 1400 },
  { key: 'calc_senior', tarifa: 1650 },
]
/** Tope de personas: el mismo que tenía el control deslizante. */
const N_MAX = 10

const eur = (n: number) => `${Math.round(n).toLocaleString('es-ES')} €`
const EXCEL = '/Calculadora-de-Ahorro-Estrategico-GTC.xlsx'

const INCLUYE = ['calc_inc_1', 'calc_inc_2', 'calc_inc_3']
const PILLS = ['calc_pill_1', 'calc_pill_2', 'calc_pill_3', 'calc_pill_4']

/* Estilos de los controles (lienzo A-calculadora). */
const ETIQUETA = 'ed-label text-ink-soft'
const AYUDA = 'text-[14px] leading-[1.45] text-ink-soft'
const CAMPO_GRANDE =
  'w-full min-h-[64px] ed-serif text-[30px] lg:text-[34px] text-navy tabular-nums px-4 py-2.5 rounded-[14px] border border-navy/25 bg-cream focus:outline focus:outline-2 focus:outline-navy focus:outline-offset-1'
const opcion = (activa: boolean) =>
  `min-h-[52px] rounded-[14px] border-[1.5px] font-label text-[15px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-2 ${
    activa ? 'bg-navy border-navy text-cream font-semibold' : 'bg-cream border-navy/20 text-navy font-medium hover:border-navy'
  }`

export default function CalculadoraAhorro() {
  const t = useT()
  const lang = useLang()

  const [perfil, setPerfil] = useState(0)
  const [salario, setSalario] = useState(PERFILES[0].salario)
  const [n, setN] = useState(1)
  const [nTexto, setNTexto] = useState('1')
  const [nivel, setNivel] = useState(0)
  const [ocultos, setOcultos] = useState(true)
  const [paso, setPaso] = useState<'calc' | 'form'>('calc')

  const r = useMemo(() => {
    const tarifa = NIVELES[nivel].tarifa
    const ss = salario * SS
    const oc = ocultos ? OCULTOS : 0
    const es = (salario + ss + oc + (ocultos ? 0 : SOFTWARE)) * n
    const gtc = (tarifa * 12 + SOFTWARE) * n
    const ahorro = es - gtc
    return { tarifa, ss: ss * n, oc: oc * n, sal: salario * n, es, gtc, ahorro, pct: es > 0 ? Math.round((ahorro / es) * 100) : 0 }
  }, [salario, n, nivel, ocultos])

  const frase = lang === 'en'
    ? `With ${n} ${n > 1 ? 'people' : 'person'}, your company spends ${eur(r.es)}/year in Spain. With GTC it would drop to ${eur(r.gtc)} — saving ${eur(r.ahorro)} a year.`
    : `Con ${n} ${n > 1 ? 'personas' : 'persona'}, tu empresa gasta ${eur(r.es)}/año en España. Con GTC bajaría a ${eur(r.gtc)} — un ahorro de ${eur(r.ahorro)} al año.`

  // El resultado viaja con el lead: la gestora ve en la ficha qué números vio
  // la empresa antes de pedir la propuesta.
  const resumen = `Calculadora: ${n} × ${PERFILES[perfil].key}, salario ${eur(salario)}/año · España ${eur(r.es)}/año vs GTC ${eur(r.gtc)}/año (${r.tarifa} €/mes) · Ahorro ${eur(r.ahorro)} (${r.pct} %)`

  const descargarExcel = () => {
    const link = document.createElement('a')
    link.href = EXCEL
    link.download = 'Calculadora-de-Ahorro-Estrategico-GTC.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Nº de personas: se puede borrar y reescribir; el cálculo toma el último
  // número válido (1 a 10) y al salir del campo se muestra ese número.
  const cambiarN = (valor: string) => {
    const num = Math.round(Number(valor))
    if (valor === '' || !Number.isFinite(num) || num < 1) { setNTexto(valor); return }
    const final = Math.min(num, N_MAX)
    setN(final)
    setNTexto(String(final))
  }

  return (
    <div className="bg-cream text-ink">
      <SEO
        title="Calculadora de ahorro: cuánto cuesta contratar talento remoto"
        description="Calcula en segundos cuánto ahorra tu empresa contratando un asistente virtual o profesional remoto con GTC frente a una contratación local en España."
        path="/calculadora-ahorro"
      />

      {/* CABECERA */}
      <section className="pt-[112px] sm:pt-[140px] lg:pt-[184px] pb-8 lg:pb-[70px]">
        <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 lg:gap-14 items-end">
          <div className="flex flex-col gap-6 lg:gap-[30px]">
            <Reveal y={0}>
              <div className="ed-label flex flex-wrap gap-x-3.5 gap-y-1 text-ink-soft">
                <span className="font-semibold text-navy">{t('calc_label')}</span>
                <span>· {t('calc_meta')}</span>
              </div>
            </Reveal>
            <TituloEntrada
              className="ed-serif font-[320] text-navy leading-[0.98] tracking-[-0.025em] text-[clamp(44px,12vw,64px)] sm:text-[clamp(64px,10vw,88px)] lg:text-[clamp(80px,7.8vw,112px)] [text-wrap:balance]"
              tramos={[{ texto: t('calc_titulo_1') }, { texto: `${t('calc_titulo_2')}?`, subraya: true }]}
            />
            <Reveal delay={0.5} y={26}>
              <p className="max-w-[32em] text-[17px] sm:text-[19px] lg:text-[21px] leading-[1.55] text-ink-soft [text-wrap:pretty]">{t('calc_subtitle')}</p>
            </Reveal>
          </div>
          <Reveal delay={0.3} y={0}>
            <Img3D primero src="/img/3d/ahorro.webp" className="ed-3d w-full h-[200px] sm:h-[300px] lg:h-[380px] object-cover" />
          </Reveal>
        </Wrap>
      </section>

      {/* CALCULADORA */}
      <section id="coste" className="pt-4 lg:pt-[30px] pb-20 lg:pb-[110px]">
        <Wrap>
          <Reveal>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] rounded-[28px] lg:rounded-[36px] overflow-hidden shadow-[0_50px_90px_-60px_rgba(6,46,85,0.55)]">
              {/* 01 · Tus datos */}
              <div className="bg-white p-5 sm:p-10 lg:p-[52px] flex flex-col gap-7">
                <div className="ed-label text-ink-soft">
                  <span className="font-semibold text-navy">01</span> · {t('calc_tus_datos')}
                </div>

                <fieldset className="flex flex-col gap-3">
                  <legend className={`${ETIQUETA} mb-3`}>{t('calc_perfil')}</legend>
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2.5">
                    {PERFILES.map((p, i) => (
                      <button
                        key={p.key}
                        type="button"
                        aria-pressed={perfil === i}
                        onClick={() => { setPerfil(i); setSalario(PERFILES[i].salario) }}
                        className={`${opcion(perfil === i)} text-left px-4 py-3`}
                      >
                        {t(p.labelKey)}
                      </button>
                    ))}
                  </div>
                  <p className={AYUDA}>{t('calc_perfil_hint')}</p>
                </fieldset>

                <div className="flex flex-col gap-2">
                  <label className={ETIQUETA} htmlFor="calc-salario">{t('calc_salario')}</label>
                  <input
                    id="calc-salario"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={500}
                    className={CAMPO_GRANDE}
                    value={salario}
                    onChange={e => setSalario(Number(e.target.value))}
                  />
                  <p className={AYUDA}>{t('calc_salario_hint')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6 sm:gap-[18px]">
                  <div className="flex flex-col gap-2">
                    <label className={ETIQUETA} htmlFor="calc-n">{t('calc_personas')}</label>
                    <input
                      id="calc-n"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={N_MAX}
                      step={1}
                      className={CAMPO_GRANDE}
                      value={nTexto}
                      onChange={e => cambiarN(e.target.value)}
                      onBlur={() => setNTexto(String(n))}
                    />
                  </div>
                  <fieldset className="flex flex-col gap-2">
                    <legend className={`${ETIQUETA} mb-2`}>{t('calc_nivel')}</legend>
                    <div className="grid grid-cols-3 gap-2">
                      {NIVELES.map((nv, i) => (
                        <button key={nv.key} type="button" aria-pressed={nivel === i} onClick={() => setNivel(i)} className={`${opcion(nivel === i)} min-h-[64px]`}>
                          {t(nv.key)}
                        </button>
                      ))}
                    </div>
                    <p className={AYUDA}>{t('calc_nivel_hint')}</p>
                  </fieldset>
                </div>

                <label className="flex gap-3.5 items-start min-h-[44px] text-[16px] leading-[1.45] text-navy cursor-pointer">
                  <input type="checkbox" checked={ocultos} onChange={e => setOcultos(e.target.checked)} className="w-[22px] h-[22px] mt-px shrink-0 accent-navy" />
                  {t('calc_ocultos')}
                </label>
              </div>

              {/* 02 · Tu resultado */}
              <div className="bg-navy text-cream p-5 sm:p-10 lg:p-[52px] flex flex-col gap-6 lg:gap-[26px]">
                <div className="ed-label text-cream/70">
                  <span className="font-semibold text-gold">02</span> · {t('calc_resultado')}
                </div>

                <dl className="flex flex-col border-t border-cream/20">
                  <Fila k={t('calc_r_salario')} s={n > 1 ? `${n} ${t('calc_personas').toLowerCase()}` : undefined} v={eur(r.sal)} />
                  <Fila k={t('calc_r_ss')} extra="~33 %" v={eur(r.ss)} />
                  {ocultos && <Fila k={t('calc_r_ocultos')} s={t('calc_r_ocultos_d')} v={eur(r.oc)} />}
                </dl>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-cream/[0.08] rounded-[20px] p-5 lg:p-[22px] flex flex-col gap-1.5">
                    <dt className="text-[18px] lg:text-[22px] text-cream/85">{t('calc_r_es')}</dt>
                    <dd className="ed-serif font-[320] leading-none tabular-nums whitespace-nowrap text-[clamp(38px,4.2vw,52px)] xl:text-[clamp(38px,3.5vw,52px)]">{eur(r.es)}</dd>
                  </div>
                  <div className="bg-cream text-navy rounded-[20px] p-5 lg:p-[22px] flex flex-col gap-1.5">
                    <dt className="text-[18px] lg:text-[22px] text-ink-soft">{t('calc_r_gtc')}</dt>
                    <dd className="ed-serif font-[320] leading-none tabular-nums whitespace-nowrap text-[clamp(38px,4.2vw,52px)] xl:text-[clamp(38px,3.5vw,52px)]">{eur(r.gtc)}</dd>
                    <dd className="text-[15px] text-ink-soft">
                      {`${r.tarifa.toLocaleString('es-ES')} €/${lang === 'en' ? 'month' : 'mes'} × 12 + ${t('calc_r_software')}`}
                    </dd>
                  </div>
                </dl>

                <dl className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 items-end pt-1.5">
                  <div className="flex flex-col gap-1 min-w-0">
                    <dt className="text-[18px] lg:text-[22px] text-cream/85">{t('calc_menos_coste')}</dt>
                    <dd className="order-first ed-serif font-[280] text-gold leading-[0.85] tracking-[-0.04em] tabular-nums whitespace-nowrap text-[clamp(84px,24vw,120px)] sm:text-[clamp(84px,11vw,120px)] xl:text-[clamp(84px,8vw,120px)]">
                      {r.pct} %
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <dt className="text-[18px] lg:text-[22px] text-cream/85">{t('calc_ahorro_anual')}</dt>
                    <dd className="order-first ed-serif font-[280] text-gold leading-[0.9] tracking-[-0.03em] tabular-nums whitespace-nowrap text-[clamp(52px,15vw,88px)] sm:text-[clamp(52px,7.4vw,88px)] xl:text-[clamp(52px,5.4vw,88px)]">
                      {eur(r.ahorro)}
                    </dd>
                  </div>
                </dl>

                <p className="text-[16px] lg:text-[18px] leading-[1.55] text-cream/85" aria-live="polite">{frase}</p>

                {paso === 'calc' && (
                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      className="ed-pill w-full bg-coral text-navy hover:bg-coral-hover hover:text-navy focus-visible:outline-gold text-[17px] min-h-[60px]"
                      onClick={() => {
                        setPaso('form')
                        setTimeout(() => document.getElementById('calc-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
                      }}
                    >
                      {t('calc_cta_propuesta')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
                    </button>
                    <p className="text-center text-[15px] leading-[1.45] text-cream/75">{t('calc_cta_note')}</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* PEDIR LA PROPUESTA — mismo formulario que el resto del sitio */}
          {paso === 'form' && (
            <div id="calc-form" className="mt-12 lg:mt-[70px] scroll-mt-28">
              <Reveal>
                <div className="ed-form-blanca bg-white text-ink border border-navy/10 rounded-[24px] lg:rounded-[30px] p-5 sm:p-8 lg:p-12 shadow-[0_40px_80px_-52px_rgba(6,46,85,0.45)] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] gap-8 lg:gap-[72px]">
                  <div className="flex flex-col gap-5">
                    <h2 className="ed-serif font-[320] text-navy leading-[1.05] tracking-[-0.02em] text-[clamp(30px,3.4vw,46px)] [text-wrap:balance]">
                      {t('calc_paso2_titulo')}
                    </h2>
                    <p className="text-[16px] lg:text-[18px] leading-[1.55] text-ink-soft">{t('calc_paso2_sub')}</p>
                  </div>
                  <div>
                    <FormularioLead
                      formulario="calculadora"
                      tono="claro"
                      cta={t('calc_enviar')}
                      perfilFijo={PERFILES[perfil].key}
                      contexto={resumen}
                      onExito={descargarExcel}
                      exitoExtra={
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a href={EXCEL} download className="ed-pill bg-coral text-navy hover:bg-coral-hover hover:text-navy">
                            <Download className="h-[18px] w-[18px]" aria-hidden="true" /> {t('calc_descargar_btn')}
                          </a>
                          <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackContacto('whatsapp', 'calculadora')}
                            className="ed-pill ed-pill-line"
                          >
                            <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" /> {t('calc_whatsapp')}
                          </a>
                        </div>
                      }
                    />
                    <p className="text-[13.5px] text-ink-soft mt-6">
                      {t('calc_privacidad')}{' '}
                      <Link to="/politica-de-privacidad" className="text-navy underline underline-offset-2 hover:text-navy-deep">
                        {t('footer_privacidad')}
                      </Link>
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </Wrap>
      </section>

      {/* 03 · QUÉ INCLUYE EL PRECIO */}
      <section id="incluye" className="bg-cream-2 py-20 lg:pt-[110px] lg:pb-[100px]">
        <Wrap className="flex flex-col gap-12 lg:gap-16">
          <SecHead tag={<SecTag n="03" name={t('calc_incluye_meta')} />}>
            <h2 className="ed-serif font-[320] text-navy leading-[1.02] tracking-[-0.02em] text-[clamp(38px,5.6vw,80px)] [text-wrap:balance]">
              {t('calc_incluye_h2_a')} <span className="ed-serif-it">{t('calc_incluye_h2_b')}</span>
            </h2>
          </SecHead>
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-7 lg:gap-9">
            {INCLUYE.map((key, i) => (
              <RevealItem key={key}>
                <article className="flex flex-col gap-4 lg:gap-[18px] border-t-[1.5px] border-navy pt-6 lg:pt-7">
                  <div className="flex gap-3.5 items-baseline">
                    <span className="ed-serif text-lg text-ink-soft">0{i + 1}/</span>
                    <h3 className="ed-serif font-[330] text-navy leading-[1.1] text-[clamp(26px,2.5vw,36px)]">{t(key)}</h3>
                  </div>
                  <p className="text-[16px] lg:text-[18px] leading-[1.6] text-ink-soft">{t(`${key}_d`)}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal>
            <ul className="flex flex-wrap gap-3 border-t border-navy/20 pt-8 lg:pt-[34px]">
              {PILLS.map(key => (
                <li key={key} className="inline-flex items-center min-h-[48px] px-[22px] rounded-full border-[1.5px] border-navy font-label font-semibold text-[15px] lg:text-[16px] text-navy">
                  {t(key)}
                </li>
              ))}
            </ul>
          </Reveal>
        </Wrap>
      </section>
    </div>
  )
}

function Fila({ k, s, extra, v }: { k: string; s?: string; extra?: string; v: string }) {
  return (
    <div className="flex justify-between items-baseline gap-5 py-4 border-b border-cream/20">
      <dt className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[17px] lg:text-[22px] text-cream/85">
          {k}
          {extra && <span className="text-cream/60"> {extra}</span>}
        </span>
        {s && <span className="text-[14px] lg:text-[15px] text-cream/60">{s}</span>}
      </dt>
      <dd className="ed-serif text-[22px] lg:text-[30px] tabular-nums whitespace-nowrap">{v}</dd>
    </div>
  )
}
