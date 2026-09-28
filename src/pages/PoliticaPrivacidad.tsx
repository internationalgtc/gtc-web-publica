import { RevealSection } from '@/components/shared/RevealSection'
import SEO from '@/components/shared/SEO'
import { useT } from '@/hooks/useT'

const SECTIONS = Array.from({ length: 13 }, (_, i) => ({
  tk: `pp_${i + 1}_t`,
  dk: `pp_${i + 1}_d`,
}))

export default function PoliticaPrivacidad() {
  const t = useT()

  return (
    <>
      <SEO
        title={t('privacidad_titulo')}
        description="Qué datos personales recoge Global Talent Connections a través de esta web, para qué los usa, cuánto tiempo los conserva y cómo ejercer tus derechos."
        path="/politica-de-privacidad"
      />
      <section className="bg-navy pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <span className="text-blue-light text-xs font-label uppercase tracking-widest font-bold mb-4 block">{t('privacidad_label')}</span>
          <h1 className="font-headline font-bold text-4xl md:text-5xl text-white mb-6">{t('privacidad_titulo')}</h1>
          <p className="text-white/60">{t('privacidad_actualizacion')}</p>
        </div>
      </section>

      <RevealSection className="py-20 lg:py-28 bg-off-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 lg:p-14 border border-border-soft space-y-10">
            {SECTIONS.map((s, i) => (
              <div key={s.tk}>
                <h2 className="font-headline font-bold text-xl text-navy mb-3 flex items-center gap-3">
                  <span className="text-blue-prime/40 font-label text-sm">{String(i + 1).padStart(2, '0')}</span>
                  {t(s.tk)}
                </h2>
                <p className="text-dark-gray leading-relaxed">{t(s.dk)}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>
    </>
  )
}
