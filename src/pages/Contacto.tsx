import { Reveal } from '@/components/shared/EditorialReveal'
import { Img3D, SecTag, TituloEntrada, Wrap } from '@/components/shared/EditorialPiezas'
import { FormularioLead } from '@/components/shared/FormularioLead'
import { useT } from '@/hooks/useT'
import { TELEFONO, TEL_LINK, WHATSAPP_LINK } from '@/data/contacto'
import { trackContacto } from '@/lib/tracking'
import SEO from '@/components/shared/SEO'

/* Contacto — rediseño «A · Revista» (28-sep-2026), lienzo A-contacto.
   El formulario es el de siempre (FormularioLead con «Tamaño de empresa»:
   envío a Nexus + UTM/referrer/geo + tracking); acá solo cambia el contenedor.
   Teléfono y WhatsApp salen de src/data/contacto.ts. */

const EMAIL = 'info@globaltalent-connections.com'
const PROMESAS = ['home_check_1', 'home_check_2', 'home_check_3']
const ROMANOS = ['i.', 'ii.', 'iii.']

function Encabezado() {
  const t = useT()
  return (
    <section className="pt-[112px] sm:pt-[140px] lg:pt-[184px] pb-14 lg:pb-20 border-b border-navy/15">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 lg:gap-14 items-end">
        <Reveal y={0}>
          <div className="ed-label flex flex-wrap gap-x-3.5 gap-y-1 text-ink-soft lg:pb-[18px]">
            <span className="font-semibold text-navy">{t('contacto_page_label')}</span>
            <span>· {t('contacto_page_meta')}</span>
          </div>
        </Reveal>
        <div className="flex flex-col gap-6 lg:gap-[30px]">
          <TituloEntrada
            className="ed-serif font-[320] text-navy leading-[0.98] tracking-[-0.025em] text-[clamp(44px,12vw,64px)] sm:text-[clamp(64px,10vw,88px)] lg:text-[clamp(80px,7.8vw,112px)] [text-wrap:balance]"
            tramos={[{ texto: t('contacto_page_titulo_1') }, { texto: `${t('contacto_page_titulo_2')}.`, subraya: true }]}
          />
          <Reveal delay={0.5} y={26}>
            <p className="max-w-[34em] text-[17px] sm:text-[19px] lg:text-[21px] leading-[1.55] text-ink-soft [text-wrap:pretty]">
              {t('contacto_page_subtitle')}
            </p>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}

/* ——— 01 FORMULARIO ——— */
function Formulario() {
  const t = useT()
  return (
    <section id="formulario" className="pt-16 lg:pt-[100px] pb-20 lg:pb-[110px]">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] gap-10 lg:gap-[72px] items-start">
        <Reveal className="flex flex-col gap-6 lg:gap-[26px]">
          <SecTag n="01" name={t('contacto_form_label')} />
          <h2 className="ed-serif font-[320] text-navy leading-[1.02] tracking-[-0.02em] text-[clamp(36px,4.6vw,64px)] [text-wrap:balance]">
            {t('contacto_h2_a')} <span className="ed-serif-it">{t('contacto_h2_b')}</span>
          </h2>
          <ol className="mt-2 lg:mt-3.5 flex flex-col border-t border-navy/20">
            {PROMESAS.map((key, i) => (
              <li key={key} className="grid grid-cols-[36px_minmax(0,1fr)] lg:grid-cols-[44px_minmax(0,1fr)] gap-2 py-4 lg:py-5 border-b border-navy/20 text-[17px] lg:text-[19px] text-navy">
                <span className="ed-serif-it text-ink-soft">{ROMANOS[i]}</span>
                {t(key)}
              </li>
            ))}
          </ol>
          <Img3D src="/img/3d/seleccion.webp" className="ed-3d hidden lg:block w-full h-[300px] object-cover mt-2" />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="ed-form-blanca bg-white text-ink border border-navy/10 rounded-[24px] lg:rounded-[30px] p-5 sm:p-8 lg:p-12 shadow-[0_40px_80px_-52px_rgba(6,46,85,0.45)]">
            <FormularioLead formulario="contacto" pedirTamano tono="claro" cta={t('contacto_page_enviar')} />
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

/* ——— 02 HABLAR DIRECTO ——— */
function Directo() {
  const t = useT()
  const celda = 'flex flex-col gap-2 py-6 lg:py-[26px] border-b border-cream/20'
  const etiqueta = 'ed-label text-cream/70'
  const enlace = 'ed-serif text-cream no-underline hover:text-gold transition-colors duration-300 break-words'
  return (
    <section id="directo" className="bg-navy text-cream py-20 lg:py-[120px] overflow-hidden">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 lg:gap-[72px] items-center">
        <Reveal className="flex flex-col gap-7 lg:gap-[34px]">
          <SecTag dark n="02" name={t('contacto_directo_label')} />
          <h2 className="ed-serif font-light leading-[1.02] tracking-[-0.02em] text-[clamp(38px,5.6vw,80px)] [text-wrap:balance]">
            {t('contacto_directo_h2_a')} <span className="ed-serif-it text-gold">{t('contacto_directo_h2_b')}</span>
          </h2>
          <p className="max-w-[30em] text-[17px] lg:text-[20px] leading-[1.55] text-cream/85">{t('contacto_directo_p')}</p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 border-t border-cream/20">
            <div className={`${celda} sm:pr-6`}>
              <dt className={etiqueta}>{t('contacto_tel_whatsapp_label')}</dt>
              <dd className="flex flex-col gap-1">
                <a href={TEL_LINK} onClick={() => trackContacto('telefono', 'contacto')} className={`${enlace} text-[clamp(26px,2.3vw,32px)] self-start min-h-[44px] inline-flex items-center`}>
                  {TELEFONO}
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContacto('whatsapp', 'contacto')}
                  className="self-start min-h-[44px] inline-flex items-center font-label font-semibold text-[15px] text-gold no-underline hover:text-cream transition-colors duration-300"
                >
                  {t('contacto_whatsapp_cta')} <span aria-hidden="true">&nbsp;→</span>
                </a>
              </dd>
            </div>
            <div className={`${celda} sm:pl-6 sm:border-l`}>
              <dt className={etiqueta}>{t('contacto_email_label')}</dt>
              <dd>
                <a href={`mailto:${EMAIL}`} onClick={() => trackContacto('email', 'contacto')} className={`${enlace} text-[18px] sm:text-[20px] lg:text-[18px] min-h-[44px] inline-flex items-center`}>
                  {EMAIL}
                </a>
              </dd>
            </div>
            <div className={`${celda} sm:border-b-0 sm:pr-6`}>
              <dt className={etiqueta}>{t('contacto_horario_label')}</dt>
              <dd className="ed-serif text-[clamp(20px,1.7vw,24px)]">{t('contacto_horario_valor')}</dd>
            </div>
            <div className={`${celda} border-b-0 sm:pl-6 sm:border-l`}>
              <dt className={etiqueta}>{t('contacto_ubicacion_label')}</dt>
              <dd>
                <a
                  href="https://www.google.com/maps/search/Global+Talent+Connections+Alicante"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${enlace} text-[clamp(20px,1.7vw,24px)] min-h-[44px] inline-flex items-center`}
                >
                  {t('contacto_ubicacion_valor')}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.15} y={0}>
          <Img3D src="/img/3d/conexion-navy.webp" className="ed-3d-navy w-full h-[200px] sm:h-[300px] lg:h-[520px] object-cover" />
        </Reveal>
      </Wrap>
    </section>
  )
}

export default function Contacto() {
  return (
    <div className="bg-cream text-ink">
      <SEO
        title="Contacto"
        description="Cuéntanos qué perfil necesitas. En 5 días hábiles te presentamos candidatos preseleccionados. Asistentes remotos desde 1.200 €/mes."
        path="/contacto"
      />
      <Encabezado />
      <Formulario />
      <Directo />
    </div>
  )
}
