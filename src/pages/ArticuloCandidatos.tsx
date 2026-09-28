import { useParams, Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { articulosCandidatos } from '@/data/articulosCandidatos'
import { useLang, useT, l } from '@/hooks/useT'
import { Reveal } from '@/components/shared/EditorialReveal'
import SEO from '@/components/shared/SEO'
import NotFoundPage from '@/pages/NotFound'

// Artículo para candidatos (/blog/:id). Página mínima con el sistema editorial
// del portal: cabecera como la de NotFound y el cuerpo con la clase
// .blog-content que ya existe en globals.css. Sin índice de blog: se llega
// desde el pie o desde la redirección de la web de clientes.
export default function ArticuloCandidatos() {
  const { id } = useParams()
  const t = useT()
  const lang = useLang()
  const post = articulosCandidatos.find(p => p.id === id)

  if (!post) return <NotFoundPage />

  return (
    <>
      <SEO
        title={l(post.title, lang)}
        description={l(post.excerpt, lang)}
        path={`/blog/${post.id}`}
        type="article"
      />

      <section className="pt-[158px] pb-[64px]">
        <div className="max-w-[860px] mx-auto px-6 lg:px-10">
          <Reveal y={0}>
            <div className="ed-sec-tag ed-caps">
              <span className="idx">✳</span>
              <span className="name">{l(post.category, lang)}</span>
              <span className="meta hidden sm:inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {post.readTime} · {l(post.date, lang)}
              </span>
            </div>
          </Reveal>
          <Reveal className="mt-11">
            <h1 className="font-display font-normal tracking-[-0.015em] leading-[1.05] text-[clamp(34px,5vw,64px)] [text-wrap:balance]">
              {l(post.title, lang)}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[clamp(16px,1.5vw,20px)] text-ink-soft leading-relaxed mt-7">{l(post.excerpt, lang)}</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-[130px]">
        <div className="max-w-[860px] mx-auto px-6 lg:px-10">
          <img src={post.image} alt={l(post.title, lang)} className="w-full h-[260px] lg:h-[400px] object-cover mb-12" />
          {post.content && (
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: l(post.content, lang) }} />
          )}
          <div className="mt-14 pt-8 border-t border-navy/15">
            <Link className="ed-btn ed-btn-primary" to="/empleos">
              {t('cand_cta_primary')} <ArrowRight className="w-4 h-4 arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
