import { useT } from '@/hooks/useT'
import { Reveal } from '@/components/shared/EditorialReveal'

const SECTIONS = Array.from({ length: 13 }, (_, i) => ({
  tk: `pp_${i + 1}_t`,
  dk: `pp_${i + 1}_d`,
}))

const pad = (n: number) => String(n).padStart(2, '0')

// Política de privacidad en el sistema editorial (misma cara que el resto del portal).
export default function PoliticaPrivacidad() {
  const t = useT()

  return (
    <>
      <section className="pt-[158px] pb-[64px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal y={0}>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">✳</span>
              <span className="name">{t('privacidad_label')}</span>
              <span className="meta">{t('privacidad_actualizacion')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 max-w-[16ch]">
            <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(40px,6.4vw,96px)] [text-wrap:balance]">
              {t('privacidad_titulo')}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-[130px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="border-t border-navy/15">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.tk}>
                <article className="grid grid-cols-1 md:grid-cols-[96px_1fr] gap-x-8 gap-y-3 py-10 border-b border-navy/15">
                  <div className="font-display font-light text-[clamp(32px,3.4vw,48px)] leading-none text-navy tabular-nums">
                    {pad(i + 1).slice(0, 1)}<span className="italic text-coral">{pad(i + 1).slice(1)}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-[clamp(20px,1.8vw,26px)] text-ink leading-snug">{t(s.tk)}</h2>
                    <p className="text-[15.5px] text-ink-soft leading-relaxed mt-3 max-w-[70ch]">{t(s.dk)}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
