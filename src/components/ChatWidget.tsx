import { useEffect, useState } from 'react'
import { ArrowRight, BriefcaseBusiness } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CLIENT_FORM_URL = 'https://www.globaltalentconnections.online/solicitar-asistente?origen=chatbot&utm_source=web&utm_medium=chatbot&utm_campaign=chatbot-web&utm_content=form%3Achatbot'

export default function ChatWidget() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'
  const [isOpen, setIsOpen] = useState(false)
  const [showBadge, setShowBadge] = useState(true)

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
        className={`fixed z-[100] bottom-[84px] right-4 left-4 overflow-hidden rounded-2xl border border-navy/10 bg-cream shadow-2xl sm:left-auto sm:right-6 sm:w-[420px]
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

      <button
        onClick={isOpen ? () => setIsOpen(false) : open}
        aria-label={lang === 'en' ? 'Open help' : 'Abrir ayuda'}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white shadow-2xl transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none"
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
