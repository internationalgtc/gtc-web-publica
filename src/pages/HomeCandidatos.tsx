import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useT, useLang } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'

// Portada de la variante CANDIDATOS (rama `candidatos`, deploy gtc-empleos).
// Objetivo: generar comunidad y valor antes de mandar a las vacantes.
// Mismo sistema editorial que la home de clientes (ed-*, Fraunces, cream/navy).

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function Reveal({ children, className, delay = 0, y = 36 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.div>
  )
}

function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

const VALUES = [
  { tKey: 'cand_v1_t', dKey: 'cand_v1_d' },
  { tKey: 'cand_v2_t', dKey: 'cand_v2_d' },
  { tKey: 'cand_v3_t', dKey: 'cand_v3_d' },
]

const STEPS = [
  { tKey: 'cand_proc_1_t', dKey: 'cand_proc_1_d' },
  { tKey: 'cand_proc_2_t', dKey: 'cand_proc_2_d' },
  { tKey: 'cand_proc_3_t', dKey: 'cand_proc_3_d' },
  { tKey: 'cand_proc_4_t', dKey: 'cand_proc_4_d' },
]

// Cada área abre la bolsa de empleos ya filtrada (?area=). El departamento es
// el que usa la web (src/data/jobs.ts): finanzas convive con Administración y
// diseño con Marketing en el filtro público.
const AREAS = [
  { nameKey: 'home_area_1', tagKey: 'home_area_1_tag', dept: 'Administración' },
  { nameKey: 'home_area_2', tagKey: 'home_area_2_tag', dept: 'Marketing' },
  { nameKey: 'home_area_3', tagKey: 'home_area_3_tag', dept: 'Administración' },
  { nameKey: 'home_area_4', tagKey: 'home_area_4_tag', dept: 'Ventas y Comercial' },
  { nameKey: 'home_area_5', tagKey: 'home_area_5_tag', dept: 'Marketing' },
  { nameKey: 'home_area_6', tagKey: 'home_area_6_tag', dept: 'Tecnología' },
]

const STATS = [
  { n: '93', lKey: 'home_stat_profesionales', fKey: 'cand_stat_profesionales_foot' },
  { n: '55', lKey: 'home_stat_empresas', fKey: 'cand_stat_empresas_foot' },
  { n: '11', lKey: 'home_stat_areas', fKey: 'home_stat_areas_foot' },
]

export default function HomeCandidatos() {
  const t = useT()
  useLang()
  // Acordeón del proceso: tocar un paso despliega su texto (no redirige).
  const [pasoAbierto, setPasoAbierto] = useState<number | null>(0)

  return (
    <>
      <SEO
        title="Trabajo remoto para Latinoamérica"
        description="Trabaja para empresas de España y EE.UU. desde tu casa. Salario en dólares, formación continua y una comunidad de profesionales remotos que te respalda."
        path="/"
        keywords="trabajo remoto latinoamerica, empleo remoto en euros, vacantes remotas, asistente virtual, trabajo desde casa, Global Talent Connections"
      />

      {/* HERO */}
      <section className="pt-[158px] relative">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal delay={0} y={0}>
            <div className="ed-caps !text-[11px] flex items-baseline flex-wrap gap-[26px] py-[14px] border-y border-navy/15 text-ink-soft">
              <span className="flex items-center gap-[9px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#2fae6b] animate-pulse" />
                {t('cand_hero_badge')}
              </span>
              <span className="ml-auto hidden md:inline text-sand">{t('cand_hero_badge_meta')}</span>
            </div>
          </Reveal>

          <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(46px,7.6vw,118px)] mt-16 max-w-[13ch] [text-wrap:balance]">
            {t('cand_hero_a')} <em className="italic text-gold-deep">{t('cand_hero_b')}</em>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-[54px] pb-[70px] items-end">
            <Reveal delay={0.3}>
              <p className="text-[clamp(16px,1.5vw,20px)] text-ink-soft max-w-[46ch] leading-relaxed">
                {t('cand_hero_sub')}
              </p>
            </Reveal>
            <Reveal delay={0.45} y={26}>
              <div className="flex gap-3.5 flex-wrap md:justify-end">
                <Link className="ed-btn ed-btn-primary" to="/empleos">
                  {t('cand_cta_primary')} <ArrowRight className="w-4 h-4 arrow" />
                </Link>
                <a className="ed-btn ed-btn-outline" href="#propuesta">
                  {t('cand_cta_secondary')}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Stats como fila-índice */}
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 border-t border-navy/15">
            {STATS.map((s, i) => (
              <RevealItem
                key={s.lKey}
                className={`py-9 md:pb-12 ${i > 0 ? 'md:border-l md:border-navy/15 md:pl-10' : ''} ${i < STATS.length - 1 ? 'border-b md:border-b-0 border-navy/15' : ''}`}
              >
                <div className="font-display font-light text-[clamp(48px,5vw,76px)] tracking-[-0.02em] leading-none text-navy tabular-nums">
                  {s.n}
                </div>
                <div className="ed-caps !text-[11px] mt-3.5">{t(s.lKey)}</div>
                <div className="ed-caps !text-[9.5px] !tracking-[0.16em] text-sand mt-1.5">{t(s.fKey)}</div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 01 PROPUESTA DE VALOR */}
      <section id="propuesta" className="py-[110px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">01</span>
              <span className="name">{t('cand_sec_valor')}</span>
              <span className="meta">{t('cand_sec_valor_meta')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 mb-[70px] max-w-[700px]">
            <h2 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(38px,5.6vw,84px)] [text-wrap:balance]">
              {t('cand_valor_h2_a')} <em className="italic text-gold-deep">{t('cand_valor_h2_b')}</em>
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 border-t border-navy/15">
            {VALUES.map((v, i) => (
              <RevealItem
                key={v.tKey}
                className={`py-11 pb-[60px] md:pr-10 transition-colors duration-300 hover:bg-cream-2 ${
                  i > 0 ? 'md:border-l md:border-navy/15 md:pl-10' : ''
                } ${i < VALUES.length - 1 ? 'border-b md:border-b-0 border-navy/15' : ''}`}
              >
                <div className="font-display font-light text-[clamp(52px,5.6vw,84px)] tracking-[-0.02em] leading-none text-navy tabular-nums">
                  0<span className="italic text-coral">{i + 1}</span>
                </div>
                <h3 className="font-headline font-bold text-[13px] tracking-[0.14em] uppercase mt-[26px] mb-3">{t(v.tKey)}</h3>
                <p className="text-[14.5px] text-ink-soft leading-relaxed">{t(v.dKey)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 02 PROCESO DEL CANDIDATO */}
      <section id="proceso" className="ed-on-dark py-[110px] bg-gradient-to-b from-navy to-navy-deep text-cream">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">02</span>
              <span className="name">{t('cand_sec_proceso')}</span>
              <span className="meta">{t('cand_sec_proceso_meta')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 mb-[70px] max-w-[920px]">
            <h2 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(38px,5.6vw,84px)] text-cream [text-wrap:balance]">
              {t('cand_proc_h2_a')} <em className="italic text-gold">{t('cand_proc_h2_b')}</em>
            </h2>
          </Reveal>
          <RevealGroup>
            {STEPS.map((step, i) => (
              <RevealItem key={step.tKey}>
                <button
                  type="button"
                  className="ed-prow w-full text-left"
                  onClick={() => setPasoAbierto(pasoAbierto === i ? null : i)}
                  aria-expanded={pasoAbierto === i}
                >
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display font-normal text-[clamp(22px,2.4vw,32px)] tracking-[-0.01em]">{t(step.tKey)}</h3>
                  {pasoAbierto === i && (
                    <p className="desc text-[14.5px] text-cream/60 max-w-[46ch] leading-relaxed">{t(step.dKey)}</p>
                  )}
                  <span className="arr">{pasoAbierto === i ? '−' : '+'}</span>
                </button>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal>
            <div className="mt-14">
              <Link className="ed-btn ed-btn-primary !px-8 !py-3.5" to="/empleos">
                {t('beneficios_cta')} <ArrowRight className="w-4 h-4 arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 COMUNIDAD */}
      <section id="comunidad" className="py-[110px] bg-cream-2">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">03</span>
              <span className="name">{t('cand_sec_comunidad')}</span>
              <span className="meta">{t('cand_sec_comunidad_meta')}</span>
            </div>
          </Reveal>
          <Reveal>
            <p className="font-display font-light text-[clamp(30px,4.4vw,58px)] leading-[1.15] tracking-[-0.01em] max-w-[24ch] mt-11">
              {t('cand_com_big_1')} <em className="italic text-gold-deep">{t('cand_com_big_em')}</em> {t('cand_com_big_2')}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[clamp(16px,1.4vw,19px)] text-ink-soft max-w-[56ch] leading-relaxed mt-[30px]">
              {t('cand_com_p')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 04 ÁREAS */}
      <section id="areas" className="py-[110px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">04</span>
              <span className="name">{t('cand_sec_areas')}</span>
              <span className="meta">{t('home_sec_areas_meta')}</span>
            </div>
          </Reveal>
          <Reveal className="mt-11 mb-[70px] max-w-[660px]">
            <h2 className="font-display font-normal tracking-[-0.015em] leading-[1.02] text-[clamp(38px,5.6vw,84px)] [text-wrap:balance]">
              {t('cand_areas_h2_a')} <em className="italic text-gold-deep">{t('cand_areas_h2_b')}</em>
            </h2>
          </Reveal>
          <RevealGroup>
            {AREAS.map((area, i) => (
              <RevealItem key={area.nameKey}>
                <Link className="ed-area-row" to={`/empleos?area=${encodeURIComponent(area.dept)}`}>
                  <span className="font-display italic text-sm text-sand">/ {String(i + 1).padStart(2, '0')}</span>
                  <span className="name font-display font-normal text-[clamp(24px,3vw,40px)] tracking-[-0.01em]">{t(area.nameKey)}</span>
                  <span className="tag ed-caps !text-[11px] text-sand">{t(area.tagKey)}</span>
                  <span className="font-display text-[22px] text-coral">→</span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal>
            <p className="mt-[26px] text-xs text-sand">{t('home_areas_note')}</p>
          </Reveal>
        </div>
      </section>

      {/* 05 CTA FINAL */}
      <section className="ed-on-dark py-[130px] bg-gradient-to-b from-navy to-navy-deep text-cream text-center">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <h2 className="font-display font-normal tracking-[-0.015em] leading-[1.05] text-[clamp(38px,5.6vw,84px)] text-cream [text-wrap:balance] max-w-[16ch] mx-auto">
              {t('cand_final_h2_a')} <em className="italic text-gold">{t('cand_final_h2_b')}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-cream/70 text-[clamp(16px,1.4vw,19px)] max-w-[48ch] mx-auto leading-relaxed mt-7">
              {t('cand_final_p')}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-12">
              <Link className="ed-btn ed-btn-primary !px-10 !py-4" to="/empleos">
                {t('cand_cta_primary')} <ArrowRight className="w-4 h-4 arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
