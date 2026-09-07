import { Link } from 'react-router-dom'
import logoWhite from '@/assets/logos/logo-gtc-blanco.png'
import { useT } from '@/hooks/useT'

// Variante CANDIDATOS (rama `candidatos`, deploy gtc-empleos): footer reducido
// a lo que le sirve a quien busca empleo. Sin enlaces a páginas de clientes.
export function Footer() {
  const t = useT()
  return (
    <footer className="bg-navy-deep text-cream pt-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] gap-11 pb-[70px]">
          <div className="sm:col-span-2 md:col-span-1">
            <img src={logoWhite} alt="Global Talent Connections" className="h-[26px] w-auto mb-[18px]" loading="lazy" />
            <p className="text-[13.5px] text-cream/50 max-w-[28ch] leading-relaxed">
              {t('beneficios_subtitle')}
            </p>
          </div>

          <div>
            <h5 className="ed-caps !text-[10px] text-cream/40 mb-5">{t('footer_portal')}</h5>
            <ul className="space-y-3">
              <li><Link className="text-cream/70 hover:text-coral transition-colors text-sm" to="/empleos">{t('empleos_label')}</Link></li>
              <li><Link className="text-cream/70 hover:text-coral transition-colors text-sm" to="/#proceso">{t('nav_como_funciona')}</Link></li>
              <li><Link className="text-cream/70 hover:text-coral transition-colors text-sm" to="/#comunidad">{t('cand_sec_comunidad')}</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="ed-caps !text-[10px] text-cream/40 mb-5">{t('footer_contacto')}</h5>
            <ul className="space-y-3">
              <li><a className="text-cream/70 hover:text-coral transition-colors text-sm break-words" href="mailto:info@globaltalent-connections.com">info@globaltalent-connections.com</a></li>
              <li><a className="text-cream/70 hover:text-coral transition-colors text-sm" href="https://linkedin.com/company/global-talent-connections-limited" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 py-[22px] border-t border-cream/[0.18] ed-caps !text-[10px] !tracking-[0.18em] text-cream/35">
          <p>{t('footer_derechos')}</p>
          <Link className="hover:text-cream transition-colors" to="/politica-de-privacidad">
            {t('footer_privacidad')}
          </Link>
        </div>
      </div>
      <div className="ed-foot-word" aria-hidden="true">Global Talent</div>
    </footer>
  )
}
