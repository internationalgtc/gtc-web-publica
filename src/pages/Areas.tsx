import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { DEPARTMENTS, DEPT_EN } from '@/data/jobs'
import type { Job } from '@/data/jobs'
import { traerVacantes } from '@/lib/vacantes-nexus'
import { useLang, useT } from '@/hooks/useT'
import { urlPostulacion } from '@/lib/nexus'
import SEO from '@/components/shared/SEO'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'

// Postulación por ÁREA — página propia, separada de la bolsa (Ariel, 8-sep-2026:
// «aparte, que te dirija a áreas generales, no todo junto colapsado»).
// Cada fila es un perfil general de Nexus (sin cliente detrás): abre el
// formulario con ese perfil ya elegido y la persona entra al banco de talento.
// Si Nexus no responde, se ofrecen las áreas de la web y el formulario en blanco.

const pad = (n: number) => String(n).padStart(2, '0')

export default function AreasPage() {
  const t = useT()
  const lang = useLang()
  const [perfiles, setPerfiles] = useState<Job[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    traerVacantes(ctrl.signal).then(({ jobs, usandoReserva }) => {
      if (ctrl.signal.aborted) return
      setPerfiles(usandoReserva ? [] : jobs.filter(j => j.esPerfilGeneral))
      setCargando(false)
    })
    return () => ctrl.abort()
  }, [])

  const deptLabel = (d: string) => (lang === 'en' && DEPT_EN[d] ? DEPT_EN[d] : d)
  const areasReserva = DEPARTMENTS.filter(d => d !== 'Todos')

  return (
    <>
      <SEO
        title="Postúlate por área — Deja tu CV"
        description="¿No encuentras tu búsqueda? Elige tu área y deja tu CV: queda en nuestra base y se evalúa para cada búsqueda nueva de esa área. Trabajo 100% remoto desde Latinoamérica."
        path="/areas"
      />

      {/* CABECERA */}
      <section className="pt-[158px] pb-[64px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal y={0}>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">✳</span>
              <span className="name">{t('areas_label')}</span>
              <Link to="/empleos" className="meta inline-flex items-center gap-2 hover:text-coral transition-colors duration-300">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('det_volver')}
              </Link>
            </div>
          </Reveal>
          <Reveal className="mt-11 max-w-[14ch]">
            <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(40px,6.4vw,96px)] [text-wrap:balance]">
              {t('areas_titulo_1')} <em className="italic text-gold-deep">{t('areas_titulo_2')}</em>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[clamp(16px,1.5vw,20px)] text-ink-soft max-w-[52ch] leading-relaxed mt-7">{t('areas_intro')}</p>
          </Reveal>
        </div>
      </section>

      {/* ÁREAS — cada fila abre el formulario con ese perfil elegido */}
      <section className="pb-[130px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          {cargando ? (
            <p className="font-display italic text-[clamp(22px,2.4vw,32px)] text-sand py-[60px]">{t('det_cargando')}</p>
          ) : perfiles.length > 0 ? (
            <RevealGroup>
              {perfiles.map((p, i) => (
                <RevealItem key={p.id}>
                  <a className="ed-area-row" href={urlPostulacion(p.title, lang)} target="_blank" rel="noopener noreferrer">
                    <span className="font-display italic text-sm text-sand">/ {pad(i + 1)}</span>
                    <span className="name font-display font-normal text-[clamp(22px,2.6vw,36px)] tracking-[-0.01em]">{p.title}</span>
                    <span className="tag ed-caps !text-[11px] text-sand">{deptLabel(p.department)}</span>
                    <span className="font-display text-[22px] text-coral">→</span>
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <RevealGroup>
              {areasReserva.map((d, i) => (
                <RevealItem key={d}>
                  <a className="ed-area-row" href={urlPostulacion(undefined, lang)} target="_blank" rel="noopener noreferrer">
                    <span className="font-display italic text-sm text-sand">/ {pad(i + 1)}</span>
                    <span className="name font-display font-normal text-[clamp(22px,2.6vw,36px)] tracking-[-0.01em]">{deptLabel(d)}</span>
                    <span className="tag ed-caps !text-[11px] text-sand">{t('cand_cta_general')}</span>
                    <span className="font-display text-[22px] text-coral">→</span>
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
          )}

          {/* Sin elegir área: el formulario en blanco */}
          <Reveal>
            <div className="mt-[90px] pt-9 border-t border-navy/15 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <p className="font-display text-[clamp(20px,2.2vw,30px)] leading-snug max-w-[30ch]">{t('areas_sin_area')}</p>
              <a className="ed-btn ed-btn-outline shrink-0" href={urlPostulacion(undefined, lang)} target="_blank" rel="noopener noreferrer">
                {t('cand_cta_general')} <ArrowRight className="w-4 h-4 arrow" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
