import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { trackLead } from '@/lib/tracking'
import { getUTMs, getReferrer, getLandingUrl } from '@/lib/utm'
import { getCountry } from '@/lib/geo'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { BUDGET_MIN, withBudget } from '@/lib/budget'
import { WHATSAPP_LINK } from '@/data/chatbotData'
import { RevealSection } from '@/components/shared/RevealSection'
import SEO from '@/components/shared/SEO'
import { useT } from '@/hooks/useT'

const API_URL = import.meta.env.VITE_PLATFORM_API_URL || 'https://www.globaltalentconnections.online/api/leads/public'

const ASSISTANT_TYPES = [
  'Administrativo',
  'Marketing Digital',
  'Financiero / Contable',
  'Desarrollo Web',
  'Diseno Grafico',
  'Atencion al Cliente',
  'RRHH / Reclutamiento',
  'Otro',
]

const formSchema = z.object({
  company_name: z.string().min(2, 'Required'),
  contact_name: z.string().min(2, 'Required'),
  contact_email: z.string().email('Invalid email'),
  contact_phone: z.string().min(6, 'Required'),
  company_size: z.string().optional(),
  assistant_type: z.string().min(1, 'Required'),
  budget: z.string().min(1, 'Required'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function ContactoPage() {
  const t = useT()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async ({ budget, ...data }: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          description: withBudget(data.description, budget),
          budget_option: BUDGET_MIN[budget],
          ...getUTMs(),
          referrer: getReferrer(),
          country: getCountry(),
          source: 'web_formulario',
          landing_url: getLandingUrl(),
        }),
      })

      if (!res.ok) throw new Error('Error')
      setStatus('success')
      trackLead('contacto_form')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <SEO
        title="Contacto"
        description="Solicita tu asesoría gratuita. Te contactamos en menos de 24h para ayudarte a contratar talento remoto de alto rendimiento desde 1.200 €/mes."
        path="/contacto"
        keywords="contacto Global Talent Connections, contratar asistente virtual, asesoría talento remoto gratis, teléfono Global Talent, solicitar asistente virtual España"
        breadcrumbs={[{ name: 'Contacto', url: '/contacto' }]}
      />
      {/* HERO */}
      <section className="bg-navy pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-prime/[0.06] blur-[120px] rounded-full -mr-48 -mt-24" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <span className="text-blue-light text-xs font-label uppercase tracking-widest font-bold mb-4 block">{t('contacto_page_label')}</span>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {t('contacto_page_titulo_1')} <span className="serif-italic text-gold">{t('contacto_page_titulo_2')}</span>.
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            {t('contacto_page_subtitle')}
          </p>
        </div>
      </section>

      {/* INFO + MAPA */}
      <section className="bg-off-white py-16 lg:py-20 border-b border-border-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          {/* Datos de contacto */}
          <div>
            <span className="text-blue-prime text-xs font-label uppercase tracking-widest font-bold mb-4 block">Dónde encontrarnos</span>
            <h2 className="font-headline text-2xl md:text-3xl text-navy mb-8">
              Oficina en <span className="text-gold">Alicante, España</span>
            </h2>
            <ul className="space-y-5 text-dark-gray">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-prime/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-prime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="font-label text-xs uppercase tracking-widest text-navy/60 font-bold mb-1">{t('contacto_whatsapp')}</p>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-navy font-medium hover:text-blue-prime transition-colors">+34 689 53 98 96</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-prime/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-prime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="font-label text-xs uppercase tracking-widest text-navy/60 font-bold mb-1">Email</p>
                  <a href="mailto:info@globaltalent-connections.com" className="text-navy font-medium hover:text-blue-prime transition-colors">info@globaltalent-connections.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-prime/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-prime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-label text-xs uppercase tracking-widest text-navy/60 font-bold mb-1">Horario</p>
                  <p className="text-navy font-medium">Lunes a Viernes · 9:00 – 18:00 (CET)</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-prime/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-prime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-label text-xs uppercase tracking-widest text-navy/60 font-bold mb-1">Ubicación</p>
                  <p className="text-navy font-medium">Alicante, España</p>
                  <a
                    href="https://www.google.com/maps/search/Global+Talent+Connections+Alicante"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-prime text-sm hover:underline mt-1 inline-block"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Google Maps embed */}
          <div className="rounded-xl overflow-hidden border border-border-soft shadow-sm h-[380px]">
            <iframe
              title="Global Talent Connections — Alicante"
              src="https://maps.google.com/maps?q=Alicante,+Alicante,+Spain&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              aria-label="Mapa de ubicación de Global Talent Connections en Alicante, España"
            />
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <RevealSection className="py-20 lg:py-28 bg-off-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {status === 'success' ? (
            <div className="text-center py-20">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="font-headline text-3xl text-navy mb-4">{t('contacto_page_enviado')}</h2>
              <p className="text-dark-gray text-lg">{t('contacto_page_enviado_desc')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">
                    {t('contacto_page_empresa')}
                  </label>
                  <input
                    {...register('company_name')}
                    className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy placeholder:text-navy/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                    placeholder={t('ct_ph_empresa')}
                  />
                  {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
                </div>

                <div>
                  <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">
                    {t('contacto_page_nombre')}
                  </label>
                  <input
                    {...register('contact_name')}
                    className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy placeholder:text-navy/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                    placeholder={t('ct_ph_nombre')}
                  />
                  {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">
                    {t('contacto_email')}
                  </label>
                  <input
                    {...register('contact_email')}
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy placeholder:text-navy/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                    placeholder="email@empresa.com"
                  />
                  {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email.message}</p>}
                </div>

                <div>
                  <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">
                    {t('contacto_telefono')} *
                  </label>
                  <input
                    {...register('contact_phone')}
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy placeholder:text-navy/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                    placeholder={t('ct_ph_telefono')}
                  />
                  {errors.contact_phone && <p className="text-red-500 text-xs mt-1">{errors.contact_phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">
                    {t('contacto_page_tamano')}
                  </label>
                  <select
                    {...register('company_size')}
                    className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                  >
                    <option value="">{t('contacto_page_seleccionar')}</option>
                    <option value="1-10">{t('ct_emp_1')}</option>
                    <option value="11-50">{t('ct_emp_2')}</option>
                    <option value="51-200">{t('ct_emp_3')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">
                    {t('contacto_page_tipo')}
                  </label>
                  <select
                    {...register('assistant_type')}
                    className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                  >
                    <option value="">{t('contacto_page_seleccionar')}</option>
                    {ASSISTANT_TYPES.map(at => (
                      <option key={at} value={at}>{at}</option>
                    ))}
                  </select>
                  {errors.assistant_type && <p className="text-red-500 text-xs mt-1">{errors.assistant_type.message}</p>}
                </div>
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">
                  {t('form_presupuesto')} *
                </label>
                <select
                  {...register('budget')}
                  className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all"
                >
                  <option value="">{t('form_presupuesto_ph')}</option>
                  <option value="menos_1200">{t('form_presupuesto_1')}</option>
                  <option value="1200_2000">{t('form_presupuesto_2')}</option>
                  <option value="mas_2000">{t('form_presupuesto_3')}</option>
                </select>
                <p className="text-navy/50 text-xs mt-1">{t('form_presupuesto_hint')}</p>
                {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-widest text-navy/70 font-bold mb-2">
                  {t('contacto_page_mas')}
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border-soft bg-white text-navy placeholder:text-navy/40 focus:ring-2 focus:ring-blue-prime focus:border-blue-prime outline-none transition-all resize-none"
                  placeholder={t('ct_ph_desc')}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{t('ct_error')}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full md:w-auto bg-blue-prime text-white px-10 py-4 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-blue-deep transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-prime/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {t('contacto_page_enviar')}
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </RevealSection>
    </>
  )
}
