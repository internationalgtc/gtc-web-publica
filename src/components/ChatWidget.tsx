import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { WHATSAPP_LINK } from '@/data/chatbotData'

const CLIENT_FORM_URL = 'https://www.globaltalentconnections.online/solicitar-asistente?origen=chatbot&utm_source=web&utm_medium=chatbot&utm_campaign=chatbot-web&utm_content=form%3Achatbot'

export default function ChatWidget() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'
  const [isOpen, setIsOpen] = useState(false)
  const [showBadge, setShowBadge] = useState(true)
  // /asistente-virtual tiene una barra fija abajo (su tope a 72px, solo por debajo de lg) con el
  // botón «Solicitar»: el chat, a 24px del borde, lo tapaba. Ahí sube por encima de la
  // barra; en el resto de páginas y desde lg queda exactamente donde estaba.
  const { pathname } = useLocation()
  const sobreBarraMovil = pathname.replace(/\/+$/, '') === '/asistente-virtual'

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeWithEscape)
    return () => window.removeEventListener('keydown', closeWithEscape)
  }, [])

  const open = () => {
    setIsOpen(true)
    setShowBadge(false)
  }

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gtc-help-title"
        className={`fixed z-[100] ${sobreBarraMovil ? 'bottom-[152px] lg:bottom-[84px]' : 'bottom-[84px]'} right-4 left-4 overflow-hidden rounded-2xl border border-navy/10 bg-cream shadow-2xl sm:left-auto sm:right-6 sm:w-[420px]
          transition-all duration-200 ease-out
          ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ transformOrigin: 'bottom right' }}
      >
        <header className="flex items-center gap-3 bg-navy px-5 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-coral font-label text-sm font-bold text-white">G</div>
          <div className="min-w-0 flex-1">
            <p id="gtc-help-title" className="font-label text-sm font-semibold text-white">
              {lang === 'en' ? 'Tell us what you need' : 'Cuéntanos qué necesitas'}
            </p>
            <p className="font-body text-xs text-blue-light">
              {lang === 'en' ? 'For companies looking to hire' : 'Para empresas que buscan contratar'}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={lang === 'en' ? 'Close' : 'Cerrar'}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-6">
          <p className="font-display text-[28px] leading-tight text-navy">
            {lang === 'en' ? 'What profile does your company need?' : '¿Qué perfil necesita tu empresa?'}
          </p>
          <p className="mt-3 font-body text-sm leading-relaxed text-dark-gray">
            {lang === 'en'
              ? 'Complete the request and our team will contact you with the right remote talent.'
              : 'Completa la solicitud y nuestro equipo te contactará con el talento remoto adecuado.'}
          </p>

          <div className="mt-6 grid gap-3">
            <a
              href={CLIENT_FORM_URL}
              className="group flex items-center gap-4 rounded-xl bg-navy p-4 text-white transition-transform active:scale-[.98]"
            >
              <BriefcaseBusiness className="h-5 w-5 flex-shrink-0 text-coral" />
              <span className="flex-1">
                <span className="block font-label text-xs font-bold uppercase tracking-[.14em]">
                  {lang === 'en' ? 'Request talent' : 'Solicitar talento'}
                </span>
                <span className="mt-1 block font-body text-xs text-white/60">
                  {lang === 'en' ? 'Complete the company request' : 'Completar la solicitud de empresa'}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

          </div>
        </div>
      </div>

      {/*
        WhatsApp, apilado encima del botón de ayuda (bottom-6 + h-14 = 80px, y 8 de aire).
        En /asistente-virtual sube al mismo escalón que el panel, porque ahí el botón de ayuda
        se corre por la barra fija de mobile y si no se le montaba encima.
        Se esconde con el panel abierto: el panel le pasaría por arriba igual.
        Es un <a> y no un <button>: tiene que poder abrirse en otra pestaña y copiarse el enlace.
      */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={lang === 'en' ? 'Message us on WhatsApp' : 'Escríbenos por WhatsApp'}
        className={`fixed ${sobreBarraMovil ? 'bottom-[152px] lg:bottom-[88px]' : 'bottom-[88px]'} right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none
          ${isOpen ? 'pointer-events-none scale-95 opacity-0' : 'pointer-events-auto scale-100 opacity-100'}`}
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.58-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <button
        onClick={isOpen ? () => setIsOpen(false) : open}
        aria-label={lang === 'en' ? 'Open help' : 'Abrir ayuda'}
        className={`fixed ${sobreBarraMovil ? 'bottom-[84px] lg:bottom-6' : 'bottom-6'} right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white shadow-2xl transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none`}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
        {showBadge && !isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex">
            <span className="absolute h-4 w-4 animate-ping rounded-full bg-navy opacity-75" />
            <span className="relative flex h-4 w-4 rounded-full border-2 border-white bg-navy" />
          </span>
        )}
      </button>
    </>
  )
}
