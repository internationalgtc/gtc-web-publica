import type { MouseEvent } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from '@/components/shared/EditorialReveal'
import { Img3D, TituloEntrada, Wrap, partirTitulo } from '@/components/shared/EditorialPiezas'
import { blogPosts } from '@/data/blogPosts'
import { useT, useLang, l } from '@/hooks/useT'
import SEO from '@/components/shared/SEO'

/* Artículo — rediseño «A · Revista» (28-sep-2026), lienzo A-articulo.
   El texto sigue en src/data/blogPosts.ts como HTML. Acá se lee bloque por
   bloque (párrafo, título, lista, cita) y cada bloque toma la forma del
   lienzo según cómo está escrito:
   - primer párrafo → entradilla en cursiva bajo el título;
   - lista de «<strong>cifra</strong> — texto» → franja navy de cifras;
   - lista de «<strong>dato con número</strong> texto» → fila de tres datos;
   - lista de «a → b → c» → tabla de indicadores;
   - cita con «<strong>ETIQUETA</strong><br/>» → recuadro (la ecuación);
   - última sección → cierre crema con los botones a Contacto y al blog.
   Nada se agrega ni se inventa: solo cambia la forma. */

type Bloque =
  | { tipo: 'h2'; texto: string; id: string }
  | { tipo: 'p'; html: string }
  | { tipo: 'ul'; items: string[] }
  | { tipo: 'cita'; html: string }

const BLOQUE = /<(p|h2|ul|blockquote)>([\s\S]*?)<\/\1>/g
const CIFRA = /^<strong>([^<]+)<\/strong>\s*—\s*([\s\S]+)$/
const DATO = /^<strong>([^<]{1,40})<\/strong>\s+([\s\S]+)$/
const RECUADRO = /^<strong>([^<]+)<\/strong>\s*<br\s*\/?>\s*([\s\S]+)$/
const VALOR = /^<strong>([^<]+)<\/strong>\s*([\s\S]*)$/
const COLUMNAS: Record<number, string> = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }

function sinEtiquetas(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim()
}

function anclaDe(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function leerBloques(html: string): Bloque[] {
  const bloques: Bloque[] = []
  const usadas = new Set<string>()
  for (const [, tag, crudo] of html.matchAll(BLOQUE)) {
    const inner = crudo.trim()
    if (tag === 'h2') {
      const texto = sinEtiquetas(inner)
      let id = anclaDe(texto) || 'seccion'
      while (usadas.has(id)) id += '-2'
      usadas.add(id)
      bloques.push({ tipo: 'h2', texto, id })
    } else if (tag === 'ul') {
      bloques.push({ tipo: 'ul', items: [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim()) })
    } else if (tag === 'blockquote') {
      bloques.push({ tipo: 'cita', html: inner })
    } else {
      bloques.push({ tipo: 'p', html: inner })
    }
  }
  return bloques
}

type FormaLista = 'cifras' | 'datos' | 'indicadores' | 'lista'

function formaDeLista(items: string[]): FormaLista {
  const cabe = items.length >= 2 && items.length <= 4
  const conNumero = (re: RegExp) => items.every(it => /\d/.test(it.match(re)?.[1] ?? ''))
  if (cabe && items.every(it => CIFRA.test(it)) && conNumero(CIFRA)) return 'cifras'
  if (cabe && items.every(it => DATO.test(it)) && conNumero(DATO)) return 'datos'
  if (items.every(it => it.split('→').length === 3)) return 'indicadores'
  return 'lista'
}

/** Las listas de cifras y de datos salen del ancho del texto (ocupan toda la fila). */
function vaAncho(b: Bloque): boolean {
  if (b.tipo !== 'ul') return false
  const forma = formaDeLista(b.items)
  return forma === 'cifras' || forma === 'datos'
}

function Html({ html, className, as: Tag = 'span' }: { html: string; className?: string; as?: 'span' | 'p' | 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

/* ——— Bloques dentro de la columna de texto ——— */

function Titulo2({ texto, id }: { texto: string; id: string }) {
  const [principio, final] = partirTitulo(texto)
  return (
    <h2
      id={id}
      className="ed-serif font-[340] text-navy leading-[1.1] tracking-[-0.015em] text-[clamp(30px,7.4vw,38px)] lg:text-[clamp(38px,3.2vw,46px)] mt-4 lg:mt-[30px] first:mt-0 max-w-[760px] scroll-mt-28 [text-wrap:balance]"
    >
      {principio && `${principio} `}
      <span className="ed-serif-it">{final}</span>
    </h2>
  )
}

function Cita({ html }: { html: string }) {
  const recuadro = html.match(RECUADRO)
  if (recuadro) {
    return (
      <div className="max-w-[760px] border-[1.5px] border-navy rounded-[18px] lg:rounded-[22px] px-5 py-6 sm:px-[34px] sm:py-[30px] flex flex-col gap-3">
        <span className="ed-label text-ink-soft">{sinEtiquetas(recuadro[1])}</span>
        <Html html={recuadro[2]} className="ed-serif text-navy text-[20px] lg:text-[26px] leading-[1.4]" />
      </div>
    )
  }
  const corte = html.lastIndexOf(' — ')
  const texto = corte > 0 ? html.slice(0, corte) : html
  const autor = corte > 0 ? sinEtiquetas(html.slice(corte + 3)) : ''
  return (
    <blockquote className="max-w-[760px] my-2.5 flex flex-col gap-3.5">
      <Html as="p" html={texto} className="ed-serif-it text-navy text-[clamp(24px,5.6vw,28px)] lg:text-[34px] leading-[1.3]" />
      {autor && <footer className="ed-label text-ink-soft">— {autor}</footer>}
    </blockquote>
  )
}

function Indicadores({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col border-t border-navy/20">
      {items.map(it => {
        const [nombre, medida, resultado] = it.split('→').map(s => s.trim())
        const valor = resultado.match(VALOR)
        return (
          <li
            key={it}
            className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_200px] gap-1 md:gap-6 items-baseline py-5 lg:py-[22px] border-b border-navy/20"
          >
            <span className="ed-serif text-navy text-[21px] lg:text-[24px] leading-tight">{sinEtiquetas(nombre)}</span>
            <Html html={medida} className="text-[16px] lg:text-[18px] leading-[1.5] text-ink-soft" />
            {valor ? (
              <span className="flex flex-col">
                <span className="ed-serif text-navy text-[30px] lg:text-[34px] leading-tight">{valor[1]}</span>
                <Html html={valor[2]} className="text-[15px] leading-[1.45] text-ink-soft" />
              </span>
            ) : (
              <Html html={resultado} className="text-[16px] lg:text-[18px] text-navy" />
            )}
          </li>
        )
      })}
    </ul>
  )
}

function BloqueTexto({ b }: { b: Bloque }) {
  if (b.tipo === 'h2') return <Titulo2 texto={b.texto} id={b.id} />
  if (b.tipo === 'cita') return <Cita html={b.html} />
  if (b.tipo === 'ul') {
    if (formaDeLista(b.items) === 'indicadores') return <Indicadores items={b.items} />
    return (
      <ul className="ed-lista max-w-[760px]">
        {b.items.map(it => (
          <li key={it} dangerouslySetInnerHTML={{ __html: it }} />
        ))}
      </ul>
    )
  }
  return <Html as="p" html={b.html} className="max-w-[760px]" />
}

/* ——— Bloques a todo el ancho ——— */

function Cifras({ items }: { items: string[] }) {
  const t = useT()
  return (
    <Wrap className="mt-2 lg:mt-10">
      <Reveal>
        <section
          aria-label={t('blog_cifras_aria')}
          className={`bg-navy text-cream rounded-[22px] lg:rounded-[32px] px-6 py-4 sm:px-10 sm:py-6 lg:p-14 grid grid-cols-1 ${COLUMNAS[items.length]}`}
        >
          {items.map((it, i) => {
            const [, cifra, texto] = it.match(CIFRA) ?? []
            return (
              <div
                key={it}
                className={`flex flex-col gap-3 py-6 lg:py-0 ${i > 0 ? 'border-t lg:border-t-0 lg:border-l border-cream/20 lg:pl-8' : ''} ${
                  i < items.length - 1 ? 'lg:pr-8' : ''
                }`}
              >
                <span className="ed-serif font-[280] text-gold leading-[0.95] tracking-[-0.03em] whitespace-nowrap text-[clamp(48px,5.4vw,84px)]">{cifra}</span>
                <Html html={texto} className="text-[17px] lg:text-[22px] leading-[1.45] text-cream/85" />
              </div>
            )
          })}
        </section>
      </Reveal>
    </Wrap>
  )
}

function Datos({ items }: { items: string[] }) {
  return (
    <Wrap className="mt-2 lg:mt-[30px]">
      <Reveal>
        <div className={`grid grid-cols-1 ${COLUMNAS[items.length]} border-t-[1.5px] border-t-navy border-b border-b-navy/20`}>
          {items.map((it, i) => {
            const [, dato, texto] = it.match(DATO) ?? []
            return (
              <div
                key={it}
                className={`flex flex-col gap-2.5 py-7 lg:py-9 ${i > 0 ? 'border-t lg:border-t-0 lg:border-l border-navy/20 lg:pl-8' : ''} ${
                  i < items.length - 1 ? 'lg:pr-8' : ''
                }`}
              >
                <span className="ed-serif font-[330] text-navy leading-[1.1] text-[clamp(28px,2.8vw,40px)]">{dato}</span>
                <Html html={texto} className="text-[17px] lg:text-[22px] leading-[1.45] text-ink-soft" />
              </div>
            )
          })}
        </div>
      </Reveal>
    </Wrap>
  )
}

function Indice({ secciones }: { secciones: { texto: string; id: string }[] }) {
  const t = useT()
  if (secciones.length === 0) return <span className="hidden lg:block" />
  return (
    <nav aria-label={t('blog_en_este_articulo')} className="hidden lg:flex flex-col gap-3.5 pt-2 self-start sticky top-[110px]">
      <span className="ed-label text-ink-soft">{t('blog_en_este_articulo')}</span>
      {secciones.map(s => (
        <a key={s.id} href={`#${s.id}`} className="ed-serif text-[18px] leading-[1.3] text-navy no-underline hover:text-navy-deep hover:underline decoration-coral underline-offset-4">
          {s.texto.split(': ')[0]}
        </a>
      ))}
    </nav>
  )
}

/* ——— Cierre ——— */

function Cierre({ bloques }: { bloques: Bloque[] }) {
  const t = useT()
  const [titulo, ...resto] = bloques
  const ultimo = resto.length - 1
  return (
    <section id="cierre" className="mt-16 lg:mt-[90px] bg-cream-2 py-20 lg:pt-[100px] lg:pb-[110px]">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
        <Reveal className="flex flex-col gap-6">
          {titulo?.tipo === 'h2' && (
            <h2 id={titulo.id} className="ed-serif font-[320] text-navy leading-[1.02] tracking-[-0.02em] text-[clamp(38px,9vw,52px)] lg:text-[clamp(52px,5vw,72px)] scroll-mt-28 [text-wrap:balance]">
              {(() => {
                const [principio, final] = partirTitulo(titulo.texto)
                return (
                  <>
                    {principio && `${principio} `}
                    <span className="ed-serif-it">{final}</span>
                  </>
                )
              })()}
            </h2>
          )}
          <div className="ed-articulo flex flex-col gap-5 text-[17px] lg:text-[20px] leading-[1.6] text-ink-soft">
            {resto.map((b, i) => {
              if (b.tipo !== 'p') return <BloqueTexto key={i} b={b} />
              const soloNota = /^<em>[\s\S]*<\/em>$/.test(b.html)
              const soloFuerte = /^<strong>[\s\S]*<\/strong>$/.test(b.html)
              const frase = i === ultimo && !soloNota && !soloFuerte && sinEtiquetas(b.html).length <= 120
              if (frase) return <Html as="p" key={i} html={b.html} className="ed-serif-it text-navy text-[21px] lg:text-[24px] leading-[1.35]" />
              if (soloNota) return <Html as="p" key={i} html={b.html} className="text-[15px] lg:text-[16px] max-w-[34em]" />
              return <Html as="p" key={i} html={b.html} className={`max-w-[34em] ${soloFuerte ? 'text-navy' : ''}`} />
            })}
          </div>
          <div className="flex flex-wrap gap-3.5 mt-1.5">
            <Link to="/contacto" className="ed-pill ed-pill-navy">
              {t('nav_contacto')}
            </Link>
            <Link to="/blog" className="ed-pill ed-pill-line">
              {t('blog_mas_articulos')}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} y={0}>
          <Img3D src="/img/3d/conexion-crema.webp" className="ed-3d w-full h-[220px] sm:h-[320px] lg:h-[420px] object-cover" />
        </Reveal>
      </Wrap>
    </section>
  )
}

export default function BlogPostPage() {
  const { id } = useParams()
  const t = useT()
  const lang = useLang()
  const navigate = useNavigate()
  const post = blogPosts.find(p => p.id === id)

  if (!post) {
    return (
      <div className="min-h-screen bg-cream text-ink flex items-center justify-center pt-32 pb-20">
        <Wrap className="text-center flex flex-col items-center gap-6">
          <h1 className="ed-serif font-[320] text-navy leading-none tracking-[-0.02em] text-[clamp(40px,6vw,72px)]">{t('blog_not_found')}</h1>
          <Link to="/blog" className="ed-pill ed-pill-navy">
            {t('blog_volver')}
          </Link>
        </Wrap>
      </div>
    )
  }

  const titulo = l(post.title, lang)
  const [principio, final] = partirTitulo(titulo)
  const bloques = post.content ? leerBloques(l(post.content, lang)) : []

  // Entradilla: el primer párrafo, si va antes del primer título.
  const entradilla = bloques[0]?.tipo === 'p' ? bloques[0].html : l(post.excerpt, lang)
  const cuerpo = bloques[0]?.tipo === 'p' ? bloques.slice(1) : bloques

  // La última sección (desde su título) pasa al cierre, si hay más de una.
  const titulos = cuerpo.flatMap((b, i) => (b.tipo === 'h2' ? [i] : []))
  const corte = titulos.length > 1 ? titulos[titulos.length - 1] : cuerpo.length
  const texto = cuerpo.slice(0, corte)
  const cierre = cuerpo.slice(corte)
  const secciones = texto.flatMap(b => (b.tipo === 'h2' ? [{ texto: b.texto, id: b.id }] : []))

  // Tramos: bloques de texto seguidos van en la grilla con el índice al
  // costado; las cifras y los datos cortan la grilla y ocupan todo el ancho.
  const tramos: Bloque[][] = []
  for (const b of texto) {
    const ultimo = tramos[tramos.length - 1]
    if (vaAncho(b) || !ultimo || vaAncho(ultimo[0])) tramos.push([b])
    else ultimo.push(b)
  }

  // Los enlaces del texto (p. ej. «/contacto») navegan sin recargar la página.
  function enlaceInterno(e: MouseEvent<HTMLElement>) {
    const a = (e.target as HTMLElement).closest('a')
    const href = a?.getAttribute('href')
    if (!href || !href.startsWith('/') || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }

  return (
    <div className="bg-cream text-ink" onClick={enlaceInterno}>
      <SEO
        title={titulo}
        description={l(post.excerpt, lang) || titulo}
        path={`/blog/${post.id}`}
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
            <span className="font-semibold text-navy">{l(post.category, lang)}</span>
            <span>{post.author}</span>
            <span>{l(post.date, lang)}</span>
            <span>{post.readTime}</span>
          </div>
          <TituloEntrada
            className="ed-serif font-[320] text-navy leading-none tracking-[-0.025em] max-w-[15em] text-[clamp(38px,10vw,56px)] sm:text-[clamp(56px,8.4vw,76px)] lg:text-[clamp(72px,6.7vw,96px)] [text-wrap:balance]"
            tramos={principio ? [{ texto: principio }, { texto: final, em: true }] : [{ texto: final, em: true }]}
          />
          <Reveal delay={0.5} y={26}>
            <Html as="p" html={entradilla} className="ed-serif-it text-navy max-w-[32em] text-[clamp(21px,5.4vw,26px)] lg:text-[clamp(26px,2.2vw,32px)] leading-[1.35] [text-wrap:pretty]" />
          </Reveal>
        </Wrap>
      </section>

      <Wrap>
        <img
          src={post.image}
          alt={titulo}
          loading="eager"
          decoding="async"
          className="block w-full h-[230px] sm:h-[380px] lg:h-[560px] object-cover rounded-[20px] lg:rounded-[32px]"
        />
      </Wrap>

      <div className="pt-14 lg:pt-[90px] flex flex-col gap-10 lg:gap-0">
        {tramos.map((tramo, i) => {
          const b = tramo[0]
          if (b.tipo === 'ul' && vaAncho(b)) {
            return formaDeLista(b.items) === 'cifras' ? <Cifras key={i} items={b.items} /> : <Datos key={i} items={b.items} />
          }
          return (
            <Wrap key={i} className={`grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-[72px] ${i > 0 ? 'lg:pt-[90px]' : ''} lg:pb-10`}>
              {i === 0 ? <Indice secciones={secciones} /> : <span className="hidden lg:block" />}
              <div className="ed-articulo flex flex-col gap-6 lg:gap-7 text-[17px] sm:text-[18px] lg:text-[20px] leading-[1.7] text-ink">
                {tramo.map((bloque, j) => (
                  <BloqueTexto key={j} b={bloque} />
                ))}
              </div>
            </Wrap>
          )
        })}
      </div>

      {cierre.length > 0 ? (
        <Cierre bloques={cierre} />
      ) : (
        <Wrap className="mt-12 lg:mt-16 pb-20 lg:pb-[110px]">
          <div className="flex flex-wrap gap-3.5 pt-8 border-t border-navy/20">
            <Link to="/contacto" className="ed-pill ed-pill-navy">
              {t('nav_contacto')}
            </Link>
            <Link to="/blog" className="ed-pill ed-pill-line">
              {t('blog_mas_articulos')}
            </Link>
          </div>
        </Wrap>
      )}
    </div>
  )
}
