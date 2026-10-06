import type { MouseEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from '@/components/shared/EditorialReveal'
import { TituloEntrada, Wrap, partirTitulo } from '@/components/shared/EditorialPiezas'
import SEO from '@/components/shared/SEO'
import { useT, useLang } from '@/hooks/useT'
import { articuloDeLeax, enlaceAContacto } from '@/lib/leax-blog'
import { marcarOrigenSiNoHay } from '@/lib/utm'

/* Artículo del blog que viene de Leax (piloto SEO, pieza P5).
   Leax edita y aprueba; acá se publica con el diseño editorial del sitio.
   El cuerpo llega saneado como HTML (párrafos, subtítulos, listas, imágenes,
   fuentes y un botón) y toma su forma de .ed-articulo-leax. Al final, el
   botón a Contacto deja la marca del artículo en el lead si la visita no
   traía otro origen. */

function fecha(iso: string | null, lang: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ArticuloLeax({ slug, noEncontrado }: { slug: string; noEncontrado: ReactNode }) {
  const t = useT()
  const lang = useLang()
  const navigate = useNavigate()
  const { data: articulo, isPending, isError, refetch } = useQuery({
    queryKey: ['articulo-leax', slug],
    queryFn: () => articuloDeLeax(slug),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  if (isPending) {
    return (
      <div className="min-h-screen bg-cream pt-32 pb-20" aria-busy="true">
        <Wrap className="flex flex-col gap-6">
          <div className="h-5 w-40 rounded-full bg-cream-2 animate-pulse" />
          <div className="h-24 max-w-[15em] rounded-[20px] bg-cream-2 animate-pulse" />
          <div className="h-64 rounded-[20px] bg-cream-2 animate-pulse" />
        </Wrap>
      </div>
    )
  }
  if (isError) {
    return (
      <div className="min-h-screen bg-cream text-ink flex items-center justify-center pt-32 pb-20">
        <Wrap className="text-center flex flex-col items-center gap-6">
          <p className="text-[19px] text-ink-soft max-w-[28em]">{t('blog_leax_error')}</p>
          <button type="button" onClick={() => void refetch()} className="ed-pill ed-pill-navy">
            {t('blog_leax_reintentar')}
          </button>
        </Wrap>
      </div>
    )
  }
  if (!articulo) return <>{noEncontrado}</>

  const [principio, final] = partirTitulo(articulo.title)
  const cuando = fecha(articulo.publicado_en, lang)

  // Los enlaces internos del texto navegan sin recargar; el botón a Contacto
  // además deja la marca del artículo.
  function alHacerClic(e: MouseEvent<HTMLElement>) {
    const a = (e.target as HTMLElement).closest('a')
    const href = a?.getAttribute('href')
    if (!href || !href.startsWith('/') || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }
  function aContacto(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    e.stopPropagation()
    marcarOrigenSiNoHay({ utm_source: 'blog', utm_medium: 'articulo', utm_campaign: slug })
    navigate('/contacto')
  }

  return (
    <div className="bg-cream text-ink" onClick={alHacerClic}>
      <SEO
        title={articulo.meta_title || articulo.title}
        description={articulo.meta_description ?? articulo.title}
        path={`/blog/${articulo.slug}`}
        type="article"
      />

      <section className="pt-[104px] sm:pt-[124px] lg:pt-[138px] pb-10 lg:pb-[60px]">
        <Wrap className="flex flex-col gap-6 lg:gap-[34px]">
          <Link
            to="/blog"
            className="self-start inline-flex items-center gap-2 min-h-[44px] font-label font-semibold text-[15px] text-navy no-underline hover:text-navy-deep transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t('blog_volver')}
          </Link>
          <div className="ed-label flex flex-wrap gap-x-[18px] gap-y-1 text-ink-soft">
            <span className="font-semibold text-navy">{t('blog_label')}</span>
            <span>Global Talent Connections</span>
            {cuando && <span>{cuando}</span>}
          </div>
          <TituloEntrada
            className="ed-serif font-[320] text-navy leading-none tracking-[-0.025em] max-w-[15em] text-[clamp(38px,10vw,56px)] sm:text-[clamp(56px,8.4vw,76px)] lg:text-[clamp(72px,6.7vw,96px)] [text-wrap:balance]"
            tramos={principio ? [{ texto: principio }, { texto: final, em: true }] : [{ texto: final, em: true }]}
          />
          {articulo.meta_description && (
            <Reveal delay={0.5} y={26}>
              <p className="ed-serif-it text-navy max-w-[32em] text-[clamp(21px,5.4vw,26px)] lg:text-[clamp(26px,2.2vw,32px)] leading-[1.35] [text-wrap:pretty]">
                {articulo.meta_description}
              </p>
            </Reveal>
          )}
        </Wrap>
      </section>

      <Wrap className="pt-6 lg:pt-10">
        <div
          className="ed-articulo ed-articulo-leax max-w-[760px] flex flex-col gap-6 lg:gap-7 text-[17px] sm:text-[18px] lg:text-[20px] leading-[1.7] text-ink"
          // Viene saneado de Leax (lista permitida del editor): sin scripts ni atributos de evento.
          dangerouslySetInnerHTML={{ __html: articulo.body_html }}
        />
      </Wrap>

      <Wrap className="mt-12 lg:mt-16 pb-20 lg:pb-[110px]">
        <div className="max-w-[760px] flex flex-col gap-6 pt-8 border-t border-navy/20">
          <p className="ed-serif text-navy text-[clamp(26px,6vw,36px)] leading-[1.15] [text-wrap:balance]">{t('blog_leax_cta')}</p>
          <div className="flex flex-wrap gap-3.5">
            <a href={enlaceAContacto(articulo.slug)} onClick={aContacto} className="ed-pill ed-pill-navy">
              {t('nav_contacto')}
            </a>
            <Link to="/blog" className="ed-pill ed-pill-line">
              {t('blog_mas_articulos')}
            </Link>
          </div>
        </div>
      </Wrap>
    </div>
  )
}
