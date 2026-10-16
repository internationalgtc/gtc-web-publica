import { Link } from 'react-router-dom'
import { Reveal } from '@/components/shared/EditorialReveal'
import { TituloEntrada, Wrap, partirTitulo } from '@/components/shared/EditorialPiezas'
import { blogPosts } from '@/data/blogPosts'
import { useT, useLang, l } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'
import { useQuery } from '@tanstack/react-query'
import { articulosDeLeax, type TarjetaLeax } from '@/lib/leax-blog'

/* Blog — rediseño «A · Revista» (28-sep-2026), lienzo A-blog.
   Los artículos salen de src/data/blogPosts.ts: foto y texto alternan de lado.
   Debajo, los que vienen de Leax (piloto SEO, P5): solo texto, porque Leax no
   manda foto de portada. Si Leax no responde, la portada sigue con los propios. */

function Encabezado({ n }: { n: number }) {
  const t = useT()
  return (
    <section className="pt-[112px] sm:pt-[140px] lg:pt-[174px] pb-14 lg:pb-20 border-b border-navy/15">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 lg:gap-14 items-end">
        <Reveal y={0}>
          <div className="ed-label flex flex-wrap gap-x-3.5 gap-y-1 text-ink-soft lg:pb-[18px]">
            <span className="font-semibold text-navy">{t('blog_label')}</span>
            <span>
              · {n} {t(n === 1 ? 'blog_articulo' : 'blog_articulos')}
            </span>
          </div>
        </Reveal>
        <div className="flex flex-col gap-6 lg:gap-[30px]">
          <TituloEntrada
            className="ed-serif font-[320] text-navy leading-[0.98] tracking-[-0.025em] text-[clamp(44px,12vw,64px)] sm:text-[clamp(64px,10vw,88px)] lg:text-[clamp(80px,8.3vw,120px)] [text-wrap:balance]"
            tramos={[{ texto: t('blog_titulo_1') }, { texto: `${t('blog_titulo_2')}.`, em: true }]}
          />
          <Reveal delay={0.5} y={26}>
            <p className="max-w-[32em] text-[17px] sm:text-[19px] lg:text-[21px] leading-[1.55] text-ink-soft [text-wrap:pretty]">
              {t('blog_subtitle')}
            </p>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}

function Articulos() {
  const t = useT()
  const lang = useLang()
  return (
    <section className="pt-14 pb-20 lg:pt-[90px] lg:pb-[120px]">
      <Wrap className="flex flex-col gap-14 lg:gap-20">
        {blogPosts.map((post, i) => {
          const titulo = l(post.title, lang)
          const [principio, final] = partirTitulo(titulo)
          const fotoDerecha = i % 2 === 1
          return (
            <div key={post.id} className="flex flex-col gap-14 lg:gap-20">
              {i > 0 && <div className="border-t border-navy/20" />}
              <Reveal>
                <Link
                  to={`/blog/${post.id}`}
                  className={`group grid grid-cols-1 gap-7 lg:gap-14 items-center no-underline text-navy hover:text-navy ${
                    fotoDerecha ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]' : 'lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]'
                  }`}
                >
                  <div className={`overflow-hidden rounded-[20px] lg:rounded-[30px] ${fotoDerecha ? 'lg:order-2' : ''}`}>
                    <img
                      src={post.image}
                      alt={titulo}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="block w-full h-[230px] sm:h-[360px] lg:h-[520px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col gap-5 lg:gap-6">
                    <div className="ed-label flex flex-wrap gap-x-[18px] gap-y-1 text-ink-soft">
                      <span className="font-semibold text-navy">{l(post.category, lang)}</span>
                      <span>{l(post.date, lang)}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="ed-serif font-[330] leading-[1.05] tracking-[-0.02em] text-[clamp(30px,8vw,40px)] sm:text-[clamp(40px,6vw,50px)] lg:text-[clamp(44px,4vw,58px)] [text-wrap:balance]">
                      {principio && `${principio} `}
                      <span className="ed-serif-it">{final}</span>
                    </h2>
                    <p className="text-[17px] lg:text-[19px] leading-[1.6] text-ink-soft [text-wrap:pretty]">{l(post.excerpt, lang)}</p>
                    <span className="self-start font-label font-semibold text-[16px] border-b-2 border-coral pb-1">
                      {t('blog_leer_mas')}{' '}
                      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </div>
          )
        })}
      </Wrap>
    </section>
  )
}

function fecha(iso: string | null, lang: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ArticulosLeax({ articulos }: { articulos: TarjetaLeax[] }) {
  const t = useT()
  const lang = useLang()
  if (!articulos.length) return null
  return (
    <section className="pb-20 lg:pb-[120px]">
      <Wrap>
        <ul className="ed-lista">
          {articulos.map(a => {
            const [principio, final] = partirTitulo(a.title)
            const cuando = fecha(a.publicado_en, lang)
            return (
              <li key={a.slug}>
                <Link to={`/blog/${a.slug}`} className="group flex flex-col gap-3 py-4 no-underline text-navy hover:text-navy">
                  {cuando && <span className="ed-label text-ink-soft">{cuando}</span>}
                  <h2 className="ed-serif font-[330] leading-[1.08] tracking-[-0.02em] text-[clamp(26px,6.4vw,34px)] lg:text-[clamp(32px,2.8vw,42px)] [text-wrap:balance]">
                    {principio && `${principio} `}
                    <span className="ed-serif-it">{final}</span>
                  </h2>
                  {a.meta_description && <p className="text-[17px] leading-[1.6] text-ink-soft max-w-[40em] [text-wrap:pretty]">{a.meta_description}</p>}
                  <span className="self-start font-label font-semibold text-[16px] border-b-2 border-coral pb-1">
                    {t('blog_leer_mas')}{' '}
                    <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Wrap>
    </section>
  )
}

export default function BlogPage() {
  const { data: deLeax = [] } = useQuery({ queryKey: ['articulos-leax'], queryFn: articulosDeLeax, staleTime: 5 * 60 * 1000, retry: 1 })
  return (
    <div className="bg-cream text-ink">
      <SEO
        title="Blog"
        description="Insights y casos de éxito sobre talento remoto, gestión de equipos y crecimiento empresarial con asistentes virtuales."
        path="/blog"
      />
      <Encabezado n={blogPosts.length + deLeax.length} />
      <Articulos />
      <ArticulosLeax articulos={deLeax} />
    </div>
  )
}
