import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Globe, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useT } from '@/hooks/useT'
import logoDark from '@/assets/logos/logo-gtc-negro.png'

// Variante CANDIDATOS (rama `candidatos`, deploy gtc-empleos): portada de
// comunidad + portal de vacantes. Sin secciones de clientes ni chatbot de
// captación. Rediseño «A · Revista» (lienzo A-portal, 28-sep-2026): logo +
// «Portal de empleos», secciones de la portada y botón «Ver oportunidades».
// «Oportunidades» sigue llevando a la bolsa (/empleos), como antes.
const SECCIONES = [
  { key: 'nav_como_funciona', id: 'proceso' },
  { key: 'cand_sec_comunidad', id: 'comunidad' },
  { key: 'nav_contacto', id: 'contacto' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const t = useT()
  const currentLang = i18n.language === 'en' ? 'EN' : 'ES'

  const toggleLang = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
    localStorage.setItem('i18nextLng', newLang)
  }

  const irASeccion = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${id}`)
    }
  }

  const enlace = 'ed-label transition-colors duration-300 text-ink hover:text-coral'

  return (
    <header className="fixed top-0 w-full z-50 bg-cream/85 backdrop-blur-xl border-b border-navy/15">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-coral text-navy px-4 py-2 rounded-md z-[60]">
        {i18n.language === 'en' ? 'Skip to content' : 'Ir al contenido'}
      </a>

      <nav className="flex justify-between items-center gap-4 px-5 sm:px-8 lg:px-[72px] h-[74px] w-full max-w-[1440px] mx-auto">
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 min-w-0" aria-label={t('portal_inicio_aria')}>
          <img src={logoDark} alt="Global Talent Connections" className="h-7 lg:h-8 w-auto object-contain shrink-0" />
          <span className="ed-label text-ink-soft border-l border-navy/25 pl-2.5 sm:pl-3.5 whitespace-nowrap">
            <span className="sm:hidden">{t('portal_label_corto')}</span>
            <span className="hidden sm:inline">{t('portal_label')}</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 xl:gap-[38px]">
          <Link to="/empleos" className={enlace}>
            {t('empleos_label')}
          </Link>
          {SECCIONES.map(s => (
            <a key={s.id} href={`/#${s.id}`} onClick={irASeccion(s.id)} className={enlace}>
              {t(s.key)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-ink-soft hover:text-ink transition-colors ed-caps !text-[10px] min-h-[44px]"
            aria-label={`Change language to ${currentLang === 'ES' ? 'English' : 'Spanish'}`}
          >
            <Globe className="w-4 h-4" />
            <span className="font-bold">{currentLang}</span>
          </button>
          <Link to="/empleos" className="hidden lg:inline-flex ed-pill bg-coral text-navy hover:bg-coral-hover hover:text-navy !min-h-[46px] !py-3 !px-[22px] !text-[15px]">
            {t('cand_cta_primary')} <ArrowRight className="w-4 h-4 arrow" aria-hidden="true" />
          </Link>

          <button
            className="lg:hidden text-navy border border-navy/25 rounded-full w-11 h-11 grid place-items-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden bg-cream border-t border-navy/10 px-5 sm:px-8 pb-6">
          <div className="flex flex-col gap-2 pt-4">
            <Link to="/empleos" onClick={() => setMenuOpen(false)} className="ed-label py-3 text-ink">
              {t('empleos_label')}
            </Link>
            {SECCIONES.map(s => (
              <a key={s.id} href={`/#${s.id}`} onClick={irASeccion(s.id)} className="ed-label py-3 text-ink">
                {t(s.key)}
              </a>
            ))}
            <Link
              to="/empleos"
              onClick={() => setMenuOpen(false)}
              className="ed-pill bg-coral text-navy hover:bg-coral-hover hover:text-navy mt-2"
            >
              {t('cand_cta_primary')} <ArrowRight className="w-4 h-4 arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
