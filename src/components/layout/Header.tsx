import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useT } from '@/hooks/useT'
import logoDark from '@/assets/logos/logo-gtc-negro.png'

// Variante CANDIDATOS (rama `candidatos`, deploy gtc-empleos): portada de
// comunidad + portal de vacantes. Sin secciones de clientes ni chatbot de
// captación. Un solo destino: «Únete al equipo» decía lo mismo que
// «Oportunidades» y mandaba al mismo sitio (Ariel, 8-sep-2026).
const NAV_LINKS = [
  { key: 'nav_como_funciona', to: '/#proceso' },
  { key: 'empleos_label', to: '/empleos' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { i18n } = useTranslation()
  const t = useT()
  const currentLang = i18n.language === 'en' ? 'EN' : 'ES'

  const toggleLang = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
    localStorage.setItem('i18nextLng', newLang)
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-cream/85 backdrop-blur-xl border-b border-navy/15">
      <nav className="flex justify-between items-center px-6 lg:px-10 h-[74px] w-full max-w-[1280px] mx-auto">
        <Link to="/" className="flex items-center" aria-label="Global Talent Connections - Inicio">
          <img src={logoDark} alt="Global Talent Connections" className="h-7 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="ed-caps !text-[11px] transition-colors duration-300 text-ink-soft hover:text-coral"
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-ink-soft hover:text-ink transition-colors ed-caps !text-[10px]"
            aria-label={`Change language to ${currentLang === 'ES' ? 'English' : 'Spanish'}`}
          >
            <Globe className="w-4 h-4" />
            <span className="font-bold">{currentLang}</span>
          </button>

          <button
            className="md:hidden text-ink border border-navy/15 rounded-[10px] w-11 h-11 grid place-items-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-navy/10 px-6 pb-6">
          <div className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="ed-caps !text-[11px] py-2 text-ink-soft"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
