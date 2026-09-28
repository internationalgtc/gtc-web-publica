import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SEO from '@/components/shared/SEO'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'
import { Img3D, TituloEntrada, Wrap, ultimaPalabra } from '@/components/shared/EditorialPiezas'
import { useT, useLang } from '@/hooks/useT'
import { queEsGtc } from '@/data/queEsGtc'

// Página corta pedida en el informe SEO/GEO (28-sep-2026): una sola
// definición de GTC, la misma que publica /llms.txt (src/data/queEsGtc.ts).
// Diseño «A · Revista», lienzo A-que-es-gtc.
export default function QueEsGtc() {
  const t = useT()
  const lang = useLang()
  const { definicion, datos } = queEsGtc(t, lang)
  const [tituloInicio, tituloFinal] = ultimaPalabra(t('que_es_titulo'))

  return (
    <div className="bg-cream text-ink">
      <SEO title={t('que_es_titulo')} description={definicion} path="/que-es-gtc" />

      <section className="pt-[112px] sm:pt-[140px] lg:pt-[184px] pb-12 lg:pb-[90px]">
        <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 lg:gap-12 items-center">
          <div className="flex flex-col">
            <Reveal y={0}>
              <div className="ed-label flex flex-wrap gap-x-3.5 gap-y-1 pb-3.5 border-b border-navy/15 text-ink-soft">
                <span className="font-semibold text-navy">{t('que_es_label')}</span>
                <span>· {t('que_es_meta')}</span>
              </div>
            </Reveal>
            <TituloEntrada
              className="ed-serif font-[330] text-navy leading-[0.98] tracking-[-0.025em] mt-10 lg:mt-[52px] text-[clamp(42px,11.4vw,60px)] sm:text-[clamp(60px,9vw,84px)] lg:text-[clamp(72px,7.2vw,104px)] [text-wrap:balance]"
              tramos={[{ texto: tituloInicio }, { texto: tituloFinal, subraya: true }]}
            />
            <Reveal delay={0.6} y={26}>
              <p className="ed-serif font-[340] mt-8 lg:mt-11 max-w-[25em] text-ink leading-[1.4] text-[clamp(20px,2.1vw,30px)] [text-wrap:pretty]">{definicion}</p>
            </Reveal>
          </div>
          <Reveal delay={0.3} y={0}>
            <Img3D primero src="/img/3d/conexion-crema.webp" className="ed-3d w-full h-[240px] sm:h-[340px] lg:h-[500px] object-cover" />
          </Reveal>
        </Wrap>
      </section>

      {/* 01 · EN POCAS PALABRAS */}
      <section id="datos" className="pt-6 lg:pt-10 pb-10">
        <Wrap>
          <Reveal className="bg-navy text-cream rounded-[28px] lg:rounded-[36px] px-5 py-10 sm:p-10 lg:px-[72px] lg:py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] gap-8 lg:gap-16">
            <div className="flex flex-col gap-5 lg:gap-[22px]">
              <div className="ed-label text-cream/70">
                <span className="font-semibold text-gold">01</span> · {t('que_es_datos')}
              </div>
              <h2 className="ed-serif font-light leading-[1.04] tracking-[-0.02em] text-[clamp(36px,4.4vw,64px)] [text-wrap:balance]">
                {t('que_es_h2_a')} <span className="ed-serif-it text-gold">{t('que_es_h2_b')}</span>
              </h2>
            </div>
            <RevealGroup className="border-t border-cream/20">
              <ol className="list-none m-0 p-0">
                {datos.map((dato, i) => (
                  <li key={dato}>
                    <RevealItem className="grid grid-cols-[44px_minmax(0,1fr)] lg:grid-cols-[70px_minmax(0,1fr)] py-5 lg:py-6 border-b border-cream/20">
                      <span className="ed-serif text-base lg:text-xl text-gold pt-1">{String(i + 1).padStart(2, '0')}/</span>
                      <span className="ed-serif font-[330] leading-[1.35] text-[19px] sm:text-[22px] lg:text-[27px]">{dato}</span>
                    </RevealItem>
                  </li>
                ))}
              </ol>
            </RevealGroup>
          </Reveal>
        </Wrap>
      </section>

      {/* ACCIONES */}
      <section className="pt-14 lg:pt-[90px] pb-20 lg:pb-[110px]">
        <Wrap className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">
          <p className="ed-label text-ink-soft">{t('hero_precio')}</p>
          <div className="flex flex-col sm:flex-row gap-3.5">
            <Link className="ed-pill ed-pill-navy" to="/contacto">
              {t('home_hero_cta_primary')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
            </Link>
            <Link className="ed-pill ed-pill-line" to="/asistente-virtual">
              {t('que_es_ver_precio')}
            </Link>
          </div>
        </Wrap>
      </section>
    </div>
  )
}
