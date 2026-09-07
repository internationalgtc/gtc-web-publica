import { Link } from 'react-router-dom'
import SEO from '@/components/shared/SEO'
import { useT, useLang } from '@/hooks/useT'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
import { RevealSection } from '@/components/shared/RevealSection'
import { direccion, filasOperativo, type TeamMember } from '@/data/equipo'

function TeamCard({ member, size = 'lg', lang }: { member: TeamMember; size?: 'lg' | 'sm'; lang: 'es' | 'en' }) {
  const isLg = size === 'lg'
  return (
    <div className="group">
      <div className={`${isLg ? 'aspect-[3/4] mb-6' : 'aspect-[3/4] mb-4'} overflow-hidden rounded-xl bg-[#0c1a2e] warm-overlay`}>
        {member.foto ? (
          <img
            alt={member.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={member.foto}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 font-headline text-4xl">
            {member.nombre.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className={`font-headline ${isLg ? 'text-xl' : 'text-lg'} mb-1 text-white`}>{member.nombre}</h4>
          <p className={`font-label ${isLg ? 'text-xs' : 'text-[10px]'} uppercase tracking-widest text-blue-light font-bold ${isLg ? 'mb-2' : ''}`}>
            {lang === 'en' ? member.rolEn : member.rol}
          </p>
          <p className="text-gold text-sm">{member.email}</p>
        </div>
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-blue-light transition-colors mt-1"
            aria-label={`LinkedIn de ${member.nombre}`}
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}

export default function NosotrosPage() {
  const t = useT()
  const lang = useLang()
  return (
    <>
      <SEO
        title="Sobre Nosotros"
        description="Conoce a Global Talent Connections: equipo, misión y por qué +56 empresas en España confían en nuestros profesionales remotos de Latinoamérica."
        path="/nosotros"
        keywords="quienes somos Global Talent Connections, empresa talento remoto España, agencia asistentes virtuales, outsourcing Latinoamérica, equipo Global Talent"
        breadcrumbs={[{ name: 'Nosotros', url: '/nosotros' }]}
      />
      {/* HERO */}
      <section className="bg-[#0c1a2e] min-h-[600px] lg:min-h-[700px] flex items-center relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-blue-prime/[0.06] blur-[120px] rounded-full" />
        <div className="container mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 py-24 lg:py-20">
            <span className="font-label uppercase tracking-[0.2em] text-blue-light text-sm font-bold block mb-6">
              {t('nosotros_label')}
            </span>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl text-white leading-[1.1] mb-8">
              {t('nosotros_titulo_1')}{' '}
              <span className="italic text-gold">{t('nosotros_mercados')}</span> {lang === 'en' ? 'and' : 'y'}{' '}
              <span className="italic text-gold">{t('nosotros_talento')}</span>.
            </h1>
            <p className="text-[#8899b0] text-lg md:text-xl max-w-xl leading-relaxed">
              {t('nosotros_subtitle')}
            </p>
          </div>
          <div className="relative lg:absolute lg:right-0 lg:w-1/2 h-[300px] lg:h-full hidden lg:block">
            <img
              alt="Global presence"
              className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-60"
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c1a2e] via-[#0c1a2e]/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* MISION & VALORES */}
      <RevealSection className="py-24 lg:py-32 bg-cream">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl mb-16 text-navy">
              {t('nosotros_mision_titulo')} <span className="text-blue-prime">{t('nosotros_mision_highlight')}</span> {t('nosotros_mision_cierre')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
            {[
              { color: 'bg-blue-prime', titleKey: 'nos_v1_t', descKey: 'nos_v1_d' },
              { color: 'bg-gold', titleKey: 'nos_v2_t', descKey: 'nos_v2_d' },
              { color: 'bg-blue-prime', titleKey: 'nos_v3_t', descKey: 'nos_v3_d' },
            ].map(item => (
              <div key={item.titleKey} className="space-y-6">
                <div className={`w-12 h-[2px] ${item.color}`} />
                <h3 className="font-headline text-2xl text-navy">{t(item.titleKey)}</h3>
                <p className="text-dark-gray leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* EQUIPO */}
      <RevealSection className="py-24 lg:py-32 bg-navy">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Liderazgo */}
          <div className="mb-16 lg:mb-20">
            <span className="font-label uppercase tracking-widest text-blue-light text-xs font-bold block mb-4">{t('nosotros_liderazgo')}</span>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl text-white">
              {t('nosotros_arquitectos')} <span className="italic text-gold">{t('nosotros_conexiones')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {direccion.map(member => (
              <TeamCard key={member.id} member={member} size="lg" lang={lang} />
            ))}
          </div>

          {/* Equipo Operativo */}
          <div className="mt-16 lg:mt-20 mb-10 lg:mb-12">
            <span className="font-label uppercase tracking-widest text-white/60 text-xs font-bold block">{t('nosotros_equipo_operativo')}</span>
          </div>

          <div className="space-y-6 lg:space-y-8">
            {filasOperativo.map((fila, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                {fila.map(member => (
                  <TeamCard key={member.id} member={member} size="sm" lang={lang} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* PRESENCIA GLOBAL */}
      <RevealSection className="py-24 lg:py-32 bg-cream relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl mb-8 leading-tight text-navy">
                {t('nosotros_presencia')} <span className="italic text-gold">{t('nosotros_global')}</span>.
              </h2>
              <p className="text-dark-gray text-lg mb-12 max-w-lg">
                {t('nos_presencia_d')}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <span className="w-2 h-2 mt-2 bg-blue-prime rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                  <div>
                    <h4 className="font-bold text-navy">{t('nos_espana')}</h4>
                    <p className="text-dark-gray text-sm">{t('nos_sede')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-2 h-2 mt-2 bg-gold rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
                  <div>
                    <h4 className="font-bold text-navy">{t('nos_miami')}</h4>
                    <p className="text-dark-gray text-sm">{t('nos_entidad')}</p>
                    <p className="text-dark-gray text-xs">20900 NE 30th Ave, Suite 703</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[350px] flex items-center justify-center">
              <div className="absolute w-80 h-80 bg-blue-prime/[0.08] blur-[100px] rounded-full" />
              <div className="relative z-10 p-10 lg:p-12 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 text-center shadow-xl">
                <div className="text-5xl font-headline text-blue-prime mb-2">56</div>
                <div className="font-label text-xs uppercase tracking-widest text-navy/70 mb-8 font-bold">{t('nosotros_empresas_activas')}</div>
                <div className="h-[1px] w-full bg-navy/10 mb-8" />
                <div className="text-5xl font-headline text-gold mb-2">2</div>
                <div className="font-label text-xs uppercase tracking-widest text-navy/70 font-bold">{t('nosotros_sedes')}</div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* CTA FINAL */}
      <section className="py-24 lg:py-32 bg-[#0c1a2e] relative overflow-hidden text-center">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-prime/[0.08] blur-[120px] rounded-full" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <h2 className="font-headline text-3xl md:text-4xl lg:text-6xl text-white mb-12 max-w-3xl mx-auto">
            {t('nosotros_cta_titulo')} <span className="italic text-gold">{t('nosotros_horizontes')}</span>?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/contacto" className="px-10 lg:px-12 py-4 bg-blue-prime text-white font-bold rounded-md hover:bg-blue-deep hover:scale-95 transition-all">
              {t('nosotros_soy_empresa')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
