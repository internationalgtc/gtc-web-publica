import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, ArrowRight, MessageCircle } from 'lucide-react'
import { WHATSAPP_LINK } from '@/data/chatbotData'
import { useT, useLang } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { Reveal } from '@/components/shared/EditorialReveal'
import { FormularioLead } from '@/components/shared/FormularioLead'

// Calculadora de ahorro — sistema editorial (8-sep-2026). El cálculo es el
// mismo de siempre; lo que cambió es la piel (antes tarjetas, sombras y azul
// antiguo) y el formulario, que ahora es el único del sitio.
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

const eur = (n: number) => `${Math.round(n).toLocaleString('es-ES')} €`
const EXCEL = '/Calculadora-de-Ahorro-Estrategico-GTC.xlsx'

export default function CalculadoraAhorro() {
  const t = useT()
  const lang = useLang()

  const [perfil, setPerfil] = useState(0)
  const [salario, setSalario] = useState(PERFILES[0].salario)
  const [n, setN] = useState(1)
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

  const campo = 'w-full bg-transparent border-b border-navy/20 focus:border-coral outline-none py-2.5 font-display text-[20px] text-ink transition-colors'
  const etiqueta = 'ed-caps !text-[10px] text-ink-soft'

  return (
    <>
      <SEO
        title="Calculadora de ahorro: cuánto cuesta contratar talento remoto"
        description="Calcula en segundos cuánto ahorra tu empresa contratando un asistente virtual o profesional remoto con GTC frente a una contratación local en España."
        path="/calculadora-ahorro"
      />

      {/* CABECERA */}
      <section className="pt-[158px] pb-[64px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal y={0}>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">✳</span>
              <span className="name">{t('calc_label')}</span>
              <span className="meta hidden sm:inline">{t('calc_meta')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 max-w-[16ch]">
            <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(40px,6.4vw,96px)] [text-wrap:balance]">
              {t('calc_titulo_1')} <em className="italic text-gold-deep">{t('calc_titulo_2')}</em>?
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[clamp(16px,1.5vw,20px)] text-ink-soft max-w-[54ch] leading-relaxed mt-7">{t('calc_subtitle')}</p>
          </Reveal>
        </div>
      </section>

      {/* CALCULADORA */}
      <section className="pb-[130px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12 border-t border-navy/15 pt-10">
            {/* Controles */}
            <Reveal>
              <div className="ed-caps !text-[10px] text-sand">01 · {t('calc_tus_datos')}</div>

              <div className="mt-8 grid gap-1.5">
                <label className={etiqueta} htmlFor="calc-perfil">{t('calc_perfil')}</label>
                <select
                  id="calc-perfil"
                  className={campo}
                  value={perfil}
                  onChange={e => { const i = Number(e.target.value); setPerfil(i); setSalario(PERFILES[i].salario) }}
                >
                  {PERFILES.map((p, i) => <option key={p.key} value={i}>{t(p.labelKey)}</option>)}
                </select>
                <p className="text-xs text-sand mt-1">{t('calc_perfil_hint')}</p>
              </div>

              <div className="mt-8 grid gap-1.5">
                <label className={etiqueta} htmlFor="calc-salario">{t('calc_salario')}</label>
                <input
                  id="calc-salario"
                  type="number"
                  min={0}
                  step={500}
                  className={campo}
                  value={salario}
                  onChange={e => setSalario(Number(e.target.value))}
                />
                <p className="text-xs text-sand mt-1">{t('calc_salario_hint')}</p>
              </div>

              <div className="mt-8 grid gap-3">
                <label className={etiqueta} htmlFor="calc-n">{t('calc_personas')}</label>
                <div className="flex items-center gap-5">
                  <input
                    id="calc-n"
                    type="range"
                    min={1}
                    max={10}
                    value={n}
                    onChange={e => setN(Number(e.target.value))}
                    className="flex-1 accent-coral"
                  />
                  <span className="font-display text-[32px] text-navy tabular-nums w-[2ch] text-right">{n}</span>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                <span className={etiqueta}>{t('calc_nivel')}</span>
                <div className="flex gap-2.5 flex-wrap">
                  {NIVELES.map((nv, i) => (
                    <button
                      key={nv.key}
                      type="button"
                      onClick={() => setNivel(i)}
                      className={`ed-caps !text-[10px] px-4 py-2.5 rounded-full border transition-colors duration-300 ${
                        nivel === i ? 'bg-navy text-cream border-navy' : 'border-navy/20 text-ink-soft hover:border-navy'
                      }`}
                    >
                      {t(nv.key)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-sand">{t('calc_nivel_hint')}</p>
              </div>

              <label className="mt-8 flex items-start gap-3 text-[14.5px] text-ink-soft leading-relaxed cursor-pointer">
                <input type="checkbox" checked={ocultos} onChange={e => setOcultos(e.target.checked)} className="mt-1 accent-coral w-4 h-4" />
                {t('calc_ocultos')}
              </label>
            </Reveal>

            {/* Resultado */}
            <Reveal delay={0.1}>
              <div className="ed-on-dark bg-gradient-to-b from-navy to-navy-deep text-cream p-8 lg:p-10">
                <div className="ed-caps !text-[10px] text-cream/40">02 · {t('calc_resultado')}</div>
                <dl className="mt-8">
                  <Fila k={t('calc_r_salario')} s={n > 1 ? `${n} ${t('calc_personas').toLowerCase()}` : undefined} v={eur(r.sal)} />
                  <Fila k={t('calc_r_ss')} s="~33 %" v={eur(r.ss)} />
                  {ocultos && <Fila k={t('calc_r_ocultos')} s={t('calc_r_ocultos_d')} v={eur(r.oc)} />}
                  <Fila k={t('calc_r_es')} v={eur(r.es)} grande />
                  <Fila
                    k={t('calc_r_gtc')}
                    s={`${r.tarifa.toLocaleString('es-ES')} €/${lang === 'en' ? 'month' : 'mes'} × 12 + ${t('calc_r_software')}`}
                    v={eur(r.gtc)}
                    grande
                    oro
                  />
                </dl>

                <div className="grid grid-cols-2 gap-8 mt-9 pt-8 border-t border-cream/[0.18]">
                  <div>
                    <div className="font-display font-light text-[clamp(38px,4.4vw,56px)] leading-none text-coral tabular-nums">{r.pct} %</div>
                    <div className="ed-caps !text-[9.5px] !tracking-[0.16em] text-cream/45 mt-3">{t('calc_menos_coste')}</div>
                  </div>
                  <div>
                    <div className="font-display font-light text-[clamp(30px,3.6vw,44px)] leading-none text-coral tabular-nums">{eur(r.ahorro)}</div>
                    <div className="ed-caps !text-[9.5px] !tracking-[0.16em] text-cream/45 mt-3">{t('calc_ahorro_anual')}</div>
                  </div>
                </div>

                <p className="text-[14.5px] text-cream/70 leading-relaxed mt-8">{frase}</p>

                {paso === 'calc' && (
                  <div className="mt-9">
                    <button
                      type="button"
                      className="ed-btn ed-btn-primary w-full justify-center"
                      onClick={() => {
                        setPaso('form')
                        setTimeout(() => document.getElementById('calc-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
                      }}
                    >
                      {t('calc_cta_propuesta')} <ArrowRight className="w-4 h-4 arrow" />
                    </button>
                    <p className="ed-caps !text-[9.5px] !tracking-[0.16em] text-cream/35 text-center mt-4">{t('calc_cta_note')}</p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* PEDIR LA PROPUESTA — mismo formulario que el resto del sitio */}
          {paso === 'form' && (
            <div id="calc-form" className="mt-[70px] scroll-mt-28">
              <Reveal>
                <div className="ed-on-dark bg-gradient-to-b from-navy to-navy-deep text-cream p-8 lg:p-11">
                  <div className="ed-sec-tag ed-caps">
                    <span className="idx">03</span>
                    <span className="name">{t('calc_paso2_titulo')}</span>
                  </div>
                  <p className="text-[15px] text-cream/60 leading-relaxed max-w-[52ch] mt-6">{t('calc_paso2_sub')}</p>
                  <div className="mt-8">
                    <FormularioLead
                      formulario="calculadora"
                      cta={t('calc_enviar')}
                      perfilFijo={PERFILES[perfil].key}
                      contexto={resumen}
                      onExito={descargarExcel}
                      exitoExtra={
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a href={EXCEL} download className="ed-btn ed-btn-primary">
                            <Download className="h-4 w-4" /> {t('calc_descargar_btn')}
                          </a>
                          <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ed-btn ed-btn-outline !text-cream"
                            style={{ boxShadow: 'inset 0 0 0 1.5px rgba(246,243,236,.3)' }}
                          >
                            <MessageCircle className="h-4 w-4" /> {t('calc_whatsapp')}
                          </a>
                        </div>
                      }
                    />
                  </div>
                  <p className="text-xs text-cream/35 mt-7">
                    {t('calc_privacidad')}{' '}
                    <Link to="/politica-de-privacidad" className="text-cream/60 hover:text-coral transition-colors">
                      {t('footer_privacidad')}
                    </Link>
                  </p>
                </div>
              </Reveal>
            </div>
          )}

          {/* QUÉ INCLUYE */}
          <div className="mt-[110px]">
            <Reveal>
              <div className="ed-sec-tag ed-caps">
                <span className="idx">✳</span>
                <span className="name">{t('calc_incluye_titulo')}</span>
              </div>
            </Reveal>
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 border-t border-navy/15 mt-8">
                {[1, 2, 3].map((i, idx) => (
                  <div
                    key={i}
                    className={`py-10 md:pr-10 ${idx > 0 ? 'md:border-l md:border-navy/15 md:pl-10' : ''} ${idx < 2 ? 'border-b md:border-b-0 border-navy/15' : ''}`}
                  >
                    <div className="font-display font-light text-[clamp(34px,3.6vw,48px)] leading-none text-navy tabular-nums">
                      0<span className="italic text-coral">{i}</span>
                    </div>
                    <h3 className="font-display text-[clamp(18px,1.7vw,22px)] text-ink mt-6 mb-3">{t(`calc_inc_${i}`)}</h3>
                    <p className="text-[14.5px] text-ink-soft leading-relaxed">{t(`calc_inc_${i}_d`)}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <div className="flex flex-wrap gap-2.5 mt-9">
                {['calc_pill_1', 'calc_pill_2', 'calc_pill_3', 'calc_pill_4'].map(key => (
                  <span key={key} className="ed-caps !text-[10px] px-4 py-2.5 rounded-full border border-navy/20 text-ink-soft">
                    {t(key)}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

function Fila({ k, s, v, grande, oro }: { k: string; s?: string; v: string; grande?: boolean; oro?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-6 py-4 border-b border-cream/[0.18]">
      <dt className={grande ? 'text-cream text-[15px]' : 'text-cream/60 text-[14px]'}>
        {k}
        {s && <span className="block text-xs text-cream/35 mt-1">{s}</span>}
      </dt>
      <dd className={`font-display whitespace-nowrap tabular-nums ${grande ? 'text-[26px]' : 'text-[19px]'} ${oro ? 'text-gold' : 'text-cream'}`}>{v}</dd>
    </div>
  )
}
