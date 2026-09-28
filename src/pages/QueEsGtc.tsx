import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SEO from '@/components/shared/SEO'
import { useT, useLang } from '@/hooks/useT'
import { queEsGtc } from '@/data/queEsGtc'

// Página corta pedida en el informe SEO/GEO (28-sep-2026): una sola
// definición de GTC, la misma que publica /llms.txt.
export default function QueEsGtc() {
  const t = useT()
  const lang = useLang()
  const { definicion, datos } = queEsGtc(t, lang)

  return (
    <>
      <SEO title={t('que_es_titulo')} description={definicion} path="/que-es-gtc" />
      <section className="pt-[158px] pb-[110px]">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10">
          <div className="ed-sec-tag ed-caps">
            <span className="name">{t('que_es_label')}</span>
          </div>
          <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.05] text-[clamp(38px,5.4vw,72px)] mt-10">
            {t('que_es_titulo')}
          </h1>
          <p className="text-[clamp(17px,1.5vw,21px)] text-ink-soft leading-relaxed mt-8 max-w-[60ch]">{definicion}</p>

          <h2 className="ed-caps !text-[11px] text-ink-soft mt-16">{t('que_es_datos')}</h2>
          <ul className="mt-4">
            {datos.map(dato => (
              <li key={dato} className="border-t border-navy/15 py-5 leading-relaxed max-w-[70ch]">{dato}</li>
            ))}
          </ul>

          <div className="flex gap-3.5 flex-wrap mt-12">
            <Link className="ed-btn ed-btn-primary" to="/contacto">
              {t('home_hero_cta_primary')} <ArrowRight className="w-4 h-4 arrow" />
            </Link>
            <Link className="ed-btn ed-btn-outline" to="/asistente-virtual">
              {t('que_es_ver_precio')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
