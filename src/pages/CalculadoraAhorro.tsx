import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, CheckCircle, AlertCircle, ArrowDown, ArrowRight, MessageCircle } from 'lucide-react'
import { trackLead } from '@/lib/tracking'
import { getUTMs, getReferrer } from '@/lib/utm'
import { getCountry } from '@/lib/geo'
import { BUDGET_MIN, withBudget } from '@/lib/budget'
import { WHATSAPP_LINK } from '@/data/chatbotData'
import { useT, useLang } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'

const API_URL =
  import.meta.env.VITE_PLATFORM_API_URL ||
  'https://www.globaltalentconnections.online/api/leads/public'

// Supuestos = los del Excel que se descarga (hoja «Calculadora»): Seguridad Social
// empresa 33 %, 10.200 €/año de costes indirectos (equipo 1.200, oficina 3.600,
// formación 800, software 500, selección 1.500, rotación 2.000, otros 600) y el
// software se cuenta en los dos lados. Salarios por perfil orientativos.
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

const EMPTY = { company_name: '', contact_name: '', contact_email: '', contact_phone: '', budget: '' }

export default function CalculadoraAhorro() {
  const t = useT()
  const lang = useLang()

  const [perfil, setPerfil] = useState(0)
  const [salario, setSalario] = useState(PERFILES[0].salario)
  const [n, setN] = useState(1)
  const [nivel, setNivel] = useState(0)
  const [ocultos, setOcultos] = useState(true)

  const [step, setStep] = useState<'calc' | 'form' | 'done'>('calc')
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

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
    ? `With ${n} ${n > 1 ? 'people' : 'person'}, your company spends ${eur(r.es)}/year in Spain. With GTC it would drop to ${eur(r.gtc)} — saving ${eur(r.ahorro)} a year (${r.pct} %) without giving up talent quality.`
    : `Con ${n} ${n > 1 ? 'personas' : 'persona'}, tu empresa gasta ${eur(r.es)}/año en España. Con GTC bajaría a ${eur(r.gtc)} — un ahorro de ${eur(r.ahorro)} anuales (${r.pct} %) sin renunciar a la calidad del talento.`

  const triggerDownload = () => {
    const link = document.createElement('a')
    link.href = '/Calculadora-de-Ahorro-Estrategico-GTC.xlsx'
    link.download = 'Calculadora-de-Ahorro-Estrategico-GTC.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const { budget, ...data } = form
    const perfilKey = PERFILES[perfil].key
    const resumen = `Calculadora: ${n} × ${perfilKey}, salario ${eur(salario)}/año · España ${eur(r.es)}/año vs GTC ${eur(r.gtc)}/año (${r.tarifa} €/mes) · ahorro ${eur(r.ahorro)} (${r.pct} %)`
    try {
      const utms = getUTMs()
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          assistant_type: perfilKey,
          description: withBudget(resumen, budget),
          budget_option: BUDGET_MIN[budget],
          source: 'web_formulario',
          country: getCountry(),
          // No pisar el origen real: si el visitante no trajo UTM, queda vacío
          // (honesto). El imán se marca en utm_content.
          utm_source: utms.utm_source,
          utm_medium: utms.utm_medium,
          utm_campaign: utms.utm_campaign || '',
          utm_content: utms.utm_content || 'calculadora',
          gclid: utms.gclid,
          fbclid: utms.fbclid,
          referrer: getReferrer(),
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('idle')
      setStep('done')
      // Disparar el evento ANTES de la descarga: así el beacon de analytics/ads
      // ya salió cuando el navegador se pone a bajar el Excel.
      trackLead('calculadora_ahorro')
      triggerDownload()
    } catch {
      setStatus('error')
    }
  }

  const input = 'w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy placeholder:text-navy/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all'
  const label = 'block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2'

  return (
    <>
      <SEO
        title="Calculadora de ahorro: cuánto cuesta contratar talento remoto"
        description="Calcula en segundos cuánto ahorra tu empresa contratando un asistente virtual o profesional remoto con GTC frente a una contratación local en España: hasta un 52% menos en costes."
        path="/calculadora-ahorro"
      />
      {/* HERO */}
      <section className="bg-navy pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-prime/[0.06] blur-[120px] rounded-full -mr-48 -mt-24" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <span className="text-blue-light text-xs font-label uppercase tracking-widest font-bold mb-4 block">{t('calc_label')}</span>
          <h1 className="font-headline font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {t('calc_titulo_1')} <span className="text-gold">{t('calc_titulo_2')}</span>?
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-6">{t('calc_subtitle')}</p>
          <div className="flex justify-center"><ArrowDown className="h-6 w-6 text-blue-light animate-bounce" /></div>
        </div>
      </section>

      {/* CALCULADORA */}
      <section className="py-16 lg:py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl border border-border-soft shadow-xl overflow-hidden">
            {/* Entradas */}
            <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border-soft">
              <h2 className="font-headline font-bold text-2xl text-navy mb-6">{t('calc_tus_datos')}</h2>

              <div className="mb-6">
                <label className={label} htmlFor="calc-perfil">{t('calc_perfil')}</label>
                <select id="calc-perfil" className={input} value={perfil} onChange={e => { const i = Number(e.target.value); setPerfil(i); setSalario(PERFILES[i].salario) }}>
                  {PERFILES.map((p, i) => <option key={p.key} value={i}>{t(p.labelKey)}</option>)}
                </select>
                <p className="text-xs text-navy/50 mt-1">{t('calc_perfil_hint')}</p>
              </div>

              <div className="mb-6">
                <label className={label} htmlFor="calc-salario">{t('calc_salario')}</label>
                <input id="calc-salario" type="number" min={0} step={500} className={`${input} font-headline font-bold text-xl`} value={salario} onChange={e => setSalario(Number(e.target.value) || 0)} />
                <p className="text-xs text-navy/50 mt-1">{t('calc_salario_hint')}</p>
              </div>

              <div className="mb-6">
                <label className={label} htmlFor="calc-n">{t('calc_personas')}</label>
                <div className="flex items-center gap-4">
                  <input id="calc-n" type="range" min={1} max={10} value={n} onChange={e => setN(Number(e.target.value))} className="flex-1 accent-coral" />
                  <span className="font-headline font-bold text-2xl text-navy w-8 text-right">{n}</span>
                </div>
              </div>

              <div className="mb-6">
                <span className={label}>{t('calc_nivel')}</span>
                <div className="grid grid-cols-3 gap-2">
                  {NIVELES.map((nv, i) => (
                    <button key={nv.key} type="button" onClick={() => setNivel(i)}
                      className={`rounded-lg border px-3 py-3 text-center transition-all ${i === nivel ? 'border-coral bg-coral/5' : 'border-border-soft hover:border-navy/30'}`}>
                      <span className="block font-headline font-bold text-lg text-navy">{nv.tarifa.toLocaleString('es-ES')} €</span>
                      <span className="text-xs text-navy/50">{t(nv.key)}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-navy/50 mt-1">{t('calc_nivel_hint')}</p>
              </div>

              <label className="flex items-start gap-3 text-sm text-dark-gray cursor-pointer">
                <input type="checkbox" checked={ocultos} onChange={e => setOcultos(e.target.checked)} className="mt-1 accent-coral w-4 h-4" />
                {t('calc_ocultos')}
              </label>
            </div>

            {/* Resultado */}
            <div className="p-8 lg:p-10 bg-navy text-white">
              <h2 className="font-headline font-bold text-2xl mb-6">{t('calc_resultado')}</h2>
              <div className="divide-y divide-white/10 border-t border-white/10">
                <Row k={t('calc_r_salario')} s={n > 1 ? `${n} ${t('calc_personas').toLowerCase()}` : undefined} v={eur(r.sal)} />
                <Row k={t('calc_r_ss')} s="~33 %" v={eur(r.ss)} />
                {ocultos && <Row k={t('calc_r_ocultos')} s={t('calc_r_ocultos_d')} v={eur(r.oc)} />}
                <Row k={t('calc_r_es')} v={eur(r.es)} big />
                <Row k={t('calc_r_gtc')} s={`${r.tarifa.toLocaleString('es-ES')} €/${lang === 'en' ? 'month' : 'mes'} × 12 + ${t('calc_r_software')}`} v={eur(r.gtc)} big gold />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="border border-white/15 rounded-lg p-4">
                  <div className="font-headline font-bold text-4xl text-coral leading-none">{r.pct} %</div>
                  <div className="text-xs text-white/55 uppercase tracking-widest font-label font-bold mt-2">{t('calc_menos_coste')}</div>
                </div>
                <div className="border border-white/15 rounded-lg p-4">
                  <div className="font-headline font-bold text-4xl text-coral leading-none">{eur(r.ahorro)}</div>
                  <div className="text-xs text-white/55 uppercase tracking-widest font-label font-bold mt-2">{t('calc_ahorro_anual')}</div>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mt-5">{frase}</p>
              {step === 'calc' && (
                <>
                  <button type="button" onClick={() => { setStep('form'); setTimeout(() => document.getElementById('calc-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}
                    className="w-full bg-coral text-white py-4 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-coral/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-coral/20 mt-6">
                    {t('calc_cta_propuesta')} <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-white/45 text-center mt-3">{t('calc_cta_note')}</p>
                </>
              )}
            </div>
          </div>

          {/* PASO 2 — formulario */}
          {step === 'form' && (
            <div id="calc-form" className="mt-6 bg-white rounded-2xl border border-border-soft shadow-xl p-8 lg:p-10 scroll-mt-28">
              <h3 className="font-headline font-bold text-2xl text-navy mb-1">{t('calc_paso2_titulo')}</h3>
              <p className="text-dark-gray mb-6">{t('calc_paso2_sub')}</p>
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div><label className={label}>{t('home_form_empresa')} *</label><input className={input} value={form.company_name} onChange={set('company_name')} placeholder={t('home_form_empresa_ph')} autoComplete="organization" required /></div>
                <div><label className={label}>{t('home_form_nombre')} *</label><input className={input} value={form.contact_name} onChange={set('contact_name')} placeholder={t('home_form_nombre_ph')} autoComplete="name" required /></div>
                <div><label className={label}>Email *</label><input className={input} type="email" value={form.contact_email} onChange={set('contact_email')} placeholder={t('home_form_email_ph')} autoComplete="email" required /></div>
                <div><label className={label}>{t('home_form_telefono')} *</label><input className={input} type="tel" value={form.contact_phone} onChange={set('contact_phone')} placeholder={t('home_form_telefono_ph')} autoComplete="tel" required /></div>
                <div>
                  <label className={label}>{t('form_presupuesto')} *</label>
                  <select className={input} value={form.budget} onChange={set('budget')} required>
                    <option value="">{t('form_presupuesto_ph')}</option>
                    <option value="menos_1200">{t('form_presupuesto_1')}</option>
                    <option value="1200_2000">{t('form_presupuesto_2')}</option>
                    <option value="mas_2000">{t('form_presupuesto_3')}</option>
                  </select>
                  <p className="text-xs text-navy/50 mt-1">{t('form_presupuesto_hint')}</p>
                </div>
                <div><label className={label}>{t('calc_perfil')}</label><input className={`${input} bg-off-white`} value={t(PERFILES[perfil].labelKey)} readOnly /></div>
                {status === 'error' && (
                  <div className="md:col-span-3 flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-lg text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{t('contacto_error')}</div>
                )}
                <div className="md:col-span-3 flex flex-col sm:flex-row items-center gap-4">
                  <button type="submit" disabled={status === 'loading'} className="bg-coral text-white px-8 py-4 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-coral/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-coral/20 disabled:opacity-50">
                    {status === 'loading' ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>{t('calc_enviar')} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <p className="text-xs text-navy/40">{t('calc_privacidad')} <Link to="/politica-de-privacidad" className="text-blue-prime hover:underline">Política de Privacidad</Link>.</p>
                </div>
              </form>
            </div>
          )}

          {/* PASO 3 — hecho */}
          {step === 'done' && (
            <div className="mt-6 bg-white rounded-2xl border border-border-soft shadow-xl p-10 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-headline font-bold text-3xl text-navy mb-2">{t('calc_ok_titulo')}</h3>
              <p className="text-dark-gray max-w-xl mx-auto mb-6">{t('calc_ok_desc')}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <a href="/Calculadora-de-Ahorro-Estrategico-GTC.xlsx" download className="inline-flex items-center justify-center gap-2 bg-coral text-white px-8 py-4 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-coral/90 transition-all shadow-lg shadow-coral/20">
                  <Download className="h-5 w-5" /> {t('calc_descargar_btn')}
                </a>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-navy/20 text-navy px-8 py-4 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:border-navy transition-all">
                  <MessageCircle className="h-5 w-5" /> {t('calc_whatsapp')}
                </a>
              </div>
            </div>
          )}

          {/* Qué incluye + pills */}
          <div className="mt-16">
            <h3 className="font-headline font-bold text-2xl text-navy mb-6">{t('calc_incluye_titulo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-border-soft p-6">
                  <h4 className="font-headline font-bold text-lg text-navy mb-2">{t(`calc_inc_${i}`)}</h4>
                  <p className="text-dark-gray text-sm leading-relaxed">{t(`calc_inc_${i}_d`)}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {['calc_pill_1', 'calc_pill_2', 'calc_pill_3', 'calc_pill_4'].map(key => (
                <div key={key} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-blue-prime bg-blue-prime/10 border border-blue-prime/20">
                  <CheckCircle className="w-3 h-3" /> {t(key)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Row({ k, s, v, big, gold }: { k: string; s?: string; v: string; big?: boolean; gold?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-3">
      <span className={big ? 'text-white' : 'text-white/65'}>
        {k}
        {s && <span className="block text-xs text-white/40">{s}</span>}
      </span>
      <span className={`font-headline font-bold whitespace-nowrap ${big ? 'text-2xl' : 'text-lg'} ${gold ? 'text-gold' : 'text-white'}`}>{v}</span>
    </div>
  )
}
