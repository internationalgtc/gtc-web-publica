import { useT } from '@/hooks/useT'
import { Img3D } from '@/components/shared/EditorialPiezas'

/* «Tu seguridad» — PROPUESTA del lienzo A-portal, sin confirmar (28-sep-2026).
   Vive aislado a propósito: si se descarta, se borra este archivo y cada
   <TuSeguridad /> (portada, bolsa y ficha de vacante), más las claves seg_*.
   Para apagarlo sin tocar las páginas: MOSTRAR = false (una línea).
   «Reportar esta oferta» abre un correo a info@ con el puesto en el asunto:
   el portal no tiene hoy otro canal de denuncia. */

const MOSTRAR = true
const CORREO = 'info@globaltalent-connections.com'

export function TuSeguridad({ puesto, fondo = 'crema' }: { puesto: string; fondo?: 'crema' | 'crema-2' }) {
  const t = useT()
  if (!MOSTRAR) return null
  const asunto = encodeURIComponent(`${t('seg_asunto')}: ${puesto}`)
  return (
    <div
      className={`${fondo === 'crema' ? 'bg-cream' : 'bg-cream-2'} rounded-[20px] lg:rounded-[22px] p-4 sm:p-5 grid grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[88px_minmax(0,1fr)] gap-3.5 sm:gap-4 items-center`}
    >
      <Img3D src="/img/3d/seguridad.webp" className="ed-3d w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] object-cover" />
      <div className="flex flex-col gap-1.5 min-w-0">
        <strong className="ed-serif font-normal text-[19px] sm:text-[20px] text-navy">{t('seg_t')}</strong>
        <span className="text-[14px] leading-[1.5] text-ink-soft">{t('seg_d')}</span>
        <a
          className="self-start text-[14px] font-bold text-navy underline decoration-coral decoration-2 underline-offset-4 hover:text-navy-deep"
          href={`mailto:${CORREO}?subject=${asunto}`}
        >
          {t('seg_reportar')}
        </a>
      </div>
    </div>
  )
}
