import { Link } from 'react-router-dom'
import logoWhite from '@/assets/logos/logo-gtc-blanco.png'
import { useT } from '@/hooks/useT'

// Variante CANDIDATOS (rama `candidatos`, deploy gtc-empleos): footer reducido
// a lo que le sirve a quien busca empleo. Sin enlaces a páginas de clientes.
// Rediseño «A · Revista» (lienzo A-portal-2): Portal · Artículos · Contacto.
export function Footer() {
  const t = useT()
  const enlace = 'text-cream/80 hover:text-coral transition-colors text-[15px]'
  return (
    <footer className="bg-navy-deep text-cream pt-16 lg:pt-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-[72px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] gap-10 lg:gap-12 pb-14 lg:pb-[56px]">
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <img src={logoWhite} alt="Global Talent Connections" className="h-[34px] lg:h-[42px] w-auto self-start" loading="lazy" />
            <p className="ed-serif-it text-[20px] lg:text-[24px] leading-[1.35] text-cream max-w-[19em]">{t('beneficios_subtitle')}</p>
          </div>

          <nav aria-label={t('footer_portal')} className="flex flex-col gap-3">
            <h2 className="ed-label text-cream/50 mb-1">{t('footer_portal')}</h2>
            <Link className={enlace} to="/empleos">{t('empleos_label')}</Link>
            <Link className={enlace} to="/#proceso">{t('nav_como_funciona')}</Link>
            <Link className={enlace} to="/#comunidad">{t('cand_sec_comunidad')}</Link>
          </nav>

          <nav aria-label={t('footer_articulos')} className="flex flex-col gap-3">
            <h2 className="ed-label text-cream/50 mb-1">{t('footer_articulos')}</h2>
            <Link className={enlace} to="/blog/herramientas-vacantes-internacionales">{t('footer_art_herramientas')}</Link>
            <Link className={enlace} to="/blog/oferta-trabajo-remoto-confiable-estafa">{t('footer_art_estafa')}</Link>
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="ed-label text-cream/50 mb-1">{t('footer_contacto')}</h2>
            <a className={`${enlace} break-words`} href="mailto:info@globaltalent-connections.com">info@globaltalent-connections.com</a>
            <a className={enlace} href="https://linkedin.com/company/global-talent-connections-limited" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 py-[26px] border-t border-cream/15 text-[14px] text-cream/80">
          <p>{t('footer_derechos')}</p>
          <Link className="text-cream/80 underline underline-offset-4 hover:text-cream transition-colors" to="/politica-de-privacidad">
            {t('footer_privacidad')}
          </Link>
        </div>
      </div>
      <div className="ed-foot-word" aria-hidden="true">Global Talent</div>
    </footer>
  )
}
