import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useT } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { Reveal } from '@/components/shared/EditorialReveal'

// Acá caen las direcciones que ya no existen, entre ellas las viejas de
// empleos: esta web es solo de empresas y el portal de candidatos vive en otro
// dominio. Va con `noIndex` para que Google las saque del índice en vez de
// quedárselas como páginas válidas.
export default function NotFoundPage() {
  const t = useT()
  return (
    <>
      <SEO title={t('not_found_titulo')} description={t('not_found_desc')} noIndex />
      <section className="pt-[158px] pb-[130px] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal y={0}>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">404</span>
              <span className="name">{t('not_found_titulo')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 max-w-[14ch]">
            <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(40px,6.4vw,96px)] [text-wrap:balance]">
              {t('not_found_titulo')}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[clamp(16px,1.5vw,20px)] text-ink-soft max-w-[46ch] leading-relaxed mt-7">{t('not_found_desc')}</p>
            <div className="flex gap-3.5 flex-wrap mt-12">
              <Link className="ed-btn ed-btn-primary" to="/">
                <ArrowLeft className="w-4 h-4" /> {t('not_found_cta')}
              </Link>
              <Link className="ed-btn ed-btn-outline" to="/contacto">
                {t('contacto_page_label')} <ArrowRight className="w-4 h-4 arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
