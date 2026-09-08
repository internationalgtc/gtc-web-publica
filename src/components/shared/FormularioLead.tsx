import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/hooks/useT'
import { enviarLead, type OrigenFormulario } from '@/lib/enviar-lead'
import { useCompanyFormTracking } from '@/lib/form-tracking'

// El formulario de empresas del sitio. UNO solo, en el sistema editorial y
// sobre navy, igual en las cuatro páginas: quien lo vio en la home lo reconoce
// en Contacto y en la landing de anuncios.
//
// Los mismos campos y las mismas reglas en todos lados. Antes cada página pedía
// cosas distintas (Contacto tamaño de empresa, la home no; el chatbot ni
// teléfono) y validaba a su manera.

/** Perfiles que ofrece GTC. Lista única: antes había tres distintas. */
const PERFILES: { valor: string; clave: string }[] = [
  { valor: 'Administrativo', clave: 'serv_admin' },
  { valor: 'Marketing Digital', clave: 'serv_marketing' },
  { valor: 'Financiero / Contable', clave: 'serv_finanzas' },
  { valor: 'Atención al Cliente', clave: 'serv_atencion' },
  { valor: 'Ventas', clave: 'home_form_ventas' },
  { valor: 'Desarrollo Web', clave: 'home_form_dev' },
  { valor: 'Automatización e IA', clave: 'serv_ia' },
  { valor: 'Otro', clave: 'home_form_otro' },
]

const PRESUPUESTOS = [
  { valor: 'menos_1200', clave: 'form_presupuesto_1' },
  { valor: '1200_1800', clave: 'form_presupuesto_2' },
  { valor: 'mas_2000', clave: 'form_presupuesto_3' },
]

const TAMANOS = [
  { valor: '1-10', clave: 'ct_emp_1' },
  { valor: '11-50', clave: 'ct_emp_2' },
  { valor: '51-200', clave: 'ct_emp_3' },
]

const VACIO = {
  company_name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  assistant_type: '',
  budget: '',
  description: '',
  company_size: '',
}

interface Props {
  /** Qué formulario es. Viaja con el lead para poder medir cuál convierte. */
  formulario: OrigenFormulario
  /** Texto del botón. Por defecto, el de la home. */
  cta?: string
  /** Pedir el tamaño de la empresa (solo en la página de contacto). */
  pedirTamano?: boolean
  /** Texto que se antepone al mensaje (la calculadora manda su resultado). */
  contexto?: string
  /** Se antepone al campo de mensaje ya escrito por la persona. */
  mensajeInicial?: string
  /** Se ejecuta al enviarse bien (la calculadora dispara su descarga acá). */
  onExito?: () => void
  /** Se muestra bajo el mensaje de éxito (el botón de descarga del Excel). */
  exitoExtra?: ReactNode
  /** Ocultar el campo de perfil: lo fija la página (calculadora). */
  perfilFijo?: string
}

export function FormularioLead({ formulario, cta, pedirTamano = false, contexto, mensajeInicial, onExito, exitoExtra, perfilFijo }: Props) {
  const t = useT()
  const { trackComplete } = useCompanyFormTracking(formulario)
  const [form, setForm] = useState({ ...VACIO, description: mensajeInicial || '', assistant_type: perfilFijo || '' })
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle')
  const set = (campo: keyof typeof VACIO) => (e: { target: { value: string } }) =>
    setForm(f => ({ ...f, [campo]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (estado === 'enviando') return
    // Trampa para robots: invisible para una persona, la rellena un bot. Si
    // viene con algo, se le responde que salió bien y no se manda nada.
    const trampa = (document.getElementById(`gtc-web-${formulario}`) as HTMLInputElement)?.value
    if (trampa) { setEstado('ok'); return }
    setEstado('enviando')
    try {
      await enviarLead(
        { ...form, description: [contexto, form.description].filter(Boolean).join('\n\n') },
        formulario,
      )
      trackComplete()
      setEstado('ok')
      onExito?.()
    } catch {
      setEstado('error')
    }
  }

  if (estado === 'ok') {
    return (
      <div className="ed-on-dark py-4">
        <div className="ed-caps !text-[10px] text-cream/40">{t('form_ok_label')}</div>
        <p className="font-display text-[clamp(24px,2.4vw,32px)] leading-snug text-cream mt-5">{t('form_ok_titulo')}</p>
        <p className="text-[14.5px] text-cream/60 leading-relaxed mt-4 max-w-[44ch]">{t('form_ok_desc')}</p>
        {exitoExtra && <div className="mt-8">{exitoExtra}</div>}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px] h-0 overflow-hidden opacity-0">
        <label htmlFor={`gtc-web-${formulario}`}>Website</label>
        <input type="text" id={`gtc-web-${formulario}`} name="website" autoComplete="off" tabIndex={-1} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[34px]">
        <div className="ed-field">
          <label htmlFor={`${formulario}-empresa`}>{t('home_form_empresa')}</label>
          <input id={`${formulario}-empresa`} value={form.company_name} onChange={set('company_name')} placeholder={t('home_form_empresa_ph')} autoComplete="organization" required />
        </div>
        <div className="ed-field">
          <label htmlFor={`${formulario}-nombre`}>{t('home_form_nombre')}</label>
          <input id={`${formulario}-nombre`} value={form.contact_name} onChange={set('contact_name')} placeholder={t('home_form_nombre_ph')} autoComplete="name" required />
        </div>
        <div className="ed-field">
          <label htmlFor={`${formulario}-email`}>Email</label>
          <input id={`${formulario}-email`} type="email" value={form.contact_email} onChange={set('contact_email')} placeholder={t('home_form_email_ph')} autoComplete="email" spellCheck={false} required />
        </div>
        <div className="ed-field">
          <label htmlFor={`${formulario}-telefono`}>{t('home_form_telefono')}</label>
          <input id={`${formulario}-telefono`} type="tel" value={form.contact_phone} onChange={set('contact_phone')} placeholder={t('home_form_telefono_ph')} autoComplete="tel" required />
        </div>
        {!perfilFijo && (
          <div className="ed-field">
            <label htmlFor={`${formulario}-perfil`}>{t('home_form_perfil')}</label>
            <select id={`${formulario}-perfil`} value={form.assistant_type} onChange={set('assistant_type')} required>
              <option value="">{t('home_form_perfil_ph')}</option>
              {PERFILES.map(p => <option key={p.valor} value={p.valor}>{t(p.clave)}</option>)}
            </select>
          </div>
        )}
        <div className="ed-field">
          <label htmlFor={`${formulario}-presupuesto`}>{t('form_presupuesto')}</label>
          <select id={`${formulario}-presupuesto`} value={form.budget} onChange={set('budget')} required>
            <option value="">{t('form_presupuesto_ph')}</option>
            {PRESUPUESTOS.map(b => <option key={b.valor} value={b.valor}>{t(b.clave)}</option>)}
          </select>
        </div>
        {pedirTamano && (
          <div className="ed-field">
            <label htmlFor={`${formulario}-tamano`}>{t('contacto_page_tamano')}</label>
            <select id={`${formulario}-tamano`} value={form.company_size} onChange={set('company_size')}>
              <option value="">{t('contacto_page_seleccionar')}</option>
              {TAMANOS.map(s => <option key={s.valor} value={s.valor}>{t(s.clave)}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="ed-field">
        <label htmlFor={`${formulario}-mensaje`}>{t('contacto_page_mas')}</label>
        <input id={`${formulario}-mensaje`} value={form.description} onChange={set('description')} placeholder={t('ct_ph_desc')} />
      </div>

      <p className="ed-caps !text-[9.5px] !tracking-[0.16em] text-cream/35 mt-6">{t('form_presupuesto_hint')}</p>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <button type="submit" className="ed-btn ed-btn-primary" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? t('form_enviando') : (cta || t('home_form_cta'))}
          <ArrowRight className="w-4 h-4 arrow" />
        </button>
        {estado === 'error' && <p className="text-[13.5px] text-coral">{t('form_error')}</p>}
      </div>
    </form>
  )
}
