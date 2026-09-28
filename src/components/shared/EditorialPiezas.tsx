import { Fragment, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE, Reveal } from '@/components/shared/EditorialReveal'

/* Piezas del diseño «A · Revista» para las páginas internas (Servicios,
   Nosotros, Qué es GTC). Mismo lenguaje que la portada (src/pages/Index.tsx). */

/** Tamaño real de los objetos 3D (public/img/3d): reserva el lugar antes de cargar. */
const IMG_3D = { width: 1200, height: 655 }

export function Wrap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-[72px] ${className}`}>{children}</div>
}

/** Etiqueta de sección: «01 · Perfiles · Elige el que necesitas». */
export function SecTag({ n, name, meta, dark = false }: { n: string; name: string; meta?: string; dark?: boolean }) {
  return (
    <div className={`ed-label flex flex-wrap gap-x-3.5 gap-y-1 ${dark ? 'text-cream/70' : 'text-ink-soft'}`}>
      <span className={`font-semibold ${dark ? 'text-gold' : 'text-navy'}`}>{n}</span>
      <span>{name}</span>
      {meta && <span>· {meta}</span>}
    </div>
  )
}

/** Etiqueta arriba en móvil; a la izquierda del título en escritorio. */
export function SecHead({ tag, children }: { tag: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-5 lg:gap-14 items-end">
      <Reveal>{tag}</Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </div>
  )
}

/** Objeto 3D fundido con el fondo. `primero`: está en el primer pantallazo, se carga ya. */
export function Img3D({ src, className, primero = false }: { src: string; className: string; primero?: boolean }) {
  return (
    <img
      src={src}
      alt=""
      {...IMG_3D}
      loading={primero ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}

/** Tramo del titular: `em` va en cursiva; `subraya` lleva además el subrayado coral. */
export type Tramo = { texto: string; em?: boolean; subraya?: boolean }

/** H1 con entrada palabra por palabra (máscara), como el de la portada. */
export function TituloEntrada({ tramos, className }: { tramos: Tramo[]; className: string }) {
  const reduced = useReducedMotion()
  const palabras = tramos.flatMap(tr =>
    tr.texto
      .split(' ')
      .filter(Boolean)
      .map(w => ({ w, em: !!tr.em || !!tr.subraya, subraya: !!tr.subraya })),
  )
  return (
    <h1 className={className}>
      {palabras.map((p, i) => (
        <Fragment key={i}>
          <span className={`inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em] ${p.em ? 'pr-[0.06em]' : ''}`}>
            <motion.span
              className={`inline-block ${p.em ? 'ed-serif-it' : ''} ${p.subraya ? 'ed-subraya' : ''}`}
              initial={reduced ? false : { y: '112%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.15, ease: EASE, delay: 0.2 + i * 0.055 }}
            >
              {p.w}
            </motion.span>
          </span>{' '}
        </Fragment>
      ))}
    </h1>
  )
}

/** Separa la última palabra de un texto para ponerla en cursiva. */
export function ultimaPalabra(texto: string): [string, string] {
  const corte = texto.lastIndexOf(' ')
  return corte > 0 ? [texto.slice(0, corte), texto.slice(corte + 1)] : ['', texto]
}

/** Parte un título en [principio, final en cursiva]: el paréntesis final
 *  («… (que nadie te explica)»), lo que sigue a «: », o la última palabra. */
export function partirTitulo(texto: string): [string, string] {
  const parentesis = texto.match(/^(.*\S)\s+(\([^()]+\))$/)
  if (parentesis) return [parentesis[1], parentesis[2]]
  const dosPuntos = texto.indexOf(': ')
  if (dosPuntos > 0) return [texto.slice(0, dosPuntos + 1), texto.slice(dosPuntos + 2)]
  return ultimaPalabra(texto)
}
