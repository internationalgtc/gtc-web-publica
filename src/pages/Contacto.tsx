import { Reveal } from '@/components/shared/EditorialReveal'
import { FormularioLead } from '@/components/shared/FormularioLead'
import { useT } from '@/hooks/useT'
import { WHATSAPP_LINK } from '@/data/chatbotData'
import SEO from '@/components/shared/SEO'

// Página de contacto — sistema editorial, mismo formulario que el resto del
// sitio (8-sep-2026). Antes tenía su propio formulario con react-hook-form,
// su propia validación y el diseño anterior de tarjetas y sombras: dos caras
// para el mismo pedido.

const CONTACTOS: { clave: string; valor: string; href?: string }[] = [
  { clave: 'contacto_whatsapp', valor: '+34 689 53 98 96', href: WHATSAPP_LINK },
  { clave: 'contacto_email_label', valor: 'info@globaltalent-connections.com', href: 'mailto:info@globaltalent-connections.com' },
  { clave: 'contacto_horario_label', valor: 'Lunes a viernes · 9:00 – 18:00 (CET)' },
  { clave: 'contacto_ubicacion_label', valor: 'Alicante, España', href: 'https://www.google.com/maps/search/Global+Talent+Connections+Alicante' },
]

export default function Contacto() {
  const t = useT()

  return (
    <>
      <SEO
        title="Contacto"
        description="Cuéntanos qué perfil necesitas. En menos de 48 horas te presentamos candidatos preseleccionados. Asistentes remotos desde 1.200 €/mes."
        path="/contacto"
      />

      {/* CABECERA */}
      <section className="pt-[158px] pb-[64px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal y={0}>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">✳</span>
              <span className="name">{t('contacto_page_label')}</span>
              <span className="meta hidden sm:inline">{t('contacto_page_meta')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 max-w-[15ch]">
            <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(40px,6.4vw,96px)] [text-wrap:balance]">
              {t('contacto_page_titulo_1')} <em className="italic text-gold-deep">{t('contacto_page_titulo_2')}</em>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[clamp(16px,1.5vw,20px)] text-ink-soft max-w-[52ch] leading-relaxed mt-7">
              {t('contacto_page_subtitle')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FORMULARIO + DATOS DE CONTACTO */}
      <section className="pb-[130px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-x-20 gap-y-14">
            <Reveal>
              <div className="ed-on-dark bg-gradient-to-b from-navy to-navy-deep text-cream p-8 lg:p-11">
                <div className="ed-sec-tag ed-caps">
                  <span className="idx">01</span>
                  <span className="name">{t('contacto_form_label')}</span>
                </div>
                <div className="mt-8">
                  <FormularioLead formulario="contacto" pedirTamano cta={t('contacto_page_enviar')} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="ed-sec-tag ed-caps">
                <span className="idx">02</span>
                <span className="name">{t('contacto_directo_label')}</span>
              </div>
              <dl className="mt-8">
                {CONTACTOS.map(c => (
                  <div key={c.clave} className="py-5 border-b border-navy/15">
                    <dt className="ed-caps !text-[9.5px] !tracking-[0.16em] text-sand">{t(c.clave)}</dt>
                    <dd className="font-display text-[clamp(17px,1.5vw,20px)] text-ink mt-1.5 break-words">
                      {c.href ? (
                        <a href={c.href} target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors duration-300">
                          {c.valor}
                        </a>
                      ) : c.valor}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-[13.5px] text-sand leading-relaxed mt-7">{t('contacto_nota_respuesta')}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
