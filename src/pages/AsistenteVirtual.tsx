import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react'
import SEO from '@/components/shared/SEO'
import { RevealSection } from '@/components/shared/RevealSection'
import { trackLead } from '@/lib/tracking'
import { getUTMs, getReferrer, getLandingUrl } from '@/lib/utm'
import { getCountry } from '@/lib/geo'
import { BUDGET_MIN, withBudget } from '@/lib/budget'
import { WHATSAPP_LINK } from '@/data/chatbotData'
import { RESENAS_GOOGLE } from '@/data/resenasGoogle'
import logoDark from '@/assets/logos/logo-gtc-negro.png'

// Landing para tráfico de pago (Google Ads «asistente virtual»). Va FUERA del
// Layout a propósito: sin menú ni enlaces a blog/empleos, para que quien llega
// de un anuncio solo pueda hacer una cosa. Copy solo en español: los anuncios
// son para España y aquí no hay selector de idioma.

const API_URL = import.meta.env.VITE_PLATFORM_API_URL || 'https://www.globaltalentconnections.online/api/leads/public'

// Mismos números que la home (Index.tsx, «DATOS DE NEXUS»).
const STATS = { empresas: 55, profesionales: 93 }

const PERFILES = ['Administrativo', 'Marketing Digital', 'Financiero / Contable', 'Atención al Cliente', 'Ventas', 'Automatización e IA', 'Otro']

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
  ['Eliges y empieza en 5 días', 'Recibes perfiles con evidencia. Tú decides. GTC formaliza la incorporación.'],
]

const FAQ = [
  ['¿Qué incluye el precio de 1.200 €/mes?', 'El profesional dedicado en tu horario, su contratación y nómina gestionadas por GTC, y el seguimiento del equipo de Calidad. Tú recibes una única factura mensual.'],
  ['¿Hay permanencia?', 'No. Puedes parar el servicio con un preaviso. Si el perfil no encaja, lo reemplazamos sin coste.'],
  ['¿En qué horario trabaja?', 'En el tuyo. Los profesionales trabajan en horario de España, integrados en tus herramientas y tu equipo.'],
  ['¿Cuánto tarda?', 'Recibes los primeros perfiles evaluados en 5 días hábiles desde que definimos el rol contigo.'],
]

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

const RESENAS = ['Sergio Varo', 'Curro Sabán']
  .map(autor => RESENAS_GOOGLE.find(r => r.autor === autor))
  .filter((r): r is NonNullable<typeof r> => !!r && !!r.texto)

const EMPTY = { company_name: '', contact_name: '', contact_email: '', contact_phone: '', assistant_type: '', budget: '' }

function LeadForm() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const { budget, ...data } = form
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          description: withBudget(`Landing asistente virtual · Perfil: ${data.assistant_type}`, budget),
          budget_option: BUDGET_MIN[budget],
          source: 'web_formulario',
          ...getUTMs(),
          referrer: getReferrer(),
          country: getCountry(),
          landing_url: getLandingUrl(),
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      trackLead('landing_asistente_virtual')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-navy text-cream p-8 lg:p-10 rounded-[4px] text-center">
        <CheckCircle className="w-14 h-14 text-[#2fae6b] mx-auto mb-5" />
        <h3 className="font-display font-light text-3xl mb-2">Recibido.</h3>
        <p className="text-cream/65 mb-7">Te contacta una persona del equipo, no un bot. Si tienes prisa, escríbenos ahora:</p>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-primary">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form id="solicitar" onSubmit={handleSubmit} className="bg-navy text-cream p-8 lg:p-9 rounded-[4px] scroll-mt-24">
      <h3 className="font-display font-light text-[28px] leading-tight mb-1">Cuéntanos qué quieres delegar.</h3>
      <p className="text-cream/60 text-sm mb-4">Te contacta una persona del equipo, no un bot.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div className="ed-field"><label htmlFor="av-empresa">Empresa</label><input id="av-empresa" value={form.company_name} onChange={set('company_name')} placeholder="Tu empresa" autoComplete="organization" required /></div>
        <div className="ed-field"><label htmlFor="av-nombre">Nombre</label><input id="av-nombre" value={form.contact_name} onChange={set('contact_name')} placeholder="Tu nombre" autoComplete="name" required /></div>
        <div className="ed-field"><label htmlFor="av-email">Email</label><input id="av-email" type="email" value={form.contact_email} onChange={set('contact_email')} placeholder="nombre@empresa.com" autoComplete="email" spellCheck={false} required /></div>
        <div className="ed-field"><label htmlFor="av-telefono">Teléfono</label><input id="av-telefono" type="tel" value={form.contact_phone} onChange={set('contact_phone')} placeholder="+34 …" autoComplete="tel" required /></div>
      </div>
      <div className="ed-field">
        <label htmlFor="av-perfil">Perfil que buscas</label>
        <select id="av-perfil" value={form.assistant_type} onChange={set('assistant_type')} required>
          <option value="">Seleccionar área…</option>
          {PERFILES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="ed-field">
        <label htmlFor="av-presupuesto">Presupuesto mensual</label>
        <select id="av-presupuesto" value={form.budget} onChange={set('budget')} required>
          <option value="">Seleccionar…</option>
          <option value="menos_1200">Menos de 1.200 €</option>
          <option value="1200_2000">1.200 – 2.000 €</option>
          <option value="mas_2000">Más de 2.000 €</option>
        </select>
      </div>
      <p className="text-cream/50 text-xs mt-2">Nuestros perfiles empiezan en 1.200 €/mes.</p>
      {status === 'error' && (
        <div className="flex items-center gap-3 text-red-300 bg-red-500/10 p-3 rounded-lg text-sm mt-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.
        </div>
      )}
      <button type="submit" disabled={status === 'loading'} className="ed-btn ed-btn-primary w-full justify-center mt-7 disabled:opacity-50">
        {status === 'loading'
          ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <>Quiero mi propuesta <ArrowRight className="w-4 h-4 arrow" /></>}
      </button>
      <p className="text-cream/45 text-xs text-center mt-4">Sin compromiso · Sin permanencia · Datos protegidos (RGPD)</p>
    </form>
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

      <header className="border-b border-navy/15">
        <div className="max-w-[1180px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" aria-label="Global Talent Connections"><img src={logoDark} alt="Global Talent Connections" className="h-7 w-auto object-contain" /></Link>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="ed-caps !text-[11px] text-navy hover:text-coral transition-colors flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp ·</span> +34 689 53 98 96
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* HERO + FORMULARIO */}
        <section className="py-14 lg:py-16">
          <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-12 lg:gap-14 items-start">
            <div>
              <div className="flex items-center gap-4 ed-caps !text-[11px] text-sand mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2fae6b]" /> Asistentes virtuales para empresas <span>·</span> España
              </div>
              <h1 className="font-display font-light tracking-[-0.015em] leading-[1.02] text-[clamp(38px,4.6vw,64px)] mb-5 [text-wrap:balance]">
                Un profesional remoto dedicado, <em className="italic text-gold-deep">desde 1.200 € al mes.</em>
              </h1>
              <p className="text-[19px] text-ink-soft max-w-[52ch] leading-relaxed mb-6">
                Seleccionado, evaluado y en tu equipo en 5 días hábiles. Administración, finanzas, marketing o automatización con IA. Sin permanencia. Si no encaja, lo reemplazamos.
              </p>
              <div className="flex items-baseline gap-4 mb-7">
                <span className="font-display font-light text-[56px] leading-none text-navy">1.200 €<small className="text-[22px] text-ink-soft">/mes</small></span>
                <span className="text-ink-soft text-sm max-w-[26ch]">Una factura mensual. Contratación, nómina y seguimiento incluidos.</span>
              </div>
              <div className="grid grid-cols-3 border-y border-navy/15">
                {[
                  [STATS.empresas, 'Empresas activas'],
                  [STATS.profesionales, 'Profesionales trabajando'],
                  ['5,0 ★', `${RESENAS_GOOGLE.length} reseñas en Google`],
                ].map(([v, l], i) => (
                  <div key={l} className={`py-4 ${i > 0 ? 'pl-5 border-l border-navy/15' : ''}`}>
                    <div className="font-display font-light text-[30px] leading-none text-navy">{v}</div>
                    <div className="ed-caps !text-[10px] text-sand mt-2">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <LeadForm />
          </div>
        </section>

        {/* COMPARATIVA */}
        <RevealSection className="bg-cream-2 py-16 lg:py-20">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="ed-sec-tag ed-caps"><span className="idx">01</span><span className="name">Lo que cuesta de verdad</span></div>
            <h2 className="font-display font-light text-[clamp(30px,3.4vw,46px)] leading-[1.05] mt-6 mb-8 [text-wrap:balance]">
              Un empleado en España cuesta más de <em className="italic text-gold-deep">30.000 € al año.</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 border-t border-navy/15">
              <div className="py-7">
                <div className="ed-caps !text-[10px] text-sand">Administrativo en plantilla · España</div>
                <div className="font-display font-light text-[44px] leading-none text-navy mt-3 mb-2">≈ 2.500 €<span className="text-lg text-sand">/mes</span></div>
                <ul className="text-ink-soft text-sm">
                  {['Salario bruto', 'Seguridad Social a cargo de la empresa (~33 %)', 'Puesto de trabajo, equipo, formación', 'Selección, bajas, sustituciones, despido'].map(x => <li key={x} className="py-1.5 border-t border-navy/15">{x}</li>)}
                </ul>
              </div>
              <div className="hidden md:block self-center font-display italic text-sand text-2xl">frente a</div>
              <div className="py-7">
                <div className="ed-caps !text-[10px] text-sand">Mismo perfil con GTC</div>
                <div className="font-display font-light text-[44px] leading-none text-coral mt-3 mb-2">1.200 €<span className="text-lg text-sand">/mes</span></div>
                <ul className="text-ink-soft text-sm">
                  {['Profesional dedicado, en tu horario', 'Contratación y nómina las gestiona GTC', 'Seguimiento de Calidad incluido', 'Reemplazo si no encaja, sin coste'].map(x => <li key={x} className="py-1.5 border-t border-navy/15">{x}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex items-baseline gap-4 flex-wrap">
              <span className="font-display font-light text-[60px] leading-none text-coral">52 %</span>
              <span className="text-ink-soft">menos de coste al año, sin renunciar a la calidad. <Link to="/calculadora-ahorro" className="text-navy underline underline-offset-4">Calcúlalo con tus números →</Link></span>
            </div>
          </div>
        </RevealSection>

        {/* PROCESO */}
        <RevealSection className="py-16 lg:py-20">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="ed-sec-tag ed-caps"><span className="idx">02</span><span className="name">Cómo funciona</span></div>
            <h2 className="font-display font-light text-[clamp(30px,3.4vw,46px)] leading-[1.05] mt-6 mb-8">Del perfil que necesitas a una <em className="italic text-gold-deep">incorporación acompañada.</em></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-navy/15">
              {PASOS.map(([h, p], i) => (
                <div key={h} className={`py-7 pr-6 ${i > 0 ? 'md:pl-6 md:border-l border-navy/15' : ''}`}>
                  <div className="font-display italic text-coral mb-3">{['i.', 'ii.', 'iii.'][i]}</div>
                  <h4 className="font-display text-[22px] mb-2">{h}</h4>
                  <p className="text-ink-soft text-[15px]">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ÁREAS */}
        <RevealSection className="bg-cream-2 py-16 lg:py-20">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="ed-sec-tag ed-caps"><span className="idx">03</span><span className="name">Áreas</span></div>
            <h2 className="font-display font-light text-[clamp(30px,3.4vw,46px)] leading-[1.05] mt-6 mb-8">Un profesional para <em className="italic text-gold-deep">cada necesidad.</em></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-l border-navy/15">
              {AREAS.map(([n, s]) => (
                <div key={n} className="p-6 border-r border-b border-navy/15">
                  <div className="font-display text-[22px]">{n}</div>
                  <div className="ed-caps !text-[10px] text-sand mt-1">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* RESEÑAS */}
        <RevealSection className="ed-on-dark bg-gradient-to-b from-navy to-navy-deep text-cream py-16 lg:py-20">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="ed-sec-tag ed-caps"><span className="idx">04</span><span className="name">Clientes reales · reseñas verificadas en Google</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
              {RESENAS.map(r => (
                <blockquote key={r.autor}>
                  <div className="text-gold tracking-[2px] mb-3">★★★★★</div>
                  <p className="font-display font-light text-2xl leading-[1.3] mb-4">“{r.texto!.es}”</p>
                  <footer className="ed-caps !text-[10px] text-cream/55">{r.autor} · reseña en Google</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* FAQ */}
        <RevealSection className="py-16 lg:py-20">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="ed-sec-tag ed-caps"><span className="idx">05</span><span className="name">Preguntas frecuentes</span></div>
            <div className="mt-6">
              {FAQ.map(([q, a], i) => (
                <details key={q} open={i === 0} className="border-t border-navy/15 py-5 group">
                  <summary className="font-display text-[22px] cursor-pointer list-none flex justify-between items-center gap-4">{q}<span className="text-coral text-xl group-open:rotate-45 transition-transform">+</span></summary>
                  <p className="text-ink-soft mt-3 max-w-[70ch]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CTA FINAL */}
        <section className="bg-cream-2 py-16 text-center">
          <div className="max-w-[1180px] mx-auto px-6">
            <h2 className="font-display font-light text-[clamp(30px,3.4vw,46px)] leading-[1.05] mb-3">¿Qué quieres <em className="italic text-gold-deep">delegar?</em></h2>
            <p className="text-ink-soft mb-6">Desde 1.200 €/mes · Sin permanencia · Reemplazo garantizado</p>
            <a href="#solicitar" className="ed-btn ed-btn-primary">Quiero mi propuesta <ArrowRight className="w-4 h-4 arrow" /></a>
          </div>
        </section>
      </main>

      <footer className="border-t border-navy/15">
        <div className="max-w-[1180px] mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-2 ed-caps !text-[10px] !tracking-[0.18em] text-sand">
          <span>© {new Date().getFullYear()} Global Talent Connections · Alicante, España</span>
          <Link to="/politica-de-privacidad" className="hover:text-navy">Política de privacidad</Link>
        </div>
      </footer>

      {/* Barra fija en móvil */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-navy text-cream px-5 py-3 flex items-center justify-between border-t border-cream/[0.18]">
        <div>
          <div className="ed-caps !text-[9px] text-cream/55">Asistente virtual</div>
          <div className="font-display text-xl leading-none">desde 1.200 €/mes</div>
        </div>
        <a href="#solicitar" className="ed-btn ed-btn-primary !px-5 !py-3">Solicitar</a>
      </div>
    </div>
  )
}
