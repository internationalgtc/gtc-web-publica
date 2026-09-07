import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { trackLead } from '@/lib/tracking'
import { getUTMs, getReferrer } from '@/lib/utm'
import { getCountry } from '@/lib/geo'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router-dom'
import { Download, CheckCircle, ArrowDown, ArrowRight } from 'lucide-react'
import { useT } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'

const API_URL =
  import.meta.env.VITE_PLATFORM_API_URL ||
  'https://www.globaltalentconnections.online/api/leads/public'

const schema = z.object({
  contact_name: z.string().min(1, 'Requerido'),
  contact_email: z.string().email('Email inválido'),
  company_name: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function CalculadoraAhorro() {
  const t = useT()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const triggerDownload = () => {
    const link = document.createElement('a')
    link.href = '/Calculadora-de-Ahorro-Estrategico-GTC.xlsx'
    link.download = 'Calculadora-de-Ahorro-Estrategico-GTC.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const utms = getUTMs()
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          company_name: data.company_name || undefined,
          source: 'web_formulario',
          country: getCountry(),
          description: 'Descargó la Calculadora de Ahorro Estratégico',
          // No pisar el origen real: si el visitante no trajo UTM, queda vacío
          // (honesto) en vez de un falso "landing/calculadora" que tapaba de
          // dónde vino (agencia, orgánico, etc.). El imán se marca en utm_content.
          utm_source: utms.utm_source,
          utm_medium: utms.utm_medium,
          utm_campaign: utms.utm_campaign || '',
          utm_content: utms.utm_content || 'calculadora',
          gclid: utms.gclid,
          fbclid: utms.fbclid,
          referrer: getReferrer(),
        }),
      })
    } catch {
      // Descarga siempre, aunque falle la API
    } finally {
      setLoading(false)
      setSubmitted(true)
      // Disparar el evento ANTES de la descarga: así el beacon de analytics/ads
      // ya salió cuando el navegador se pone a bajar el Excel. Antes iba al revés
      // y se perdía ~85% de los leads de la calculadora en GA4/Ads.
      trackLead('calculadora_ahorro')
      triggerDownload()
    }
  }

  return (
    <>
      <SEO
        title="Calculadora de ahorro: cuánto cuesta contratar talento remoto"
        description="Calcula en segundos cuánto ahorra tu empresa contratando un asistente virtual o profesional remoto con GTC frente a una contratación local en España: hasta un 52% menos en costos."
        path="/calculadora-ahorro"
      />
      {/* HERO */}
      <section className="bg-navy pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-prime/[0.06] blur-[120px] rounded-full -mr-48 -mt-24" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <span className="text-blue-light text-xs font-label uppercase tracking-widest font-bold mb-4 block">{t('calc_label')}</span>
          <h1 className="font-headline font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {t('calc_titulo_1')} <span className="text-gold">{t('calc_titulo_2')}</span>?
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            {t('calc_subtitle')}
          </p>
          <div className="inline-flex items-center gap-4 bg-coral/10 border border-coral/20 rounded-xl px-8 py-4 mb-8">
            <span className="text-coral font-headline font-bold text-4xl">52%</span>
            <span className="text-white/70 text-sm text-left">{t('calc_ahorro_label')}</span>
          </div>
          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-blue-light animate-bounce" />
          </div>
        </div>
      </section>

      {/* FORMULARIO + PREVIEW */}
      <section className="py-20 lg:py-28 bg-off-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Formulario */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 border border-border-soft shadow-xl">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-headline font-bold text-2xl text-navy mb-2">{t('calc_descarga_ok')}</h3>
                <p className="text-dark-gray mb-6">{t('calc_descarga_desc')}</p>
                <a
                  href="/Calculadora-de-Ahorro-Estrategico-GTC.xlsx"
                  download
                  className="inline-flex items-center gap-2 bg-coral text-white px-8 py-4 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-coral/90 transition-all shadow-lg shadow-coral/20"
                >
                  <Download className="h-5 w-5" />
                  {t('calc_descargar_btn')}
                </a>
                <p className="text-sm text-dark-gray mt-6">
                  {t('calc_quieres')}{' '}
                  <Link to="/contacto" className="text-blue-prime font-bold hover:underline">{t('calc_hablemos')}</Link>
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-headline font-bold text-2xl text-navy mb-2">{t('calc_descargar_titulo')}</h2>
                <p className="text-dark-gray text-sm mb-8">{t('calc_descargar_sub')}</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">{t('calc_nombre')}</label>
                    <input
                      {...register('contact_name')}
                      placeholder={t('calc_ph_nombre')}
                      className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy placeholder:text-navy/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                    />
                    {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name.message}</p>}
                  </div>

                  <div>
                    <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">Email *</label>
                    <input
                      {...register('contact_email')}
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy placeholder:text-navy/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                    />
                    {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email.message}</p>}
                  </div>

                  <div>
                    <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">{t('calc_empresa')} <span className="text-navy/40 normal-case font-normal">(opcional)</span></label>
                    <input
                      {...register('company_name')}
                      placeholder={t('calc_ph_empresa')}
                      className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy placeholder:text-navy/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-coral text-white py-4 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-coral/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-coral/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        {t('calc_descargar_cta')}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-navy/40 text-center">
                    {t('calc_privacidad')}{' '}
                    <Link to="/politica-de-privacidad" className="text-blue-prime hover:underline">Política de Privacidad</Link>.
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Preview comparativa */}
          <div className="space-y-8">
            <div>
              <h3 className="font-headline font-bold text-2xl text-navy mb-4">{t('calc_que_incluye')}</h3>
              <p className="text-dark-gray leading-relaxed">
                {t('calc_que_incluye_d')}
              </p>
            </div>

            <div className="bg-navy rounded-2xl p-8 space-y-6">
              <h4 className="text-white/60 text-xs font-label uppercase tracking-widest font-bold">{t('calc_ejemplo')}</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">{t('calc_local')}</span>
                  <span className="text-white font-headline font-bold text-xl">€2.500/mes</span>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-white/60">{t('calc_gtc')}</span>
                  <span className="text-gold font-headline font-bold text-xl">€1.200/mes</span>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-coral font-bold">{t('calc_ahorro_mes')}</span>
                  <span className="text-coral font-headline font-bold text-2xl">€1.300</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-coral font-bold">{t('calc_ahorro_anual')}</span>
                  <span className="text-coral font-headline font-bold text-2xl">€15.600</span>
                </div>
              </div>
              <div className="bg-coral/10 rounded-lg p-4 text-center">
                <span className="text-coral font-headline font-bold text-4xl">52%</span>
                <span className="text-coral/80 text-sm block">{t('calc_de_ahorro')}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {['calc_pill_1', 'calc_pill_2', 'calc_pill_3', 'calc_pill_4'].map(key => (
                <div key={key} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-blue-prime bg-blue-prime/10 border border-blue-prime/20">
                  <CheckCircle className="w-3 h-3" /> {t(key)}
                </div>
              ))}
            </div>

            <Link
              to="/contacto"
              className="inline-flex items-center gap-3 text-blue-prime font-label font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all"
            >
              {t('calc_prefiero')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
